import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting (max 6 booking attempts per 5 minutes per IP)
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`booking-${ip}`, 6, 5 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Слишком много запросов. Пожалуйста, повторите попытку через несколько минут." },
        { status: 429 }
      );
    }

    const formData = await request.formData();

    // 2. Anti-spam honeypot
    const honeypot = formData.get("company_fax_hp") || formData.get("website_hp");
    if (honeypot && typeof honeypot === "string" && honeypot.trim().length > 0) {
      // Pretend success to silent drop bot submission
      return NextResponse.json({ success: true });
    }

    // 3. Extract and sanitize input fields
    const tourTitle = (formData.get("tourTitle") as string)?.trim() || "Индивидуальный запрос";
    const name = (formData.get("name") as string)?.trim() || "";
    const phone = (formData.get("phone") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const date = (formData.get("date") as string)?.trim() || "Дата не указана";
    const adults = Math.max(1, parseInt((formData.get("adults") as string) || "1", 10));
    const children = Math.max(0, parseInt((formData.get("children") as string) || "0", 10));
    const wishes = (formData.get("wishes") as string)?.trim() || "";
    const receiptFile = formData.get("receipt") as File | null;

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Пожалуйста, укажите ваше имя." },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 5) {
      return NextResponse.json(
        { error: "Пожалуйста, укажите контактный телефон или мессенджер." },
        { status: 400 }
      );
    }

    // 4. File validation
    let hasReceipt = false;
    let isImageReceipt = false;
    let isPdfReceipt = false;

    if (receiptFile && receiptFile.size > 0) {
      // 10 MB limit
      if (receiptFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Размер файла чека не должен превышать 10 МБ." },
          { status: 400 }
        );
      }

      const mime = receiptFile.type.toLowerCase();
      if (mime.startsWith("image/")) {
        isImageReceipt = true;
        hasReceipt = true;
      } else if (mime === "application/pdf" || receiptFile.name.toLowerCase().endsWith(".pdf")) {
        isPdfReceipt = true;
        hasReceipt = true;
      } else {
        return NextResponse.json(
          { error: "Допустимы только файлы изображений (JPG, PNG, WEBP) или PDF-чек." },
          { status: 400 }
        );
      }
    }

    const bookingId = `AMR-${Date.now().toString().slice(-6)}`;
    const timeNow = new Date().toLocaleString("ru-RU", {
      timeZone: "Asia/Yerevan",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // 5. Construct Telegram HTML message
    const telegramMessage = [
      `⚡️ <b>НОВАЯ ЗАЯВКА НА БРОНИРОВАНИЕ #${bookingId}</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🗺 <b>Тур:</b> ${escapeHtml(tourTitle)}`,
      `📅 <b>Желаемая дата:</b> ${escapeHtml(date)}`,
      `👥 <b>Гости:</b> ${adults} взр.${children > 0 ? ` + ${children} дет.` : ""}`,
      `👤 <b>Заказчик:</b> ${escapeHtml(name)}`,
      `📞 <b>Телефон / Мессенджер:</b> ${escapeHtml(phone)}`,
      email ? `✉️ <b>Email:</b> ${escapeHtml(email)}` : null,
      wishes ? `💬 <b>Пожелания / Детали:</b>\n${escapeHtml(wishes)}` : null,
      `🧾 <b>Чек оплаты:</b> ${hasReceipt ? (isPdfReceipt ? "📎 PDF-документ прикреплён" : "📸 Скриншот чека прикреплён") : "Не прикреплён (уточнить)"}`,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🕒 <i>${timeNow} (время по Еревану)</i>`,
    ]
      .filter(Boolean)
      .join("\n");

    // 6. Save locally for backup (so no booking is ever lost)
    try {
      const backupDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const backupFile = path.join(backupDir, "bookings.json");
      const record = {
        bookingId,
        createdAt: new Date().toISOString(),
        timeNow,
        tourTitle,
        name,
        phone,
        email,
        date,
        adults,
        children,
        wishes,
        hasReceipt,
        receiptFileName: hasReceipt && receiptFile ? receiptFile.name : null,
      };

      let existing = [];
      if (fs.existsSync(backupFile)) {
        try {
          existing = JSON.parse(fs.readFileSync(backupFile, "utf-8"));
        } catch {}
      }
      existing.unshift(record);
      // Keep last 500 bookings
      fs.writeFileSync(backupFile, JSON.stringify(existing.slice(0, 500), null, 2), "utf-8");
    } catch (saveErr) {
      // Ignore if read-only filesystem on serverless
    }

    // 7. Dispatch to Telegram Bot API
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const rawChatIds = process.env.TELEGRAM_CHAT_ID?.trim() || "";
    const chatIds = rawChatIds.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);

    if (!botToken || chatIds.length === 0) {
      console.warn(
        `[AMARAS BOOKING] Telegram credentials missing. Booking #${bookingId} logged. Name: ${name}, Phone: ${phone}`
      );
      return NextResponse.json({
        success: true,
        bookingId,
        message: "Заявка успешно оформлена (режим предпросмотра). Менеджер свяжется с вами.",
      });
    }

    try {
      const caption =
        telegramMessage.length > 1024
          ? telegramMessage.slice(0, 1020) + "..."
          : telegramMessage;

      const fileBuffer = hasReceipt && receiptFile ? await receiptFile.arrayBuffer() : null;
      const fieldName = isPdfReceipt ? "document" : "photo";
      const endpoint = isPdfReceipt
        ? `https://api.telegram.org/bot${botToken}/sendDocument`
        : `https://api.telegram.org/bot${botToken}/sendPhoto`;

      for (const targetChatId of chatIds) {
        try {
          if (fileBuffer && receiptFile) {
            const tgFormData = new FormData();
            tgFormData.append("chat_id", targetChatId);
            tgFormData.append("caption", caption);
            tgFormData.append("parse_mode", "HTML");
            const blob = new Blob([fileBuffer], {
              type: receiptFile.type || "application/octet-stream",
            });
            tgFormData.append(fieldName, blob, receiptFile.name);

            const tgRes = await fetch(endpoint, {
              method: "POST",
              body: tgFormData,
            });

            if (!tgRes.ok) {
              const errData = await tgRes.json().catch(() => ({}));
              console.error(`[AMARAS BOOKING] Media send error for ${targetChatId}:`, errData);
              // Fallback to text message
              await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: targetChatId,
                  text: `${telegramMessage}\n\n⚠️ <i>(Не удалось прикрепить файл ${receiptFile.name})</i>`,
                  parse_mode: "HTML",
                }),
              });
            }
          } else {
            // Text message only
            const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: targetChatId,
                text: telegramMessage,
                parse_mode: "HTML",
              }),
            });

            if (!tgRes.ok) {
              const errData = await tgRes.json().catch(() => ({}));
              console.error(`[AMARAS BOOKING] Text send error for ${targetChatId}:`, errData);
            }
          }
        } catch (perChatErr) {
          console.error(`[AMARAS BOOKING] Error dispatching to ${targetChatId}:`, perChatErr);
        }
      }
    } catch (tgError) {
      console.error("[AMARAS BOOKING] Telegram request failed:", tgError);
    }

    return NextResponse.json({
      success: true,
      bookingId,
    });
  } catch (error) {
    console.error("[AMARAS BOOKING] Unhandled booking error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Пожалуйста, напишите нам напрямую в WhatsApp или Telegram." },
      { status: 500 }
    );
  }
}

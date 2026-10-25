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

    let isJson = false;
    let jsonBody: any = {};
    let formData: FormData | null = null;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      isJson = true;
      jsonBody = await request.json().catch(() => ({}));
    } else {
      formData = await request.formData();
    }

    const getField = (key: string): string => {
      if (isJson) return (jsonBody[key] != null ? String(jsonBody[key]) : "").trim();
      return ((formData?.get(key) as string) || "").trim();
    };

    const getArray = (key: string): string[] => {
      if (isJson) {
        if (Array.isArray(jsonBody[key])) return jsonBody[key].map(String);
        if (jsonBody[key]) return [String(jsonBody[key])];
        return [];
      }
      const raw = formData?.get(key);
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw as string);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {}
      return String(raw).split("\n").map((s) => s.trim()).filter(Boolean);
    };

    // 2. Anti-spam honeypot
    const honeypot = getField("company_fax_hp") || getField("website_hp");
    if (honeypot && honeypot.length > 0) {
      // Pretend success to silent drop bot submission
      return NextResponse.json({ success: true });
    }

    // 3. Extract and sanitize input fields
    const tourTitle = getField("tourTitle") || "Индивидуальный запрос";
    const name = getField("name");
    const phone = getField("phone");
    const whatsapp = getField("whatsapp");
    const telegram = getField("telegram");
    const email = getField("email");
    const date = getField("date") || "Дата не указана";
    const adults = Math.max(1, parseInt(getField("adults") || "1", 10));
    const children = Math.max(0, parseInt(getField("children") || "0", 10));
    const wishes = getField("wishes");
    const carCategory = getField("carCategory");
    const tourFormat = getField("tourFormat");
    const locations = getArray("locations");
    const services = getArray("services");
    const receiptFile = !isJson && formData ? (formData.get("receipt") as File | null) : null;

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

    const isBuilder = locations.length > 0 || !!carCategory || !!tourFormat || services.length > 0;

    // 5. Construct Telegram HTML message
    const telegramMessage = isBuilder
      ? [
          `⚡️ <b>НОВАЯ ЗАЯВКА: ИНДИВИДУАЛЬНЫЙ КОНСТРУКТОР #${bookingId}</b>`,
          `━━━━━━━━━━━━━━━━━━━━━━`,
          `👤 <b>Заказчик:</b> ${escapeHtml(name)}`,
          `📞 <b>Телефон:</b> ${escapeHtml(phone)}`,
          whatsapp ? `💬 <b>WhatsApp:</b> ${escapeHtml(whatsapp)}` : null,
          telegram ? `✈️ <b>Telegram:</b> ${escapeHtml(telegram)}` : null,
          email ? `✉️ <b>Email:</b> ${escapeHtml(email)}` : null,
          `📅 <b>Желаемая дата:</b> ${escapeHtml(date)}`,
          `👥 <b>Гости:</b> ${adults} взр.${children > 0 ? ` + ${children} дет.` : ""}`,
          tourFormat ? `🧭 <b>Формат:</b> ${escapeHtml(tourFormat)}` : null,
          carCategory ? `🚗 <b>Автомобиль:</b> ${escapeHtml(carCategory)}` : null,
          locations.length > 0
            ? `\n🗺 <b>Маршрут (${locations.length} точек):</b>\n${locations.map((loc, i) => `${i + 1}. ${escapeHtml(loc)}`).join("\n")}`
            : null,
          services.length > 0
            ? `\n✨ <b>Дополнительные услуги:</b>\n${services.map((s) => `• ${escapeHtml(s)}`).join("\n")}`
            : null,
          wishes ? `\n💬 <b>Пожелания / Заметки:</b>\n${escapeHtml(wishes)}` : null,
          `━━━━━━━━━━━━━━━━━━━━━━`,
          `🕒 <i>${timeNow} (время по Еревану)</i>`,
        ]
          .filter(Boolean)
          .join("\n")
      : [
          `⚡️ <b>НОВАЯ ЗАЯВКА НА БРОНИРОВАНИЕ #${bookingId}</b>`,
          `━━━━━━━━━━━━━━━━━━━━━━`,
          `🗺 <b>Тур:</b> ${escapeHtml(tourTitle)}`,
          `📅 <b>Желаемая дата:</b> ${escapeHtml(date)}`,
          `👥 <b>Гости:</b> ${adults} взр.${children > 0 ? ` + ${children} дет.` : ""}`,
          `👤 <b>Заказчик:</b> ${escapeHtml(name)}`,
          `📞 <b>Телефон / Мессенджер:</b> ${escapeHtml(phone)}`,
          whatsapp ? `💬 <b>WhatsApp:</b> ${escapeHtml(whatsapp)}` : null,
          telegram ? `✈️ <b>Telegram:</b> ${escapeHtml(telegram)}` : null,
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
        tourTitle: isBuilder ? "Конструктор инд. тура" : tourTitle,
        name,
        phone,
        whatsapp,
        telegram,
        email,
        date,
        adults,
        children,
        tourFormat,
        carCategory,
        locations,
        services,
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

    // 6.1 Record into Portal CRM (content/portal_clients.json)
    try {
      const { createPortalClient } = await import("@/lib/portal-db");
      const routeSummary = locations.length > 0 ? `Маршрут: ${locations.join(" -> ")}` : "";
      const extrasSummary = services.length > 0 ? `Доп: ${services.join(", ")}` : "";
      const autoSummary = carCategory ? `Авто: ${carCategory}` : "";
      const formatSummary = tourFormat ? `Формат: ${tourFormat}` : "";
      const details = [formatSummary, autoSummary, routeSummary, extrasSummary, wishes].filter(Boolean).join(" | ");

      await createPortalClient(
        {
          clientName: name,
          phone1: phone,
          phone2: whatsapp || telegram || "",
          tourTitle: isBuilder ? "Конструктор инд. тура" : tourTitle,
          tourDate: date,
          guestsAdults: adults,
          guestsChildren: children,
          comments: details,
        },
        {
          id: "online-system",
          fullName: isBuilder ? "Конструктор сайта" : "Сайт (онлайн заявка)",
        }
      );
    } catch (portalErr) {
      // Non-blocking
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

export async function GET(request: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
  const rawChatIds = process.env.TELEGRAM_CHAT_ID?.trim() || "";
  const chatIds = rawChatIds.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);

  const url = new URL(request.url);
  const sendTest = url.searchParams.get("test") === "1";

  if (!token) {
    return NextResponse.json({
      status: "error",
      message: "TELEGRAM_BOT_TOKEN не обнаружен на сервере Vercel. Добавьте его в Settings -> Environment Variables и выполните Redeploy.",
      botTokenConfigured: false,
      chatIdsCount: chatIds.length,
    });
  }

  if (chatIds.length === 0) {
    return NextResponse.json({
      status: "error",
      message: "TELEGRAM_CHAT_ID не обнаружен на сервере Vercel. Добавьте его в Settings -> Environment Variables и выполните Redeploy.",
      botTokenConfigured: true,
      botTokenPrefix: token.slice(0, 10) + "...",
      chatIdsCount: 0,
    });
  }

  if (sendTest) {
    const results = [];
    for (const chatId of chatIds) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `🔔 <b>Тест подключения Telegram бота AMARAS</b>\n\nСервер Vercel успешно подключен к Telegram API!\nВремя: ${new Date().toISOString()}`,
            parse_mode: "HTML",
          }),
        });
        const tgData = await tgRes.json();
        results.push({ chatId, ok: tgData.ok, description: tgData.description });
      } catch (err: any) {
        results.push({ chatId, ok: false, error: err.message });
      }
    }

    return NextResponse.json({
      status: "test_completed",
      botTokenConfigured: true,
      botTokenPrefix: token.slice(0, 10) + "...",
      chatIds,
      dispatchResults: results,
    });
  }

  return NextResponse.json({
    status: "ready",
    botTokenConfigured: true,
    botTokenPrefix: token.slice(0, 10) + "...",
    chatIdsCount: chatIds.length,
    chatIds,
    hint: "Добавьте ?test=1 к URL этой страницы, чтобы отправить тестовое уведомление в Telegram",
  });
}

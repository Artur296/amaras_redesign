import { NextRequest, NextResponse } from "next/server";
import { getPortalSession } from "@/lib/portal-auth";
import { getPortalClients, type PortalClient } from "@/lib/portal-db";

function escapeCsvCell(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(req: NextRequest) {
  const session = await getPortalSession();
  if (!session) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const employeeFilter = searchParams.get("employee");

  let clients: PortalClient[] = await getPortalClients();

  // If employee: only their own
  if (session.role === "employee") {
    clients = clients.filter((c) => c.createdByUserId === session.id);
  } else if (employeeFilter && employeeFilter !== "all") {
    clients = clients.filter((c) => c.createdByUserId === employeeFilter);
  }

  // Header row
  const headers = [
    "№",
    "Дата добавления",
    "ФИО Клиента",
    "Телефон 1 (WhatsApp)",
    "Телефон 2 (WhatsApp/Telegram)",
    "Тур / Направление",
    "Дата поездки",
    "Взрослых",
    "Детей",
    "Всего гостей",
    "Комментарий / Пожелания",
    "Сотрудник (Менеджер)",
  ];

  const rows: string[] = [headers.map(escapeCsvCell).join(";")];

  for (const c of clients) {
    const formattedDate = c.createdAt
      ? new Date(c.createdAt).toLocaleString("ru-RU", { timeZone: "Asia/Yerevan" })
      : "";

    const row = [
      c.clientNumber,
      formattedDate,
      c.clientName,
      c.phone1,
      c.phone2 || "",
      c.tourTitle,
      c.tourDate,
      c.guestsAdults,
      c.guestsChildren,
      c.guestsAdults + c.guestsChildren,
      c.comments || "",
      c.createdByUserName,
    ];

    rows.push(row.map(escapeCsvCell).join(";"));
  }

  // UTF-8 BOM (\uFEFF) ensures Excel opens Russian characters without encoding issues
  const csvContent = "\uFEFF" + rows.join("\r\n");

  const nowStr = new Date().toISOString().slice(0, 10);
  const filename = `amaras_clients_${nowStr}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { getPortalSession } from "@/lib/portal-auth";
import {
  createPortalClient,
  deletePortalClient,
  getPortalClients,
  updatePortalClient,
} from "@/lib/portal-db";

export async function GET(req: NextRequest) {
  const session = await getPortalSession();
  if (!session) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const allClients = await getPortalClients();

  // Employee can ONLY see their own records!
  if (session.role === "employee") {
    const ownClients = allClients.filter((c) => c.createdByUserId === session.id);
    return NextResponse.json({ clients: ownClients, role: session.role });
  }

  // Admin sees all clients
  return NextResponse.json({ clients: allClients, role: session.role });
}

export async function POST(req: NextRequest) {
  const session = await getPortalSession();
  if (!session) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { clientName, phone1, phone2, tourTitle, tourDate, guestsAdults, guestsChildren, comments } =
      body;

    if (!clientName || !phone1 || !tourTitle || !tourDate) {
      return NextResponse.json(
        {
          error: "Заполните обязательные поля: ФИО клиента, телефон (WhatsApp), тур и дату поездки",
        },
        { status: 400 }
      );
    }

    const created = await createPortalClient(
      {
        clientName: String(clientName),
        phone1: String(phone1),
        phone2: String(phone2 || ""),
        tourTitle: String(tourTitle),
        tourDate: String(tourDate),
        guestsAdults: Number(guestsAdults) || 1,
        guestsChildren: Number(guestsChildren) || 0,
        comments: String(comments || ""),
      },
      { id: session.id, fullName: session.fullName }
    );

    return NextResponse.json({ ok: true, client: created });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ошибка добавления клиента" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getPortalSession();
  if (!session) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  // CRITICAL PERMISSION: Only Admin can edit clients!
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Редактировать записи клиентов имеет право только администратор" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Укажите ID клиента" }, { status: 400 });
    }

    const updated = await updatePortalClient(id, data, {
      id: session.id,
      fullName: session.fullName,
    });

    if (!updated) {
      return NextResponse.json({ error: "Клиент не найден" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, client: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getPortalSession();
  if (!session) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  // CRITICAL PERMISSION: Only Admin can delete clients!
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Удалять записи клиентов имеет право только администратор" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Укажите ID клиента" }, { status: 400 });
    }

    const deleted = await deletePortalClient(id);
    if (!deleted) {
      return NextResponse.json({ error: "Клиент не найден" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ошибка удаления" }, { status: 500 });
  }
}

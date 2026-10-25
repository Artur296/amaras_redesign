import { NextRequest, NextResponse } from "next/server";
import { getPortalSession } from "@/lib/portal-auth";
import { deletePortalUser, getPortalUsers, updatePortalUserStatus } from "@/lib/portal-db";

export async function GET() {
  const session = await getPortalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  const users = await getPortalUsers();
  // Strip passwordHash before sending to client
  const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
  return NextResponse.json({ users: safeUsers });
}

export async function PUT(req: NextRequest) {
  const session = await getPortalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    const { id, status } = await req.json().catch(() => ({}));
    if (!id || (status !== "approved" && status !== "rejected")) {
      return NextResponse.json({ error: "Неверные параметры запроса" }, { status: 400 });
    }

    const updated = await updatePortalUserStatus(id, status, session.fullName);
    if (!updated) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    const { passwordHash, ...safeUser } = updated;
    return NextResponse.json({ ok: true, user: safeUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getPortalSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Укажите ID сотрудника" }, { status: 400 });
    }

    const deleted = await deletePortalUser(id);
    if (!deleted) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ошибка удаления" }, { status: 500 });
  }
}

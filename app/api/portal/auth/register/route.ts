import { NextRequest, NextResponse } from "next/server";
import { createPortalEmployee } from "@/lib/portal-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { fullName, username, password, phone } = body;

    if (!fullName || !username || !password) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля (ФИО, логин, пароль)" },
        { status: 400 }
      );
    }

    const result = await createPortalEmployee({
      fullName: String(fullName),
      username: String(username),
      password: String(password),
      phone: String(phone || ""),
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      message:
        "Заявка на регистрацию успешно создана! Она отправлена администратору на подтверждение.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ошибка регистрации" }, { status: 500 });
  }
}

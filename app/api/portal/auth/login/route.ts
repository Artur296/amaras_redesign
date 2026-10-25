import { NextRequest, NextResponse } from "next/server";
import {
  PORTAL_ADMIN_PASSWORD,
  PORTAL_ADMIN_USERNAME,
  PORTAL_COOKIE,
  createPortalSessionToken,
  portalCookieOptions,
  verifyPortalPassword,
  type PortalSessionUser,
} from "@/lib/portal-auth";
import { getPortalUserByUsername } from "@/lib/portal-db";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json().catch(() => ({}));
    if (!username || !password) {
      return NextResponse.json({ error: "Укажите логин и пароль" }, { status: 400 });
    }

    const cleanUsername = String(username).trim();
    const cleanPassword = String(password).trim();

    // 1. Check Super Admin credentials
    if (
      cleanUsername.toLowerCase() === PORTAL_ADMIN_USERNAME.toLowerCase() &&
      cleanPassword === PORTAL_ADMIN_PASSWORD
    ) {
      const adminUser: PortalSessionUser = {
        id: "portal-admin",
        username: PORTAL_ADMIN_USERNAME,
        fullName: "Администратор",
        role: "admin",
      };

      const res = NextResponse.json({ ok: true, user: adminUser });
      res.cookies.set(PORTAL_COOKIE, createPortalSessionToken(adminUser), portalCookieOptions);
      return res;
    }

    // 2. Check Employee credentials
    const user = await getPortalUserByUsername(cleanUsername);
    if (!user) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    const passwordMatches = verifyPortalPassword(cleanPassword, user.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    }

    if (user.status === "pending") {
      return NextResponse.json(
        {
          error:
            "Ваш аккаунт ожидает подтверждения администратором. Как только заявка будет одобрена, вы сможете войти в систему.",
        },
        { status: 403 }
      );
    }

    if (user.status === "rejected") {
      return NextResponse.json(
        { error: "Доступ отклонен администратором. Обратитесь к руководству." },
        { status: 403 }
      );
    }

    const sessionUser: PortalSessionUser = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: "employee",
    };

    const res = NextResponse.json({ ok: true, user: sessionUser });
    res.cookies.set(PORTAL_COOKIE, createPortalSessionToken(sessionUser), portalCookieOptions);
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ошибка авторизации" }, { status: 500 });
  }
}

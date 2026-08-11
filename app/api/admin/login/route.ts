import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ADMIN_COOKIE,
  createSession,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json().catch(() => ({}));
  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const rows = (await db()`
    select password_hash from admin_users where username = ${username}
  `) as { password_hash: string }[];

  if (!rows.length || !verifyPassword(password, rows[0].password_hash)) {
    return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSession(username), sessionCookieOptions);
  return response;
}

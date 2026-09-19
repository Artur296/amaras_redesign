import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminUsername,
  createSession,
  hasAdminPassword,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json().catch(() => ({}));
  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  if (!hasAdminPassword()) {
    return NextResponse.json(
      { error: "Admin password is not configured on the server" },
      { status: 503 }
    );
  }

  // Check the password even when the username is wrong, so a wrong username
  // and a wrong password take the same time to answer.
  const passwordOk = verifyAdminPassword(password);
  if (username !== adminUsername() || !passwordOk) {
    return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSession(username), sessionCookieOptions);
  return response;
}

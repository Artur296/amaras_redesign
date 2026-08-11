import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser, hashPassword, verifyPassword } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const username = await getAdminUser();
  if (!username) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { current, next } = await request.json().catch(() => ({}));
  if (typeof current !== "string" || typeof next !== "string" || next.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const rows = (await db()`
    select password_hash from admin_users where username = ${username}
  `) as { password_hash: string }[];
  if (!rows.length || !verifyPassword(current, rows[0].password_hash)) {
    return NextResponse.json({ error: "Current password is wrong" }, { status: 401 });
  }

  await db()`
    update admin_users set password_hash = ${hashPassword(next)}
    where username = ${username}
  `;
  return NextResponse.json({ ok: true });
}

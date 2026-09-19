import { NextRequest, NextResponse } from "next/server";
import { adminUsername, getAdminUser, hashPassword } from "@/lib/admin-auth";

/**
 * Turns a new password into the value to paste into ADMIN_PASSWORD_HASH.
 *
 * The password lives in an environment variable now, and nothing running on
 * Vercel can rewrite its own environment, so the panel cannot apply the
 * change itself. It hashes the password and hands it over instead — which is
 * also why a forgotten password is now recoverable from a phone: set
 * ADMIN_PASSWORD in Vercel and redeploy.
 */
export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    username: adminUsername(),
    // Whether the deployment is using a hash or a plain-text password.
    mode: process.env.ADMIN_PASSWORD_HASH
      ? "hash"
      : process.env.ADMIN_PASSWORD
        ? "plain"
        : "unset",
  });
}

export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { next } = await request.json().catch(() => ({}));
  if (typeof next !== "string" || next.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }
  return NextResponse.json({ hash: hashPassword(next) });
}

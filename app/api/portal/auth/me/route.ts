import { NextResponse } from "next/server";
import { getPortalSession } from "@/lib/portal-auth";

export async function GET() {
  const user = await getPortalSession();
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}

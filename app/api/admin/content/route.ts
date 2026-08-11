import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchContent } from "@/lib/content";
import { getAdminUser } from "@/lib/admin-auth";

const KEYS = ["i18n", "tours", "categories", "site", "hero"] as const;

// Current live content (defaults merged with saved edits), uncached.
export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await fetchContent());
}

export async function PUT(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { key, value } = await request.json().catch(() => ({}));
  if (!KEYS.includes(key) || value === undefined) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  await db()`
    insert into site_content (key, value, updated_at)
    values (${key}, ${JSON.stringify(value)}::jsonb, now())
    on conflict (key) do update
      set value = excluded.value, updated_at = now()
  `;

  revalidateTag("content");
  revalidatePath("/", "layout"); // regenerate every page immediately
  return NextResponse.json({ ok: true });
}

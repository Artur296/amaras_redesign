import { NextRequest, NextResponse } from "next/server";
import { db, hasDb } from "@/lib/db";

/**
 * Legacy: serves images that are still stored in the old database.
 *
 * New uploads are committed to public/images/ and served statically. This
 * route only exists so content saved before the move keeps rendering while
 * scripts/migrate-db-to-files.mjs has not been run yet. Once no content
 * references /api/img/, delete this route, lib/db.ts and the
 * @neondatabase/serverless dependency.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  if (!hasDb()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { name } = await params;
  try {
    const rows = (await db()`
      select content_type, data from images where name = ${name}
    `) as { content_type: string; data: string }[];
    if (!rows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return new NextResponse(Buffer.from(rows[0].data, "base64"), {
      headers: {
        "Content-Type": rows[0].content_type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    // The old database is allowed to be gone; the rest of the site does not
    // depend on it any more.
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Serves admin-uploaded images stored in the database. Names are unique
// (timestamped), so responses can be cached forever.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
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
}

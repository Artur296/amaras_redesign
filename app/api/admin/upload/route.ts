import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/admin-auth";

const MAX_BYTES = 3 * 1024 * 1024;

// Stores the image in the database (base64) and returns a public URL
// served by /api/img/[name]. Keeps everything in the one free DB.
export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Not an image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large (max 3 MB)" }, { status: 400 });
  }

  const clean = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  const name = `${Date.now()}-${clean}`;
  const data = Buffer.from(await file.arrayBuffer()).toString("base64");

  await db()`
    insert into images (name, content_type, data)
    values (${name}, ${file.type}, ${data})
  `;
  return NextResponse.json({ url: `/api/img/${name}` });
}

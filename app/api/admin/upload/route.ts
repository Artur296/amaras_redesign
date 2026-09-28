import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { commitFiles, githubConfig, GitHubError } from "@/lib/github";
import { getAdminUser } from "@/lib/admin-auth";

const MAX_BYTES = 20 * 1024 * 1024;

/**
 * Saves the uploaded image to public/images/ on the filesystem, and if
 * GitHub credentials are set, commits it to the repository.
 */
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
    return NextResponse.json({ error: "Image too large (max 20 MB)" }, { status: 400 });
  }

  const clean = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
  const name = `${Date.now()}-${clean}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // 1. Always save to local public/images/
  const imagesDir = path.join(process.cwd(), "public", "images");
  await fs.promises.mkdir(imagesDir, { recursive: true });
  await fs.promises.writeFile(path.join(imagesDir, name), buffer);

  // 2. If GitHub is configured, also commit to remote repo
  const cfg = githubConfig();
  if (cfg) {
    try {
      await commitFiles(
        cfg,
        [{ path: `public/images/${name}`, content: buffer.toString("base64"), encoding: "base64" }],
        `content: add image ${name} [skip ci]`
      );
    } catch {
      // Image is already saved on local disk
    }
  }

  return NextResponse.json({ url: `/images/${name}`, pendingDeploy: false });
}


import { NextRequest, NextResponse } from "next/server";
import { commitFiles, githubConfig, GitHubError } from "@/lib/github";
import { getAdminUser } from "@/lib/admin-auth";

const MAX_BYTES = 20 * 1024 * 1024;

/**
 * Commits the image into public/images/ and returns the path it will be
 * served from. Vercel serves it as a static file off the CDN, so the site
 * never pays to read it back.
 *
 * The commit is marked [skip ci] on purpose: the image is not live until
 * something references it, and that reference arrives with the next content
 * save, which is the deploy worth spending. The panel previews the local
 * file in the meantime.
 */
export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cfg = githubConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "Uploading is not configured — set GITHUB_TOKEN and GITHUB_REPO" },
      { status: 503 }
    );
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
  const data = Buffer.from(await file.arrayBuffer()).toString("base64");

  try {
    await commitFiles(
      cfg,
      [{ path: `public/images/${name}`, content: data, encoding: "base64" }],
      `content: add image ${name} [skip ci]`
    );
  } catch (error) {
    const message = error instanceof GitHubError ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({ url: `/images/${name}`, pendingDeploy: true });
}

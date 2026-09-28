import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { commitFiles, githubConfig, GitHubError } from "@/lib/github";
import {
  CONTENT_KEYS,
  currentOverrides,
  fetchContent,
  type ContentKey,
} from "@/lib/content";
import { getAdminUser } from "@/lib/admin-auth";

// Current live content (defaults merged with saved edits).
export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await fetchContent());
}

/**
 * Publishes an edit by writing content/*.json to disk, and if GitHub credentials
 * are configured, committing back to the repository.
 */
export async function PUT(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const edits: Partial<Record<ContentKey, unknown>> = {};

  if (typeof body.key === "string") {
    if (!CONTENT_KEYS.includes(body.key) || body.value === undefined) {
      return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    edits[body.key as ContentKey] = body.value;
  } else if (body.values && typeof body.values === "object") {
    for (const [key, value] of Object.entries(body.values)) {
      if (!CONTENT_KEYS.includes(key as ContentKey)) {
        return NextResponse.json({ error: `Unknown key: ${key}` }, { status: 400 });
      }
      edits[key as ContentKey] = value;
    }
  } else {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // 1. Always write changes to content/*.json on the local filesystem
  const contentDir = path.join(process.cwd(), "content");
  await fs.promises.mkdir(contentDir, { recursive: true });

  for (const [key, val] of Object.entries(edits)) {
    const filePath = path.join(contentDir, `${key}.json`);
    await fs.promises.writeFile(
      filePath,
      `${JSON.stringify(val, null, 2)}\n`,
      "utf8"
    );
  }

  // 2. If GitHub is configured, also commit to remote repo
  const cfg = githubConfig();
  if (cfg) {
    const stored = currentOverrides();
    const files = CONTENT_KEYS.map((key) => ({
      path: `content/${key}.json`,
      content: `${JSON.stringify(key in edits ? edits[key] : stored[key], null, 2)}\n`,
    }));

    const changed = Object.keys(edits).join(", ");
    try {
      const sha = await commitFiles(cfg, files, `content: update ${changed} via admin panel`);
      return NextResponse.json({
        ok: true,
        changed: sha !== null,
        commit: sha,
      });
    } catch (error) {
      const message =
        error instanceof GitHubError ? error.message : "GitHub sync failed";
      // We already saved to disk, so don't completely fail
      return NextResponse.json({
        ok: true,
        changed: true,
        warning: `Saved locally, but remote commit failed: ${message}`,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    changed: true,
    local: true,
    message: "Saved to content/*.json",
  });
}

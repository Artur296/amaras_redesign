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
 * Publishes an edit by committing content/*.json back to the repository.
 *
 * Every key is written in one commit, not just the edited one, so a save is
 * a single push and therefore a single Vercel deploy. Keys that did not
 * change produce identical blobs and drop out of the commit on their own.
 */
export async function PUT(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cfg = githubConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "Publishing is not configured — set GITHUB_TOKEN and GITHUB_REPO" },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const edits: Partial<Record<ContentKey, unknown>> = {};

  // Accept one { key, value } (what each tab's Save button sends) or a
  // { values: { key: value } } batch.
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
      // No commit means the values were already live.
      changed: sha !== null,
      commit: sha,
    });
  } catch (error) {
    const message =
      error instanceof GitHubError ? error.message : "Publish failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

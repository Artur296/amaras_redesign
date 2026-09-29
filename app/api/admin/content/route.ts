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
  try {
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

    // 1. Try writing changes to content/*.json on the local filesystem if writable
    let localSaved = false;
    try {
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
      localSaved = true;
    } catch (fsErr) {
      // In serverless environments (e.g. Vercel), the filesystem is read-only
      console.warn("Local filesystem write skipped (read-only):", fsErr);
    }

    // 2. If GitHub is configured, commit to remote repo
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
          error instanceof GitHubError
            ? error.message
            : error instanceof Error
            ? error.message
            : "GitHub sync failed";

        return NextResponse.json(
          {
            error: `Ошибка GitHub: ${message}`,
            warning: localSaved ? "Изменения сохранены локально, но не отправлены в GitHub" : undefined,
          },
          { status: 502 }
        );
      }
    }

    // If GitHub is not configured and local disk is read-only (production Vercel without token)
    if (!localSaved) {
      return NextResponse.json(
        {
          error:
            "Не настроен GITHUB_TOKEN в Vercel. На Vercel файловая система доступна только для чтения, поэтому для публикации необходимо добавить GITHUB_TOKEN в настройках Vercel (Settings → Environment Variables).",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      changed: true,
      local: true,
      message: "Saved to content/*.json",
    });
  } catch (err) {
    console.error("PUT /api/admin/content error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

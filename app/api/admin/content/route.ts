import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { commitFiles, githubConfig, GitHubError } from "@/lib/github";
import {
  CONTENT_KEYS,
  currentOverrides,
  fetchContent,
  setRuntimeOverrides,
  setRuntimeBundle,
  type ContentKey,
} from "@/lib/content";
import { getAdminUser } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

// Current live content (defaults merged with saved edits).
export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await fetchContent());
}

function purgeCaches() {
  const targets = [
    { path: "/[locale]", type: "layout" as const },
    { path: "/[locale]", type: "page" as const },
    { path: "/", type: "layout" as const },
    { path: "/", type: "page" as const },
    { path: "/ru", type: "layout" as const },
    { path: "/hy", type: "layout" as const },
    { path: "/en", type: "layout" as const },
    { path: "/ru", type: "page" as const },
    { path: "/hy", type: "page" as const },
    { path: "/en", type: "page" as const },
    { path: "/ru/tours", type: "layout" as const },
    { path: "/hy/tours", type: "layout" as const },
    { path: "/en/tours", type: "layout" as const },
    { path: "/ru/tour-packages", type: "layout" as const },
    { path: "/hy/tour-packages", type: "layout" as const },
    { path: "/en/tour-packages", type: "layout" as const },
    { path: "/ru/what-to-see", type: "layout" as const },
    { path: "/hy/what-to-see", type: "layout" as const },
    { path: "/en/what-to-see", type: "layout" as const },
    { path: "/ru/guests", type: "layout" as const },
    { path: "/hy/guests", type: "layout" as const },
    { path: "/en/guests", type: "layout" as const },
    { path: "/ru/about", type: "layout" as const },
    { path: "/hy/about", type: "layout" as const },
    { path: "/en/about", type: "layout" as const },
    { path: "/ru/contacts", type: "layout" as const },
    { path: "/hy/contacts", type: "layout" as const },
    { path: "/en/contacts", type: "layout" as const },
    { path: "/ru/fleet", type: "layout" as const },
    { path: "/hy/fleet", type: "layout" as const },
    { path: "/en/fleet", type: "layout" as const },
    { path: "/ru/fleet", type: "page" as const },
    { path: "/hy/fleet", type: "page" as const },
    { path: "/en/fleet", type: "page" as const },
    { path: "/ru/tours/individual", type: "layout" as const },
    { path: "/hy/tours/individual", type: "layout" as const },
    { path: "/en/tours/individual", type: "layout" as const },
    { path: "/ru/tours/individual", type: "page" as const },
    { path: "/hy/tours/individual", type: "page" as const },
    { path: "/en/tours/individual", type: "page" as const },
  ];

  for (const { path: p, type } of targets) {
    try {
      revalidatePath(p, type);
    } catch (e) {
      console.warn(`revalidatePath(${p}, ${type}) warning:`, e);
    }
  }
}

/**
 * Publishes an edit by writing to in-memory runtime cache, /tmp, and disk,
 * instantly purging ISR caches so changes appear with 0-second delay,
 * and committing to GitHub for permanent cloud deployment.
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

    const stored = currentOverrides();
    const fullBundle: Record<string, unknown> = {};
    for (const key of CONTENT_KEYS) {
      fullBundle[key] = key in edits ? edits[key] : stored[key];
    }

    // 1. Immediately apply edits to in-memory runtime cache & bundle & /tmp & local disk
    setRuntimeOverrides(edits);
    setRuntimeBundle(fullBundle as Record<ContentKey, unknown>);

    // 2. Immediately purge Next.js ISR caches so the live site updates with 0-second delay
    purgeCaches();

    // 3. If GitHub is configured, commit to remote repo for permanent deployment
    const cfg = githubConfig();
    if (cfg) {
      const files = [
        ...CONTENT_KEYS.map((key) => ({
          path: `content/${key}.json`,
          content: `${JSON.stringify(key in edits ? edits[key] : stored[key], null, 2)}\n`,
        })),
        {
          path: `content/bundle.json`,
          content: `${JSON.stringify(fullBundle, null, 2)}\n`,
        },
      ];

      const changed = Object.keys(edits).join(", ");
      try {
        const sha = await commitFiles(cfg, files, `content: update ${changed} via admin panel`);
        setRuntimeBundle(fullBundle as Record<ContentKey, unknown>);
        // Purge caches again after commit
        purgeCaches();
        return NextResponse.json({
          ok: true,
          changed: sha !== null,
          commit: sha,
          immediate: true,
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
            warning: "Изменения применены в рантайме, но не отправлены в GitHub",
          },
          { status: 502 }
        );
      }
    }

    // If GitHub is not configured (e.g. purely local development)
    purgeCaches();
    return NextResponse.json({
      ok: true,
      changed: true,
      local: true,
      immediate: true,
      message: "Applied immediately",
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

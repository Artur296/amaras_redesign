import { NextRequest, NextResponse } from "next/server";
import { commitFiles, githubConfig, GitHubError } from "@/lib/github";
import { CONTENT_KEYS, currentOverrides } from "@/lib/content";
import { db, hasDb } from "@/lib/db";
import { getAdminUser } from "@/lib/admin-auth";

/**
 * One-off: copies content out of the old database and into the repository.
 *
 * This runs on Vercel, which can reach the database, so it replaces having
 * to run scripts/migrate-db-to-files.mjs on a laptop.
 *
 * It is deliberately done in steps rather than one request. A site with many
 * uploaded images moves far more data than a serverless function has time
 * for, so the panel walks the images in small batches and finishes with the
 * content itself. Images are committed with [skip ci]; the content commit
 * last is the one that deploys, by which point every image it points at is
 * already in the repository.
 */
export const maxDuration = 60;

const IMG = /\/api\/img\/([A-Za-z0-9._-]+)/g;

function imageNamesIn(value: unknown): string[] {
  return [...JSON.stringify(value ?? null).matchAll(IMG)].map((m) => m[1]);
}

async function storedContent(): Promise<Record<string, unknown>> {
  const rows = (await db()`select key, value from site_content`) as {
    key: string;
    value: unknown;
  }[];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

/** What is still in the database and not yet in the repository. */
export async function GET() {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasDb()) {
    return NextResponse.json({ available: false, reason: "no-database" });
  }

  try {
    const stored = await storedContent();
    const overrides = currentOverrides();
    const keys = CONTENT_KEYS.filter(
      (key) => stored[key] !== undefined && stored[key] !== null
    );
    const images = [...new Set(keys.flatMap((key) => imageNamesIn(stored[key])))];
    return NextResponse.json({
      available: keys.length > 0,
      keys,
      images,
      // True once every key has been written into content/*.json.
      alreadyImported: CONTENT_KEYS.every((key) => overrides[key] !== null),
      counts: {
        tours: Array.isArray(stored.tours) ? stored.tours.length : 0,
        categories: Array.isArray(stored.categories) ? stored.categories.length : 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        available: false,
        reason: "unreachable",
        error: error instanceof Error ? error.message : "Database unreachable",
      },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cfg = githubConfig();
  if (!cfg) {
    return NextResponse.json(
      { error: "Set GITHUB_TOKEN and GITHUB_REPO first" },
      { status: 503 }
    );
  }
  if (!hasDb()) {
    return NextResponse.json({ error: "No database configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));

  try {
    if (body.step === "images") {
      const names: string[] = Array.isArray(body.names) ? body.names : [];
      if (!names.length) {
        return NextResponse.json({ error: "No image names given" }, { status: 400 });
      }
      // One query per name rather than an array parameter: a batch is only
      // a few images, and this cannot quietly bind as the wrong type and
      // come back empty.
      const sql = db();
      const found = await Promise.all(
        names.map(async (name) => {
          const rows = (await sql`
            select name, data from images where name = ${name}
          `) as { name: string; data: string }[];
          return rows[0] ?? null;
        })
      );
      const rows = found.filter((row): row is { name: string; data: string } =>
        Boolean(row)
      );

      if (rows.length) {
        await commitFiles(
          cfg,
          rows.map((row) => ({
            path: `public/images/${row.name}`,
            content: row.data,
            encoding: "base64" as const,
          })),
          `content: import ${rows.length} image(s) from the old database [skip ci]`
        );
      }
      return NextResponse.json({
        ok: true,
        copied: rows.map((r) => r.name),
        // Names with no row are gone from the database; they keep their old
        // URL rather than becoming a broken static path.
        missing: names.filter((n) => !rows.some((r) => r.name === n)),
      });
    }

    if (body.step === "content") {
      const copied: string[] = Array.isArray(body.copied) ? body.copied : [];
      const stored = await storedContent();
      const overrides = currentOverrides();

      const files = CONTENT_KEYS.map((key) => {
        const value =
          stored[key] === undefined || stored[key] === null
            ? overrides[key]
            : stored[key];
        const json = JSON.stringify(value ?? null, null, 2).replace(
          IMG,
          (whole, name) => (copied.includes(name) ? `/images/${name}` : whole)
        );
        return { path: `content/${key}.json`, content: `${json}\n` };
      });

      const sha = await commitFiles(
        cfg,
        files,
        "content: import from the old database via admin panel"
      );
      return NextResponse.json({ ok: true, changed: sha !== null, commit: sha });
    }

    return NextResponse.json({ error: "Unknown step" }, { status: 400 });
  } catch (error) {
    const message =
      error instanceof GitHubError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Import failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

// One-off: copies everything out of the old Neon database into the
// repository, so the database can be deleted.
//
//   node --env-file=.env.local scripts/migrate-db-to-files.mjs
//
// Writes content/*.json, saves every uploaded image into public/images/, and
// rewrites the /api/img/<name> references to the static paths. Review the
// result with `git diff` and commit it. Re-running is safe.
import { neon } from "@neondatabase/serverless";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run with --env-file=.env.local");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEYS = ["i18n", "tours", "categories", "site", "hero"];

const rows = await sql`select key, value from site_content`;
const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
console.log(`Read ${rows.length} content row(s): ${rows.map((r) => r.key).join(", ") || "(none)"}`);

// Every /api/img/<name> the saved content still points at.
const referenced = new Set();
const IMG = /\/api\/img\/([A-Za-z0-9._-]+)/g;
for (const value of Object.values(stored)) {
  for (const [, name] of JSON.stringify(value ?? null).matchAll(IMG)) {
    referenced.add(name);
  }
}
console.log(`Found ${referenced.size} image reference(s).`);

await mkdir(path.join(root, "public/images"), { recursive: true });
let saved = 0;
const missing = [];
for (const name of referenced) {
  const [image] = await sql`select data from images where name = ${name}`;
  if (!image) {
    missing.push(name);
    continue;
  }
  await writeFile(
    path.join(root, "public/images", name),
    Buffer.from(image.data, "base64")
  );
  saved += 1;
  console.log(`  saved public/images/${name}`);
}

await mkdir(path.join(root, "content"), { recursive: true });
for (const key of KEYS) {
  // Only rewrite references whose image actually came across, so a missing
  // one keeps its old URL instead of turning into a broken static path.
  const json = JSON.stringify(stored[key] ?? null, null, 2).replace(
    IMG,
    (whole, name) => (missing.includes(name) ? whole : `/images/${name}`)
  );
  await writeFile(path.join(root, "content", `${key}.json`), `${json}\n`);
  console.log(`  wrote content/${key}.json`);
}

console.log(`\nDone. ${saved} image(s) saved.`);
if (missing.length) {
  console.log(
    `${missing.length} image(s) were referenced but not in the database, so they kept their old URL:`
  );
  for (const name of missing) console.log(`  ${name}`);
}
console.log("\nNext: review with `git diff`, then commit and push.");

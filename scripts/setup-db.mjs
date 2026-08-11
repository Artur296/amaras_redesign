// One-time database setup: creates tables and the admin user.
// Usage: node --env-file=.env.local scripts/setup-db.mjs <admin-password>
import { neon } from "@neondatabase/serverless";
import { scryptSync, randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node --env-file=.env.local scripts/setup-db.mjs <admin-password>");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

await sql`create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
)`;
await sql`create table if not exists admin_users (
  username text primary key,
  password_hash text not null
)`;
await sql`create table if not exists images (
  name text primary key,
  content_type text not null,
  data text not null,
  created_at timestamptz not null default now()
)`;

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
await sql`insert into admin_users (username, password_hash)
  values ('admin', ${`${salt}:${hash}`})
  on conflict (username) do update set password_hash = excluded.password_hash`;

const rows = await sql`select key from site_content`;
console.log("Tables ready. Admin user 'admin' set. Content overrides:", rows.length);

# amarastour

Next.js site for Amaras Tour, deployed on Vercel.

## How content is stored

There is no database. Everything the admin panel edits lives in this
repository:

| What | Where |
| --- | --- |
| Tours, categories, texts, contacts, hero | `content/*.json` |
| Uploaded images | `public/images/` |
| Admin password | `ADMIN_PASSWORD_HASH` env var |

Saving in the admin panel commits those files through the GitHub API. Vercel
sees the push and redeploys, so an edit is live in about a minute. Pages are
fully static: the site does no per-request reads and costs nothing to serve.

A `content/*.json` file holding `null` means "nothing overridden" — the site
falls back to the old database if one is still configured (see *Migrating off
the old database*), and otherwise to the defaults in `lib/tours.ts`,
`lib/i18n.ts` and `lib/site.ts`.

A tour with no `categories` array, or a category with no `id`, is dropped
rather than rendered: one malformed entry should cost that entry, not fail the
build and leave the site with no deploy at all.

## Environment variables

Copy `.env.example` to `.env.local` for local work, and set the same values in
Vercel → Settings → Environment Variables for production.

| Variable | Needed | What it does |
| --- | --- | --- |
| `GITHUB_TOKEN` | to publish | Fine-grained token, this repo only, **Contents: Read and write** |
| `GITHUB_REPO` | to publish | `owner/name` |
| `GITHUB_BRANCH` | optional | Branch the live site deploys from (default `main`) |
| `ADMIN_PASSWORD_HASH` | to log in | From `npm run hash-password "…"` |
| `ADMIN_PASSWORD` | alternative | The password in plain text |
| `ADMIN_USERNAME` | optional | Defaults to `admin` |
| `ADMIN_SESSION_SECRET` | optional | Signs sessions; derived from the password if unset |

Set either `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD`. The hash wins if both
are present.

## Forgot the admin password

No database, no scripts, no laptop:

1. Vercel → the project → Settings → Environment Variables
2. Set `ADMIN_PASSWORD` to a new password (delete `ADMIN_PASSWORD_HASH` if set)
3. Deployments → Redeploy

Then log in and use the **Password** tab to swap back to a hash, which is the
better thing to leave in place.

Changing the password signs out every existing session, because
`ADMIN_SESSION_SECRET` is derived from it unless you set it yourself.

## Why publishing can fail

- **`GitHub 401/403`** — the token expired, or it lacks Contents: Read and write.
- **`GitHub 404`** — `GITHUB_REPO` is wrong, or the token cannot see the repo.
- **Nothing to publish** — the values were already live; no commit, no deploy.

Vercel's free plan allows 100 deploys a day. Each **Publish** button is one
commit and so one deploy, however many fields it changed. Image uploads commit
with `[skip ci]` and do not deploy on their own — they go live with the next
publish that references them.

## Scripts

```bash
npm run dev                        # local dev server
npm run build                      # production build
npm run hash-password "new pass"   # value for ADMIN_PASSWORD_HASH
npm run migrate-db                 # one-off: old database -> files
```

## Migrating off the old database

Content saved before the move is still in the database. Two things bridge
that gap, and both disappear once the import has been run.

**The site keeps rendering it.** For any key whose `content/*.json` is still
`null`, `getContent()` falls back to the old database. That read happens while
the pages are being built, so it costs one query per deploy, not one per
visitor. If the database is unreachable or over its quota the site quietly
falls back to the defaults in `lib/` rather than failing the build.

**The Import tab does the migration.** It runs on Vercel, which can reach the
database, so no laptop is needed:

1. Admin panel → **Import**
2. It reports how many tours, categories and images are there
3. **Import everything**

Images are copied a few at a time — a whole photo library will not fit in one
serverless request — each batch committed with `[skip ci]`. The content commit
comes last and is the one that deploys, by which point every image it points
at is already in the repository. An image referenced by the content but no
longer in the database keeps its old `/api/img/` URL instead of becoming a
broken path. Stopping partway is safe; running it again resumes.

`scripts/migrate-db-to-files.mjs` (`npm run migrate-db`) does the same thing
from a laptop, if you would rather review the diff before it is committed.

Afterwards the database can be deleted, along with `lib/db.ts`, the fallback
in `lib/content.ts`, `app/api/admin/import/`, `app/api/img/[name]/route.ts`
and the `@neondatabase/serverless` dependency.

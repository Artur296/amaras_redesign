# Amaras Tour

Next.js 15 site for a tour operator in Armenia (amarastour.com), in Russian,
Armenian and English. Hosted on Vercel. There is no database: everything the
site shows lives in this repository. README.md covers environment variables,
password recovery and publishing errors.

## Before touching anything

- **Pull first.** The admin panel commits to `main` on its own (`content: …`
  commits, many a day). A local checkout goes stale quickly, and work on an
  old copy will conflict or silently undo edits made in the panel.
- **A push to `main` is a production deploy.** There is no staging. Each push
  is one Vercel build; the plan allows 100 a day.
- Verify with `npx tsc --noEmit` and `npm run build`. There are no tests.
  `npm run dev` serves on port 3000.

## Where things live

| What | Where |
| --- | --- |
| Tours | `content/tours.json` |
| Categories | `content/categories.json` |
| Site texts (all three languages) | `content/i18n.json` |
| Contacts, About photo, logo | `content/site.json` |
| Homepage slideshow | `content/hero.json` |
| Images | `public/images/`, referenced as `/images/…` |
| Admin password, GitHub token | Vercel environment variables only |

A content file holding `null` means nothing has been saved from the panel yet,
so the site uses the built-in defaults: `lib/tours.ts`, `lib/i18n.ts`,
`lib/site.ts`, `defaultHeroImages` in `lib/content.ts`.

- `tours` and `categories` **replace** the defaults wholesale. To change a
  tour, edit `content/tours.json`; editing `lib/tours.ts` changes nothing
  live. `lib/tours.ts` is the fallback and the `Tour` type.
- `i18n` and `site` are **deep-merged** over the defaults. A new text key or
  site field only needs adding in `lib/i18n.ts` / `lib/site.ts`, and every
  page gets the default until someone saves a different value.
- The panel writes JSON with 2-space indentation and a trailing newline. Keep
  that when editing by hand so its commits diff cleanly.

## How the admin panel works

`/admin` → `components/admin/AdminPanel.tsx`. Publishing calls
`app/api/admin/content/route.ts`, which commits the changed `content/*.json`
through the GitHub API (`lib/github.ts`) in one commit; Vercel sees the push
and redeploys. Uploads are committed straight into `public/images/` with
`[skip ci]` and go live with the next publish. Login is checked against
`ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD` (`lib/admin-auth.ts`).

Anything editable in the panel must round-trip through these JSON files. Do not
add a database or a runtime fetch: pages are statically generated from the
repository and cost nothing per visitor.

## Routes

`/ru` is the default locale; `middleware.ts` redirects locale-less paths.
Day tours live at `/[locale]/tours/[category]/[slug]`, multi-day packages at
`/[locale]/tour-packages/[slug]`. A tour is a package when its `categories`
include `packages` (`isPackageTour` in `lib/tours.ts`). URLs that were public
once are kept alive by redirects in `next.config.ts`: renaming a slug or moving
a tour between categories needs a new redirect there.

## Adding or editing tours

The owner supplies tour copy in **Russian only**. Write all three locales
(`ru`, `hy`, `en`) from it and ask only for what the text can't give you,
usually the price. House rules:

- **Meeting time (`meetTime`) is always 15 minutes before `departure`**, never
  the time given in the source text.
- **`priceOldAmd` is a round, struck-through price 20–25% above
  `priceFromAmd`.** Fixed pairs: 10 000→13 000, 15 000→20 000, 20 000→25 000,
  25 000→32 000, 30 000→38 000, 35 000→45 000, 55 000→70 000, 60 000→78 000.
  Never an unround number.
- **"Стоимость рассчитывается индивидуально" means `priceFromAmd: 0`**, which
  the site shows as "price on request". No `priceOldAmd` then.
- **Jeep tours go in the `jeep` category only**, even when the source calls
  them "групповой джип-тур".
- **A 2-day jeep trip stays a jeep tour**, using `days`/`nights`. Only the
  `packages` category makes a multi-day package.
- `featured: false` hides a tour from "Popular tours" on the homepage; it
  defaults to shown.

**Armenian text check:** generated Armenian sometimes turns the letter ֆ into
Hebrew-block characters. Before committing, search the changed JSON for
`[֐-׿]`; there must be no matches.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

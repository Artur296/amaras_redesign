# Current Task

## What We're Building
- Added "Гастротуры" (Gastro & Wine tours) to the homepage Bento Trend Grid ([components/TrendBentoGrid.tsx](file:///c:/Users/amura/Desktop/amaras-tours/components/TrendBentoGrid.tsx)):
  - Placed between "Премиум-отели" and "Экскурсионные туры" in the bottom card row.
  - Generates authentic imagery (`/images/bento-gastro.jpg`) with Areni wine, lavash, grapes and scenic mountain backdrop.
  - Configured multi-language copy (RU: "Гастротуры" / "Винодельни и кухня", HY: "Գաստրո տուրեր" / "Գինի և ավանդական խոհանոց", EN: "Gastro Tours" / "Wineries & cuisine").
  - Linked directly to the Areni Wine and Noravank gastro tour (`/tours/popular/khor-virap-areni-noravank-birds-cave`).
  - Adapted responsive grid: `flex sm:grid sm:grid-cols-2 lg:grid-cols-4` for touch-swipe on mobile, 2x2 grid on tablet, and 4 clean portrait cards on desktop.
  - Registered in [lib/site.ts](file:///c:/Users/amura/Desktop/amaras-tours/lib/site.ts), [content/site.json](file:///c:/Users/amura/Desktop/amaras-tours/content/site.json), [content/bundle.json](file:///c:/Users/amura/Desktop/amaras-tours/content/bundle.json) and [components/admin/AdminPanel.tsx](file:///c:/Users/amura/Desktop/amaras-tours/components/admin/AdminPanel.tsx).
  - Verified `npm run build` (86/86 pages generated cleanly).

## Status
Done

## Last Session Summary
2026-10-19 — Added Gastro tours card to Bento grid with full responsive support and build verification.

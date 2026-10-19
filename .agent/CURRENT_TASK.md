# Current Task

## What We're Building
- Added new category **Мини-группа (Mini-Group)** across the site (`content/categories.json`, `content/bundle.json`, `lib/tours.ts`, `components/TourListingClient.tsx`, `components/CompactCategoryTours.tsx`).
- Re-categorized tours with distinct, natural assignments for each category (Mini-group: all 7 4x4 jeep expeditions + small minivan day tours; Group: standard excursions; Individual: private tours).
- Restored original prices and `priceOldAmd` strikethrough discount prices on tours and packages (e.g. ~~18 000 ֏~~ 15 000 ֏, giving −15% to −23% discount badges).
- Polished "Все туры" dropdown menu in `TourListingClient.tsx`:
  - Fixed button behavior so it stays intuitive, clear, and provides a quick reset button.
  - Dropdown window opens downwards ("сверху вниз") with maximum responsiveness (`max-w-[calc(100vw-32px)]`) preventing clipping on mobile.
  - Accurate counts per category, properly filtering tours without overlaps or 18/18 duplicate results.
  - Cleaned up tour card badge display in `TourCard.tsx` (shows 1 primary format badge instead of cluttering 4 tags).

## Status
Done

## Last Session Summary
2026-10-19 — Added "Мини-группа" category, restored original/old tour prices and strikethroughs, fixed dropdown filter and category badge clutter. Build verified cleanly.

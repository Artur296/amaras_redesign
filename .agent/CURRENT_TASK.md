# Current Task

## What We're Building
- Completely replaced FAQ with all 27 official questions and answers across 5 organized categories.
- Fixed `CompactCategoryTours`:
  - Exactly 2 tours per screen on desktop/tablet with smooth carousel scroll (`sm:w-[calc(50%-12px)]`).
  - Fixed "Забронировать" button text truncation: removed artificial 100px width constraint and added `whitespace-nowrap`.
  - Picked distinct unique tours for each category so cards aren't duplicated.
- Made "Экстрим" (Zipline, Parachute jump, 4×4 off-road, Paragliding, Rafting, etc.) fully editable in the Admin Panel:
  - Added dedicated editor in Admin Panel under `Images` -> `Бенто-сетка` for Card 6.
  - Editable photo, badge (e.g. 4×4), title (ru/hy/en), subtitle (ru/hy/en), link URL, and interactive tag manager for extreme activities (add/remove tags + 1-click fast presets).
  - Updated `TrendBentoGrid.tsx` to dynamically render title, subtitle, badge, link, and activity chips on the card.
  - Updated category in `content/categories.json` to "Джип & Экстрим".

## Status
Done

## Last Session Summary
2026-10-18 — Built interactive Extreme activities editor in Admin Panel, updated Bento Grid and category, verified build (0 errors), and pushed to both `origin/main` and `redesign/main`.

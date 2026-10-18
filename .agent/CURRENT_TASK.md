# Current Task

## What We're Building
- Completely replaced FAQ with all 27 official questions and answers across 5 organized categories.
- Fixed `CompactCategoryTours`:
  - Exactly 2 tours per screen on desktop/tablet with smooth carousel scroll (`sm:w-[calc(50%-12px)]`).
  - Fixed "Забронировать" button text truncation: removed artificial 100px width constraint and added `whitespace-nowrap`.
  - Picked distinct unique tours for each category so cards aren't duplicated.
- Added category filter pills and closing CTA block in FAQ.

## Status
Done

## Last Session Summary
2026-10-18 — Configured 2 tours per screen with carousel scroll in `CompactCategoryTours.tsx`, fixed "Забронировать" truncation with `whitespace-nowrap`, tested build, and pushed to both remotes.

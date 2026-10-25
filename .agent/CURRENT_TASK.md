# Current Task

## What We're Building
- Updated **О нас (About Us)** section (`app/[locale]/about/page.tsx`, `lib/about.ts`):
  - Brand header with subtitle "Ваш гид и друг в Армении".
  - Full heartfelt story about 10+ years of passion, travel philosophy, and team care.
  - Bento grid cards for **Наше видение (Our Vision)** and **Наша миссия (Our Mission)**.
  - 5 core values cards (**Честность и доверие**, **Ответственность**, **Профессионализм**, **Забота о людях**, **Любовь к Армении**).
  - Soulful closing quote block **«И ещё немного от души…»**.
  - Multilingual support across Russian (`ru`), Armenian (`hy`), and English (`en`).
- Mobile Responsiveness Overhaul (`app/[locale]/layout.tsx`, `app/globals.css`, `components/TourListingClient.tsx`, `components/TourCard.tsx`, `components/NoFinePrintCards.tsx`):
  - Fixed mobile horizontal overflow: set `width: 100%` and `max-width: 100%` on `html` and `body` (replacing bug-prone `100vw`).
  - Added proper `width: "device-width", initialScale: 1` to `viewport` export in `app/[locale]/layout.tsx`.
  - Redesigned `TourListingClient.tsx` control bar on mobile:
    - Row 1: Category dropdown button ("Все туры") and Sort dropdown ("По умолчанию") neatly side by side.
    - Row 2: Search input spans 100% full width with `min-w-0`, preventing text truncation and element clipping.
  - Added badge protection (`shrink-0`, `min-w-0`) in `TourCard.tsx` so discount `-23%` and rating `★ 5.0` never clip.
  - Eliminated horizontal scroll across `/tours` and homepage on mobile screens (verified on 360px and 390px viewports).

## Status
Done

## Last Session Summary
2026-10-25 — Fixed mobile horizontal overflow and element clipping across the tour catalog and homepage. Visual test and build (89/89) verified cleanly.


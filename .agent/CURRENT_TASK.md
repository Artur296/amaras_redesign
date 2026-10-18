# Current Task

## What We're Building
- Site-wide edge clearance (mobile & desktop):
  - Solved edge-clipping across all sections (`px-5 sm:px-8 lg:px-12` minimum clearance): Hero, Category Carousel, Bento Grid, Luxury Resort, What to See, Special Offers, No Fine Print, Heritage Banner, Advantages, Reviews, FAQ, Footer, and all subpages (`/about`, `/contacts`, `/guests`, `/what-to-see`).
  - Adjusted review cards & category tour cards to `calc(100vw - 56px)` so carousel items never touch the screen borders when resting or scrolling.
  - Removed negative outer margins (`-mx-4 px-4`) that were spilling content past viewport padding.
- Mobile Navbar overhaul:
  - Eliminated blanket `button, a { min-height: 40px }` on header items that bloated the language switcher and squeezed the navbar elements into device bezels.
  - Scaled mobile logo from `h-9` to `h-7 sm:h-9 md:h-11`.
  - Scaled language switch pills to compact sizes (`px-2 py-0.5 text-[10px]`) and hamburger to circular pill button (`rounded-full h-8 w-8`).
  - Added comfortable safe-area padding (`px-5 sm:px-8 lg:px-12`) to the navbar bar.

## Status
Done

## Last Session Summary
2026-10-18 — Completely eliminated edge-bleed across all sections and subpages, streamlined mobile navbar, verified clean production build (86/86 pages), and pushed changes.


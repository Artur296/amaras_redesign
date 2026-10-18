# Current Task

## What We're Building
- Mobile typography scale, contrast, and touch target optimization for elderly and mobile visitors:
  - `app/globals.css`: Increased mobile base body font size to 16.5px, upgraded muted text contrast to #4a4846, and set legible mobile minimum text sizes without breaking the compact single-line header.
  - `components/CompactCategoryTours.tsx`: Enlarged tour title, duration, category badges, price text, and button sizes.
  - `components/TourCard.tsx` & `components/PackageCard.tsx`: Enlarged tour tags, itinerary chips, inclusions, price indicators, and book buttons.
  - `components/ReviewsSection.tsx`: Enhanced review text to 16-18px with high contrast, increased author name, location, and verified badges.
  - `components/FaqSection.tsx`: Enlarged question headings to 18-24px, answer descriptions to 16-18px, category pills, and full-width contact buttons.
  - `components/TourDetail.tsx`: Enlarged about description, checklist items, itinerary timeline steps, and bottom floating bar booking button.
  - `components/TourInfo.tsx`: Enlarged useful information headings and paragraph text.
  - `components/BookingModal.tsx`: Enlarged form labels, increased guest stepper buttons (`+` and `-`) to 44px (11x11), enhanced payment card number and copy buttons.

## Status
Done

## Last Session Summary
2026-10-18 — Successfully upgraded mobile typography and touch targets across all components, verified production build (86/86 pages statically generated), and pushed to both remotes (origin and redesign).

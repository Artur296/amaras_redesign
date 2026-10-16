# Current Task

## What We're Building
- Review Moderation Workflow:
  1. Reviews submitted by visitors (`ReviewsSection` & `GuestsGallery`) are saved with `approved: false`.
  2. Public website (home carousel, guests gallery, `/api/reviews`) strictly filters and displays only reviews where `approved === true`.
  3. Client optimistic prepend and local storage caching removed to ensure unapproved reviews never show up prematurely.
  4. Submitted reviews enter admin moderation in `/admin` with amber badge count; only when an admin clicks "✓ Одобрить" and publishes changes do they become publicly visible.

## Status
Done

## Last Session Summary
2026-10-16 — Implemented review moderation. Updated `app/api/reviews/route.ts`, `components/ReviewsSection.tsx`, `components/GuestsGallery.tsx`, `app/[locale]/page.tsx`, and `app/[locale]/guests/page.tsx`. Verified build passes with 86 static routes.

## Next Steps
1. Push to both `origin/main` and `redesign/main`.
2. Confirm moderation workflow in `/admin`.

# Current Task

## What We're Building
- Site-wide alignment to 100% upfront payment policy (full payment in advance prior to departure):
  - Updated [components/TourDetail.tsx](file:///c:/Users/amura/Desktop/amaras-tours/components/TourDetail.tsx) payment line from "На месте (без предоплаты)" to "100% предоплата (до поездки)" across all 3 languages (RU, HY, EN).
  - Updated [components/BookingModal.tsx](file:///c:/Users/amura/Desktop/amaras-tours/components/BookingModal.tsx) booking banner and translations to state that full payment (100%) is made in advance prior to departure, and the manager will provide payment details once seat availability is confirmed.
  - Cleaned up obsolete "no prepayment" / "առանց կանխավճարի" phrasing from meta descriptions in [lib/i18n.ts](file:///c:/Users/amura/Desktop/amaras-tours/lib/i18n.ts).
  - Matches the established policy in [lib/faqs.ts](file:///c:/Users/amura/Desktop/amaras-tours/lib/faqs.ts) (FAQ #3: "Для бронирования экскурсий Amaras Tour предусмотрена 100% предварительная оплата").
  - Verified with `npm run build` (86/86 static pages generated with 0 errors).

## Status
Done

## Last Session Summary
2026-10-19 — All payment terms across the site were updated to state 100% full prepayment in advance before departure. Fully built and synced with both remotes.

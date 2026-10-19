# Current Task

## What We're Building
- Temporary removal of payment requisites (card number, Ameriabank, Idram/Telcell phone number, and receipt upload) from the booking modal:
  - Turned off `paymentCard.enabled: false` and cleared placeholder values in [lib/site.ts](file:///c:/Users/amura/Desktop/amaras-tours/lib/site.ts) and [content/site.json](file:///c:/Users/amura/Desktop/amaras-tours/content/site.json).
  - Updated [components/BookingModal.tsx](file:///c:/Users/amura/Desktop/amaras-tours/components/BookingModal.tsx) to only render payment card details and receipt attachment upload when `paymentCard?.enabled && paymentCard?.cardNumber`.
  - Added a clean and reassuring notification banner in all 3 languages (RU, HY, EN) informing the guest that booking is without prepayment and a manager will contact them to confirm seat availability and details.
  - Fully tested build (`npm run build`, 86/86 pages generated) and pushed to `origin/main` and `redesign/main`.

## Status
Done

## Last Session Summary
2026-10-19 — All payment methods and receipt uploads were cleanly disabled in the booking modal until real requisites are provided. Booking works smoothly as a reservation request without upfront payment.

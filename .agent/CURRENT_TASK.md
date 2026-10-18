# Current Task

## What We're Building
- Payment card requisites in booking modal and admin panel:
  - Added dedicated Payment Card block to `BookingModal` right above the receipt upload section:
    - Card number with 1-click copy button (with checkmark confirmation feedback).
    - Bank name badge, cardholder name, phone transfer number (Idram / Telcell) with copy button.
    - Multilingual helper note (RU / HY / EN).
  - Admin panel integration under "Контакты & Реквизиты":
    - Full editing of card number, bank name, cardholder, phone transfer number, and instructions.
    - Toggle to enable/disable card display in the booking form.
    - Live interactive preview of the card in the admin panel.
  - Linked to `site.json` and `lib/site.ts` with zero-downtime instant sync.

## Status
Done

## Last Session Summary
2026-10-18 — Added editable bank payment card requisites to booking modal and admin panel, verified clean build (86/86 pages), and pushed to both remotes.



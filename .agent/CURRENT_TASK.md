# Current Task

## What We're Building
- Mobile booking modal overlay fix:
  - Fixed issue where clicking "Забронировать" from fixed/sticky floating elements (such as `TourDetail` mobile floating bar with `backdrop-blur`) trapped the modal inside the containing block at the bottom of the screen.
  - Portaled `BookingModal` to `document.body` via `createPortal` with SSR-safe mount detection.
  - Implemented high-end mobile bottom sheet layout: slides up from bottom (`rounded-t-[2rem]`, `max-h-[92dvh]`), completely visible, full scroll support, and centered on desktop.
  - Set `z-[9999]` above all floating bars, widgets, and headers.

## Status
Done

## Last Session Summary
2026-10-18 — Fixed BookingModal trapping on mobile by portaling to document.body, verified build (86/86 pages), and pushed to both remotes.







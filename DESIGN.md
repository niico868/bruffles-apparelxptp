# DESIGN.md · Bruffels Apparel × Passport to Paradise

Quiet luxury. Small-to-medium type, lots of space, images do the talking. No giant headlines, no auto-carousels.
Tokens live in `src/styles/global.css` (`@theme`). Use names, never raw values.
Not based on live UXKIN comparisons; direction follows the brief's references (SSENSE, The Row, Aimé Leon Dore).

## Colour
| Token | Value | Role |
|---|---|---|
| paper / paper-2 | #f4f0e8 / #ebe4dc | Bruffels surface, chrome, placeholders |
| ink / ink-soft | #2a1a3d / #625873 | text on paper: deep royal purple instead of black |
| line | #ddd3d0 | hairlines |
| plum / plum-2 / plum-3 | #26153b / #331f4d / #3e2a5c | Passport: matte satin royal purple (`.satin` adds a soft, non-shiny sheen) |
| chalk / chalk-soft | #f0ebf4 / #b6abc6 | text on plum |
| gold / gold-deep | #c4a15a / #84682c | monogram, "1 of 1", stamps, key hovers. Sparingly |

## Type
- Shared chrome + all subheads/body: Manrope.
- Bruffels headings only: Fraunces (`.h-bsa`), a wide, soft luxury serif in the spirit of high-end streetwear. Labels `.label-bsa`: small caps, wide tracking.
- Passport headings: Barlow Semi Condensed uppercase (`.h-ptp`), airport-signage feel. Labels/prices: DM Mono (`.label-ptp`).

## Space & shape
Tailwind 4px scale. Content max 1400px, gutters 16px / 32px. Sections 96px apart. Square corners everywhere except circular stamps and monogram. No shadows.

## Motion
| Brand | Duration | Easing | Moments |
|---|---|---|---|
| Bruffels | 0.6–1.2s | ease-calm (0.22,1,0.36,1) | split-screen 70/30 (0.75s; ignores the cursor for the first 2.5s so the 50/50 split is seen first), image crossfade, 4% hover zoom, labels settle in like gallery tags |
| Passport | 0.15–0.35s | ease-zip (0.5,0,0.1,1) | stamp squash + card shake on add, departure-board price flip (once), plane along dotted path |
Nothing blocks clicks. All motion collapses under `prefers-reduced-motion`.

## Components
Buttons: Bruffels primary = ink fill → gold on hover. Passport = hairline outline → gold. Min 44px tall.
Sold Bruffels pieces stay visible: 45% opacity, greyscale, gold "Gone" stamp.

Cards: both brands share one skeleton (4:5 image + h-24 meta, same column frame), so Shared Drop rows align exactly.

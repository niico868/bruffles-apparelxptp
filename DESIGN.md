# DESIGN.md · Bruffels Apparel × Passport to Paradise

Quiet luxury. Small-to-medium type, lots of space, images do the talking. No giant headlines, no auto-carousels.
Tokens live in `src/styles/global.css` (`@theme`). Use names, never raw values.
Not based on live UXKIN comparisons; direction follows the brief's references (SSENSE, The Row, Aimé Leon Dore).

## Colour
| Token | Value | Role |
|---|---|---|
| paper / paper-2 | #ffffff / #f3f0f5 | site background (white) / image placeholders |
| ink / ink-soft | #22103a / #5d5170 | text on white: dark royal purple |
| chalk / chalk-soft | #f4eee2 / #cdc3ad | text on dark surfaces |
| gold / gold-deep | #c9a55a / #84682c | stamps, piece labels, Claim button |
| royal / -2 / -3 | #261040 / #331656 / #40206a | **Bruffels**: dark matte satin royal purple (`.satin`): hero half + card bodies |
| army / -2 / -3 | #343b24 / #424a2e / #6f6047 | **Passport**: olive drab, raised olive, earth brown (`.fatigue` adds woven texture + sun glow) |
| khaki · sun · leaf · clay | #c8b68e · #e2b340 · #4f7d3c · #a9482f | Passport accents: modern Rasta in a khaki suit. Sun for labels/stamp, leaf for the Board button, clay used rarely |

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
Card meta (both brands): fixed h-44, label + name + price centred on one axis, then the brand button.
- Bruffels **Claim** button: gold hairline; gold fill sweeps in from the left over 0.7s; text turns royal. Sold = dashed "Gone".
- Passport **Board** button: boarding-pass ticket in leaf green, punched side notches, perforated "+1" stub; lifts on hover, squashes on press. Sold out = "Booked".

Buttons: Bruffels primary = ink fill → gold on hover. Passport = hairline outline → gold. Min 44px tall.
Sold Bruffels pieces stay visible: 45% opacity, greyscale, gold "Gone" stamp.

Cards: both brands share one skeleton (4:5 image + h-24 meta, same column frame), so Shared Drop rows align exactly.

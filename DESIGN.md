# DESIGN.md · Bruffles Apparel × Passport to Paradise

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
| royal / `.royal-field` | #261040 / #45207a→#2e1350 | **Bruffles**: hero half (dark satin) and the Shared Drop column (lighter royal field) |
| `.gold-metal` / `.gold-text` | brushed gradient #8a6a2b→#f6e3a6 | Bruffles accents: piece labels, Claim button fill, Gone stamp |
| jet / `.card-jet` | #0e1f38 / #16304f | navy card scheme, now used by **Bruffles** cards (hero Passport half stays navy `.runway`) |
| `.card-light` / `.sky-field` | #fff→#f0f4f9 / #e6f4ff→#d4ebff | **Passport** cards (light) on a very light electric-blue field |
| sky · signal · runway | #7fb8e6 · #f2c230 · #e9eef4 | Passport: ink line art (sky), airport signage yellow (labels, stamp, Board ticket), cloud white |

## Type
- Shared chrome + all subheads/body: Manrope.
- Bruffles headings only: Fraunces (`.h-bsa`), a wide, soft luxury serif in the spirit of high-end streetwear. Labels `.label-bsa`: small caps, wide tracking.
- Passport headings: Barlow Semi Condensed uppercase (`.h-ptp`), airport-signage feel. Labels/prices: DM Mono (`.label-ptp`).

## Space & shape
Tailwind 4px scale. Content max 1400px, gutters 16px / 32px. Sections 96px apart. Square corners everywhere except circular stamps and monogram. No shadows.

## Motion
| Brand | Duration | Easing | Moments |
|---|---|---|---|
| Bruffles | 0.6–1.2s | ease-calm (0.22,1,0.36,1) | split-screen 70/30 (0.75s; ignores the cursor for the first 2.5s so the 50/50 split is seen first), image crossfade, 4% hover zoom, labels settle in like gallery tags |
| Passport | 0.15–0.35s | ease-zip (0.5,0,0.1,1) | stamp squash + card shake on add, departure-board price flip (once), plane along dotted path |
Nothing blocks clicks. All motion collapses under `prefers-reduced-motion`.

## Components
Card meta (both brands): fixed h-44, label + name + price centred on one axis, then the brand button.
- Bruffles card: white meta panel on the royal field; name + price royal purple; gold accents. **Claim** button: brushed-gold edge, gold fades in smoothly (0.3s) on hover. Gone stamp: Montserrat 800 in brushed gold.
- Passport background: `TravelInk` ink-stamped line art (globe, stamps, planes, clouds, flags of St Vincent, Barbados, T&T, Norway, Sweden, Switzerland), visible through translucent cards.
- Product names (both brands): hover = bolder + 6% bigger.
- Passport **Board** button: boarding-pass ticket in signage yellow, punched side notches, perforated "+1" stub; lifts on hover, squashes on press. Sold out = "Booked".

Buttons: Bruffles primary = ink fill → gold on hover. Passport = hairline outline → gold. Min 44px tall.
Sold Bruffles pieces stay visible: 45% opacity, greyscale, gold "Gone" stamp.

Cards: both brands share one skeleton (4:5 image + h-24 meta, same column frame), so Shared Drop rows align exactly.

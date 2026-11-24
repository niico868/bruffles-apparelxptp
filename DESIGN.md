# DESIGN.md · Bruffles Apparel × Passport to Paradise

Quiet luxury. Small-to-medium type, lots of space, images do the talking. No giant headlines, no auto-carousels.
Tokens live in `src/styles/global.css` (`@theme`). Use names, never raw values.
Not based on live UXKIN comparisons; direction follows the brief's references (SSENSE, The Row, Aimé Leon Dore).

## Colour (v2, approved 2026-11-24)
Tokens live in `src/styles/global.css` `@theme`. One job per colour. Ratios are WCAG contrast.

**Bruffles: quiet gallery.** No UI gradients, no pure black on pure white.
| Token | Hex | Role | Contrast |
|---|---|---|---|
| bone | #F4EFE6 | page base | |
| bone-2 | #EAE3D6 | image placeholders, raised panels | |
| hair | #D9D1C3 | hairlines only, never text | decorative |
| ink | #1C1A17 | all type, primary button fill | 15.2:1 on bone |
| ink-soft | #5E584E | secondary text, "Found its owner" | 6.2:1 bone, 5.5:1 bone-2 |
| gold | #C9A24E | monogram on dark, primary CTA hover fill | 7.2:1 with ink |
| gold-deep | #A7832F | monogram + 1-of-1 marks on bone (graphics only) | 3.1:1 on bone |
| gold-text | #7A5E22 | gold text on bone | 5.3:1 on bone |

**Passport: airport wayfinding.**
| Token | Hex | Role | Contrast |
|---|---|---|---|
| char | #1E2023 | page base | |
| char-2 | #2A2D31 | cards, departure-board tiles | |
| char-3 | #363A3F | placeholders, borders on charcoal | |
| paper | #F2F1EC | type on charcoal | 14.4:1 |
| muted | #A3A8AE | secondary text | 6.8:1 char, 5.8:1 char-2 |
| signal | #FFC629 | wayfinding, labels, CTAs | 10.4:1 both ways |
| stamp | #E0393E | stamp moment only, large bold type | 3.8:1 (large/graphic) |

**Seam:** bone meets charcoal along a 1px gold rule; the monogram sits on it in an ink disc (bright gold mark); a signal-yellow runway dash points into Passport.

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

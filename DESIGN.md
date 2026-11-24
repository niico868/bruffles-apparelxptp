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
- Body 16px / 1.6 (Manrope). Labels 12px uppercase: `.label-bf` (Manrope, 0.16em) and `.label-pp` (DM Mono).
- Scale (px): 12 · 14 · 16 · 20 · 24 · 32 · 48 · 72 · 96. Nothing else.
- Bruffles headings `.h-bf`: Fraunces, light optical size. Piece numbers `.num-bf` (047) are set large as a typographic element.
- Passport headings `.h-pp`: Barlow Semi Condensed uppercase, signage feel.
- Montserrat removed (only drew the old GONE stamp).

## Space & shape
- Tailwind 4px scale, only steps 1 2 3 4 6 8 12 16 24 32. Page frame `.wrap`: max 1440px, fluid gutter `--spacing-gutter` (16 to 48px). Sections `--spacing-section` (64 to 128px) apart.
- Square corners. Circles only for the monogram disc and stamps. No shadows.
- Buttons min 48px tall: `.btn-bf` (ink, gold on hover), `.btn-bf-ghost`, `.btn-pp` (signal yellow).

## Layout
- Split hero: two 70%-wide panels overlap; hovering moves the Passport panel and the seam layer with transform only (50/50 to 70/30). Mobile: stacked panels, monogram disc joins them.
- Bruffles collection: lookbook. One feature piece (7/12 image + giant number), then a 2-column grid with the right column dropped 128px on desktop. Gone pieces stay, greyed, "Found its owner".
- Product page: gallery grid left (swipe strip on mobile), sticky buy column right, sticky bottom buy bar on mobile, size drawer, certificate-style authenticity section.
- Passport: departures board (flip-in rows) + item cards on charcoal.

## Lockups
"BA × PTP" on the homepage, "BA" on Bruffles pages, "PTP" on Passport pages (Divine, 2026-11-24). Piece IDs: BA-047.

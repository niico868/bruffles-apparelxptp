# DESIGN.md · Brussels Apparel × Passport to Paradise

Quiet luxury. Small-to-medium type, lots of space, images do the talking. No giant headlines, no auto-carousels.
Tokens live in `src/styles/global.css` (`@theme`). Use names, never raw values.
Not based on live UXKIN comparisons; direction follows the brief's references (SSENSE, The Row, Aimé Leon Dore).

## Colour
| Token | Value | Role |
|---|---|---|
| paper | #f4f0e8 | Brussels surface, site chrome |
| paper-2 | #ebe5d9 | image placeholders, raised |
| ink | #1c1b19 | primary text on paper |
| ink-soft | #625d55 | secondary text on paper (6.1:1) |
| line | #d9d2c4 | hairlines |
| coal / coal-2 | #1d1e20 / #2a2b2e | Passport surface / cards |
| chalk / chalk-soft | #ece9e2 / #a19e96 | text on coal |
| gold | #b8964e | monogram, "1 of 1", stamps, key button hover. Sparingly |
| gold-deep | #85692e | gold text on paper (4.6:1) |

## Type
- Shared (nav, cart, checkout): Inter.
- Brussels: Instrument Serif headlines (24–40px), Inter body 15px. Labels `.label-bsa`: 11px small caps, 0.18em tracking.
- Passport: Space Grotesk headlines, DM Mono labels `.label-ptp` (11px, 0.08em).

## Space & shape
Tailwind 4px scale. Content max 1400px, gutters 16px / 32px. Sections 96px apart. Square corners everywhere except circular stamps and monogram. No shadows.

## Motion
| Brand | Duration | Easing | Moments |
|---|---|---|---|
| Brussels | 0.6–1.2s | ease-calm (0.22,1,0.36,1) | split-screen 70/30, image crossfade, 4% hover zoom, labels settle in like gallery tags |
| Passport | 0.15–0.35s | ease-zip (0.5,0,0.1,1) | stamp squash + card shake on add, departure-board price flip (once), plane along dotted path |
Nothing blocks clicks. All motion collapses under `prefers-reduced-motion`.

## Components
Buttons: Brussels primary = ink fill → gold on hover. Passport = hairline outline → gold. Min 44px tall.
Sold Brussels pieces stay visible: 45% opacity, greyscale, gold "Gone" stamp.

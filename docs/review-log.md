# Review log: wall, demand and archive build (2026-11-25)

Screenshots: Playwright, home and /bruffles at 375/768/1280/1920 (hero at rest, Bruffles focused, Passport focused, plus one mid-switch), /bruffles/archive, BA-047 (unsold), BA-046 (Gone), /verify/BA-046 at 375 and 1280. Final set at 2x in project files `wall-demand/screens/`.
Speed: Lighthouse 12 mobile preset against `dist/` served with Brotli (what Cloudflare does).

| # | Criterion | Pass 1 | Pass 2 | Pass 3 |
|---|---|---|---|---|
| 1 | Both hero panels have media at every size; Passport film reads as Passport | 8 | 8 | 9 |
| 2 | Bruffles hero has no product card and no gap; seam on the line | 9 | 9 | 10 |
| 3 | Demand line quiet, legible at 375, not a marketplace badge | 9 | 9 | 9 |
| 4 | Request it back works by touch, count and state update | 8 | 9 | 10 |
| 5 | Wall looks like real paper, readable at 375 | 7 | 8 | 9 |
| 6 | Sign page canvas works by finger and by mouse | 6 | 6 | 10 |
| 7 | Image consistency across new slots | 5 | 9 | 9 |
| 8 | Motion calm on Bruffles, reduced motion respected | 9 | 9 | 9 |
| 9 | Performance: LCP < 2.5s, CLS < 0.05, video budgets | 6 | 7 | 9 |
| 10 | Honesty: demo numbers only in demo-signals.ts, demo notes, credits | 9 | 9 | 9 |

## Pass 1
- 7 (5): the five demo sold pieces (BA-035 to 040) showed empty navy boxes in the archive and on their pages.
- 6 (6): tapping Sign threw "Cannot read properties of null (getContext)" and blanked the form; the gold demo banner covered the header.
- 9 (6): mobile LCP 2.9s on the home page; 683 KB Passport phone film downloaded before anyone tapped it; 105 KB Passport badge shown at 56px.
- 375 overflow (page 388px wide) from the wall caption strip: fixed before pass 1 screenshots were scored.
**Fixes:** demo pieces borrow their sample fit photo (`pieceImages` fallback in media.ts); archive photo background neutral so grey stays grey; canvas effect guarded and signed card scrolls into view; banner moved to the bottom with body padding; phone film `preload="none"`; 200px badge and monogram copies.

## Pass 2
- 5 (8): wall meta cut off the area at 375 ("BA-040 · NIKE · TUNAP..."); header line "· 147 pieces" sat lower than "Customer Verified".
- 9 (7): /bruffles CLS 0.11 from the UI font swapping in; BA-047 LCP 4.1s because a full-size 209 KB photo loaded for the 40px buy-bar thumb.
- a11y: tag-photo placeholder text failed contrast; archive headings skipped a level.
**Fixes:** brand drops from wall meta under 640px; header line is a flex row; Archivo Narrow 400 preloaded; `toPic` src is now the asked-for size (thumb 160px, share 1200px); first gallery and first 3 archive photos eager, first one high priority; contrast and heading fixes.

## Pass 3 (final)
- LCP (median of 2 runs): home 1.66s, /bruffles 1.24s, BA-047 1.9s, BA-046 1.4s, archive 1.52s, verify 1.3s. CLS 0 everywhere. Accessibility 100 on all six.
- Films: hero-pp 1.49 MB / webm 1.24 MB (budget 2.5), phone 794 KB / 683 KB (budget 1.2). `check-media.mjs` enforces both.
- Seam: centre = Passport edge at 375 (vertical), 768, 1280, 1920 and mid-switch (427.95 = 427.95).
- Touch tests: Save toggles, rolls 21 to 22, survives reload; Request it back by tap: Requested, 18 to 19, toast; signature by CDP touch and by mouse, card renders; consent unchecked by default; reduced motion: wall animation none.
- Remaining below 10 and why: 1, Passport film is stock baggage footage until real clips arrive; 5, signatures are font-made; 9, measured locally, not on the live CDN.

## Round 3 (2026-11-25)
- Hero contrast checked on the brightest film frame at 1280 and 375. Drop Log poster checked at 1280 and 375. Looping reveal: classes toggle in, out on scroll back, in again. Screens: /mnt/project-files/round3/screens/.

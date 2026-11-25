# Progress

## Session 1 · Phase 0 demo
**Built**
- Astro site with design tokens (DESIGN.md).
- Homepage: hover split screen (70/30, 0.6s, gold monogram rides the seam, "Enter" fades in; mobile stacks, tap to expand) + "Shared Drop" two-column section.
- Brussels product page `/brussels/BSA-047`: 6-shot gallery, size drawer, authenticity block, TTD estimate. Sold example: `/brussels/BSA-046`.
- Passport cards: stamp smack + shake on add, departure-board price flip, plane on a dotted flight path.
- Mock data in `src/data/products.ts`; tiny local cart.

**Next:** Cloudflare preview link → Phase 1 (Supabase catalogue).

**Nico to do**
- Install the Claude GitHub App on this repo so pushes work: https://github.com/apps/claude/installations/select_target
- Send Higgsfield assets: 2 split-screen loops, stamp graphic, product shots.

**Test on the Chromebook:** `npm install` then `npm run dev`, open http://localhost:4321, hover each half, add a Passport item, open the size drawer.

## Chromebook fix
Nico's Chromebook CPU has no AVX2, so Astro's native compiler crashed with "Illegal instruction".
`npm run dev` now forces the universal WASM compiler (`NAPI_RS_FORCE_WASI=1`). `npm run dev:fast` uses the native one on newer machines. Builds (Cloudflare) stay native.

## Hosting
Cloudflare Workers project `bruffles-apparelxptp` builds this branch (`npm run build`, serves `dist/` via `wrangler.jsonc`).
Local dev on the Chromebook is not needed: preview on the .workers.dev link instead.

## Session 2 · Design tweaks
- Split screen waits 2.5s before reacting to the mouse, then eases 20% slower (0.75s).
- Shared Drop: Brussels and Passport cards now line up row for row.
- New brand pages `/brussels` and `/passport`; split-screen "Enter" goes to them. New `/authenticity` page; nav links work.
- Palette: black replaced with deep royal purple; Passport side is matte satin purple.
- Fonts: Fraunces (Brussels headings), Manrope (body), Barlow Semi Condensed + DM Mono (Passport).
**Blocked:** Supabase project "Brussels apparel XPTP" isn't visible to the connected account (only Neikoli Devs is). Nico to check its organization.

## Session 3 · Hero behaviour + rename
- Brand renamed Brussels → **Bruffels** across the site; pages now at `/bruffels`.
- Split screen can't widen until **10s after the first mouse movement** (and 20+ movements). Tested: widened at 10.6s.
- Open (70%) side: heading 1.5× bigger, logo slot in the top corner, brand video plays. Switching sides pauses the other video. Click the video or press Space to play/pause; no icons.
- Media slots in `src/data/media.ts` (poster, video, logo per brand). Files go in `public/media/`.
- Scroll cutoff: once the line 2rem above the brand text scrolls under the header, the hero snaps to 50/50 and hover is disabled until you scroll back up. Tested: hover works up to the line, locks just past it.

## Session 4 · Brand colours + buttons
- Site background now white. Bruffels = dark royal purple (hero half + card bodies, gold piece labels, gold Gone stamp).
- Passport = modern Rasta in a khaki suit: olive drab, earth brown, sun gold, leaf green.
- Card label + name centred on both brands, both still aligned row for row.
- New brand buttons: Bruffels "Claim · 1 of 1" (slow gold sweep), Passport boarding-pass "Board" ticket. Short labels on phones.

## Session 5 · Gold + airport
- Bruffels column: royal purple field, white card panels, royal purple name/price, brushed-gold accents, Montserrat "GONE" stamp. Claim button now just fades to gold.
- Passport: airport palette (night navy, sky, signage yellow) + ink-stamped line art (globe, stamps, planes, clouds, six country flags) seen through translucent cards.
- Name hover on both brands: bolder + bigger. Passport names/images open new product pages `/passport/PTP-xx` (with bulk quantity stepper).
- Bruffels product page: "Favorited X times · Carted X times" beside the description (mock numbers until Phase 1).

## Session 6 · Swap + speed
- BSA → **BFA** (monogram, nav, piece IDs: BFA-047 etc.).
- Card schemes swapped: Bruffels = navy cards on royal purple; Passport = light cards on a very light electric-blue field. Cards have a soft off-card light spot.
- Labels, View all / All departures, Claim/Gone text enlarged to product-name size.
- Hero logos ride down under the navbar while scrolling, stopping 16px above the "1 of 1" / "Gate 02" labels.
- **Performance:** the live ink filter caused the lag (34.6ms avg / 100ms worst frames). Art is now a pre-rendered image (`public/art/travel-ink.webp`, re-render with `node scripts/render-ink.cjs`). Now 16.6ms avg / 16.8ms worst = smooth 60fps.

## Session 7 · Mobile tap fix + finish palette
- Fixed: on phones, tapping Passport didn't open it (one shared scroll lock was judged by the Bruffels text). Now each half has its own lock. Tested on emulated iPhone 12 at the top and scrolled.
- Palette: royal purple removed. Bruffels = aubergine satin hero, navy satin cards, champagne-ivory panel, brushed gold. Passport = Swedish passport cover hero (generated: `scripts/passport-cover.svg` → `public/art/passport-cover.webp`), light electric-blue panel, white cards, signage yellow. Page = porcelain white.

## Session 8 · Step 1: name and truth fixes
- Spelling is **Bruffles** everywhere: copy, page titles, meta, new OG/Twitter tags. Routes `/bruffles`; `public/_redirects` 301s old `/bruffels` links.
- Removed: Favorited/Carted counts, "Est. Port of Spain", "Ships worldwide", TTD estimates (product + Passport pages).
- Sourcing line: "Purchased from official brand stores — receipt on file". No brand-partnership wording.
- Authenticity page trimmed to the 3 confirmed steps (official store → receipt per restock → tag photo). Removed unconfirmed claims (six shots, emailed certificate).
- Monogram letters + BFA piece prefix: waiting on the client's confirmation.

## Session 8 · Steps 2 to 6 (branch `claude/elevate-demo`)
- Colour system v2 (bone/ink/gold for Bruffles, charcoal/signal/stamp for Passport), documented with contrast ratios in DESIGN.md.
- Real logos in `public/brand/` (gold monogram cut from the store artwork, Passport badge). Lockups: BA × PTP (home), BA, PTP. Piece IDs BA-047; `_redirects` forwards BFA links.
- New layout: transform-only split hero, lookbook collection, Nike-style product page with certificate, departures board.
- New sections: sticky header + menu, How authenticity works, drop alerts (demo success state), Gone strip, story [CLIENT TO WRITE], footer + policy placeholders, 18+ gate on Passport pages, Ask about this piece.
- Motion tested at 4x CPU slowdown: 60fps on hero, plane, stamp and reveals after load.
- Removed: purple/navy/sky palette, travel-ink art, Swedish passport cover, Montserrat.
- 2026-11-24: Divine approved; `claude/elevate-demo` merged into the live branch `claude/phase-0-demo`.
- Note: Cloudflare branch-preview builds fail (logs only in the dashboard), and Cloudflare skips a production build for a commit it already built as a preview. Always land a fresh commit on the live branch to trigger a deploy.

## Session 9 · KOI merge (branch `claude/koi-merge`, PR for Divine's approval)
- Direction approved 2026-11-24: split hero with campaign media. Bone background and Archivo Narrow kept as defaults.
- Homepage cut to 8 blocks (see DESIGN.md). Moved off the homepage: Gone strip (gone pieces already show greyed in the collection), Our story (waits for client text), standalone drop alerts (now in every footer).
- Media framework: `src/data/media.json` + `src/assets/media/` + `public/media/`, folder READMEs, `scripts/check-media.mjs` before every build.
- Product page: KOI gallery + viewer, one size box, story box, tabs, sticky mini bar, More 1 of 1s, Product JSON-LD.
- Header: Archivo labels, "Shop Bruffles / Shop Passport", compact after 40px scroll, menu button + home link labels fixed. CSS inlined into each page.
- Lighthouse mobile (local, compressed like Cloudflare): home 100/100/100/100, BA-047 100/100/100/100; LCP 1.3 s / 1.5 s.
- Client gaps: piece story, delivery, care, Passport two-up button labels, restock rhythm wording, Instagram links, all photos and the film.

## Session 10 · Hero motion rework (branch `claude/hero-motion`, PR for Divine's approval)
- Hover arming back: the split stays 50/50 until 10s after the first mouse movement or 20 movements (counted at most every 250ms), whichever comes first. Fresh on every page load.
- Copy scales per side: full at 50% and 70%, 38% at 30% (animated `--k`, floor ~10px for small text), headline/body to one line when shut.
- Corner logos: BA monogram top-left, PTP badge top-right; visible at 50% and 30%, fade out at 70%. Centre circle now a placeholder for the merged logo (`MERGED_LOGO` in SplitHero.tsx).
- Featured piece 047 (BA) and the Passport stage badge only show at 70%.
- Films: no autoplay on load. First open plays, other side pauses, re-opening stays paused until click or Space. Off under reduced motion / data saver.
- Fixes: hover could move the Passport panel in the stacked (narrow) layout; old 1.2s grace timer replaced by arming.
- Removed dead code: `GoneStrip.astro` and `SizeDrawer.tsx` (no longer imported since the KOI merge), Monogram `disc` option.

## Session 11 · AI product photos (branch `claude/one-photo-flatlays`)
- Divine 2026-11-25: one photo per product. Generated with Higgsfield Seedream 5.0 Flash 2K (0.5 credits each, 22 images incl. 2 redos = 11 credits). Prompts: project files `flatlays/flatlay-prompt.md`.
- Bruffles: white-ground studio flat lay per piece (`src/assets/media/pieces/<ID>.jpg`); BA-047 also has 6 detail shots (`pieces/BA-047/02-back … 07-fabric`, number = gallery order, rest of the name = label).
- Passport: one photo per item on walnut (`src/assets/media/passport/<ID>.jpg`), flat items top-down, standing items front view; homepage two-up `home/pp-1`, `home/pp-2`.
- Code: `pieceImages()` / `passportImage()` in `src/data/media.ts`; BrufflesCard, ProductTile, Gallery, PassportCard, Passport page and the hero's featured 047 now use them. Removed `SwapImage.astro` (no second photo to swap to).
- These are AI placeholders for the demo catalogue. Real stock: owner's phone photo of the actual piece goes in as the reference image.

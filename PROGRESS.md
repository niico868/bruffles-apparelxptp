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

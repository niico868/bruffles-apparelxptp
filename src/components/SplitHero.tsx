import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Monogram from "./Monogram";
import PlaneFlight from "./PlaneFlight";
import FlipPrice from "./FlipPrice";
import type { Pic } from "../lib/pic";
import type { HeroVideo } from "../data/media";

export type PanelMedia = { desktop?: Pic; mobile?: Pic; video?: HeroVideo };

/*
 * Homepage split hero: Bruffles Apparel (BA, left) and Passport to Paradise (PTP, right).
 *
 * States, per side:  "even" = 50/50 (nothing chosen)
 *                     "open"  = this side takes 70% (computer: mouse over it; phone: tapped)
 *                     "shut"  = this side gets 30% (the other side is open)
 *
 *            corner logo   copy size            hero film
 *   even     shown         full                 paused
 *   open     fades out     full                 plays (first time only, see videos)
 *   shut     shown         SHUT_K (about 38%)   paused
 *
 * Bruffles panel = campaign film or still, monogram, headline, sub-line and one CTA ("Enter Bruffles").
 * No product card in the hero (Divine, 2026-11-25): campaign imagery leads, products follow below.
 *
 * Computer (768px+): side by side. Two overlapping panels, each 70% of the hero wide. Only the
 * Passport panel and the seam layer move, and only with transform, so opening never triggers page
 * layout. The copy block in each panel is 30% of the hero wide, so it is fully visible in every state.
 *
 * Phone (< 768px): stacked, one screen tall. Tapping a panel opens it to 70% of the height (the
 * panels' flex-grow animates); tapping the open panel again plays or pauses its film. No arming on
 * phones: a tap is always deliberate. Tapping the centre circle puts both sides back to 50/50.
 *
 * Corner logos (Divine, 2026-11-25): same height for both brands, bottom right of each half. They
 * live on the hero, not in the panels: BA's rides the seam layer, so it stays at the right edge of
 * the Bruffles half as the seam moves; PTP's sits at the hero's bottom right.
 */

type Side = "bf" | "pp";
type Size = "even" | "open" | "shut";
const SIDES: Side[] = ["bf", "pp"];

const EXPO = [0.16, 1, 0.3, 1] as const;   // same curve as --ease-calm
const DURATION = 0.8;                       // seconds; keep in step with .hero-copy in global.css
const OPEN = 0.2;          // a hovered side gains 20% of the hero width (50/50 -> 70/30)
const PANEL = 0.7;         // each panel is 70% of the hero wide; the extra hides under the other panel

// Hover arming (Divine, 2026-11-25): on every page load the split stays still. Hover can only widen
// a side once the visitor has been moving the mouse for ARM_MS, or after ARM_MOVES separate
// movements, whichever comes first. A "movement" is counted at most once per MOVE_GAP_MS, so a
// single swipe (which fires dozens of pointer events) counts as a few movements, not dozens.
const ARM_MS = 10_000;
const ARM_MOVES = 20;
const MOVE_GAP_MS = 250;

// Copy scale for the shut (30%) side. global.css transitions --k between 1 and this value.
// Small text keeps a legibility floor so it never drops below ~10px.
const scaled = (full: string, floor = "0px") => `max(${floor}, calc(${full} * var(--k)))`;

export default function SplitHero({ media = {} }: { media?: { bf?: PanelMedia; pp?: PanelMedia } }) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const desktop = useDesktop();
  const armed = useHoverArming();
  const [active, setActive] = useState<Side | null>(null);
  const sizeOf = (s: Side): Size => (active === null ? "even" : active === s ? "open" : "shut");

  // Films only when motion is welcome and the visitor isn't saving data.
  const [playOk, setPlayOk] = useState(false);
  useEffect(() => { setPlayOk(!reduce && !(navigator as any).connection?.saveData); }, [reduce]);
  const videos: Record<Side, RefObject<HTMLVideoElement | null>> = { bf: useRef(null), pp: useRef(null) };
  useHeroVideos(videos, active, playOk, root);

  const bf = media.bf ?? {}, pp = media.pp ?? {};
  const bfHas = !!(bf.desktop || bf.mobile), ppHas = !!(pp.desktop || pp.mobile);

  // Switching between phone and computer layout (window resized) starts again at 50/50.
  useEffect(() => setActive(null), [desktop]);

  const shift = active === "bf" ? OPEN : active === "pp" ? -OPEN : 0;   // seam movement, share of the hero
  const t = { duration: reduce ? 0 : DURATION, ease: EXPO };
  // Seam movement: sideways on a computer, downwards on a phone (percent of the hero, via the inset-0 layer).
  const seamMove = desktop ? { x: `${shift * 100}%`, y: 0 } : { x: 0, y: `${shift * 100}%` };
  // Phone panel heights (flex-grow shares of the hero). Ignored on a computer, where panels are absolute.
  const grow = (s: Side) => 0.5 + (s === "bf" ? shift : -shift);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !armed || !desktop || !root.current) return;
    if ((e.target as HTMLElement).closest("[data-seam]")) return;   // resting on the centre circle changes nothing
    const r = root.current.getBoundingClientRect();
    const seam = r.left + r.width * (0.5 + shift);
    const next: Side = e.clientX < seam ? "bf" : "pp";
    if (next !== active) setActive(next);
  };

  // Click or tap on a panel (anywhere but a link). Phone: a tap on a closed panel opens it.
  // Both: a click on the open panel plays or pauses its film.
  const onClick = (e: React.MouseEvent) => {
    const el = e.target as HTMLElement;
    if (el.closest("a, button")) return;
    const side = el.closest<HTMLElement>("[data-side]")?.dataset.side as Side | undefined;
    if (!desktop && side && side !== active) setActive(side);
    else if (active) toggleVideo(videos[active].current);
  };

  return (
    <div ref={root} className="relative flex flex-col h-[100svh] min-h-[560px] overflow-hidden md:block md:min-h-[640px]"
      onPointerMove={onMove} onPointerLeave={(e) => { if (e.pointerType === "mouse") setActive(null); }} onClick={onClick}>

      {/* ---------- Bruffles panel ---------- */}
      <motion.section data-side="bf" aria-labelledby="hero-bf"
        className="bf relative basis-0 min-h-0 md:absolute md:inset-y-0 md:left-0 md:w-[70%] overflow-hidden"
        initial={false} animate={{ flexGrow: grow("bf") }} transition={t}>
        <HeroMedia m={bf} eager scrim="from-ink/75" playOk={playOk} open={active === "bf"} videoRef={videos.bf} desktop={desktop} />

        <div data-size={sizeOf("bf")} className={`${COPY} md:pr-[max(var(--spacing-gutter),calc(64px*var(--k)))]`}>
          <Monogram tone={bfHas ? "bright" : "deep"} className="relative rise w-auto self-start" style={markStyle} />
          <h2 id="hero-bf" className={`relative rise h-koi ${bfHas ? "text-bone" : ""}`} style={{ ["--i" as string]: 1, ...headStyle }}>
            Bruffles<br className="hero-br" /> Apparel</h2>
          <p className={`hero-body relative rise ${bfHas ? "text-bone/85" : "text-ink-soft"}`} style={{ ["--i" as string]: 2, ...bodyStyle }}>
            Authentic pieces, one of each. When it's gone, it's gone.</p>
          <a href="/bruffles" className={`self-start label-bf ${bfHas ? "btn-bf !bg-bone !text-ink hover:!bg-gold" : "btn-bf"}`}
            style={btnStyle}>Enter Bruffles</a>
        </div>
      </motion.section>

      {/* ---------- Passport panel ---------- */}
      <motion.section data-side="pp" aria-labelledby="hero-pp"
        className="pp relative basis-0 min-h-0 md:absolute md:inset-y-0 md:left-1/2 md:w-[70%] overflow-hidden z-10"
        initial={false} animate={{ x: desktop ? `${(shift / PANEL) * 100}%` : 0, flexGrow: grow("pp") }} transition={t}
        style={{ willChange: "transform" }}>
        <HeroMedia m={pp} scrim="from-char/85" tint="bg-char/40" playOk={playOk} open={active === "pp"} videoRef={videos.pp} desktop={desktop} />
        <PlaneFlight />
        {/* Runway dash pointing into Passport, starting at the seam */}
        <div aria-hidden className="hidden md:block absolute inset-y-0 left-2 border-l-2 border-dashed border-signal/40" />
        {/* Passport's stage piece (computer, until campaign media arrives): only while open at 70%,
            mirroring Bruffles' featured piece. The corner badge fades out as this fades in. */}
        {!ppHas && <motion.img src="/brand/passport-badge-sm.webp" alt="" aria-hidden width="200" height="170"
          className="hidden md:block absolute left-[46%] top-[20%] w-[22%] max-w-[300px]"
          initial={false} animate={{ opacity: active === "pp" ? 0.95 : 0, scale: active === "pp" ? 1 : 1.04 }}
          transition={{ ...t, delay: active === "pp" && !reduce ? 0.15 : 0 }} />}
        <div data-size={sizeOf("pp")} className={`${COPY} md:pl-[max(var(--spacing-gutter),calc(64px*var(--k)))]`}>
          <p className="relative label-pp text-signal" style={labelStyle}><FlipPrice text="Papers · Filters · Tools" /></p>
          <h2 id="hero-pp" className="relative h-koi" style={headStyle}>
            Passport<br className="hero-br" /> to Paradise</h2>
          <p className={`hero-body relative ${ppHas ? "text-paper/85" : "text-muted"}`} style={bodyStyle}>
            Papers, filters and tools, by the pack and by the box.</p>
          <a href="/passport" className="relative btn-pp self-start label-pp" style={btnStyle}>Shop Passport <span aria-hidden>→</span></a>
        </div>
      </motion.section>

      {/* ---------- Seam layer: gold hairline, centre circle and the BA corner logo, moved by transform.
          Vertical seam on a computer, horizontal on a phone. ---------- */}
      <motion.div className="absolute inset-0 z-20 pointer-events-none"
        initial={false} animate={seamMove} transition={t} style={{ willChange: "transform" }}>
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-px md:inset-x-auto md:inset-y-0 md:left-1/2 md:h-auto md:w-px bg-gold/70" />
        {/* Centre circle: tapping it puts both sides back to 50/50 (Divine, 2026-11-25) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <SeamMark onTap={() => setActive(null)} />
        </div>
        {/* BA logo: bottom right of the Bruffles half, just inside the seam */}
        <CornerLogo show={active !== "bf"} t={t}
          className="right-[var(--spacing-gutter)] bottom-[calc(50%+24px)] md:right-[calc(50%+var(--spacing-gutter))] md:bottom-8">
          <Monogram tone={bfHas ? "bright" : "deep"} className={LOGO} />
        </CornerLogo>
      </motion.div>
      {/* PTP logo: bottom right of the Passport half (the hero's bottom right corner) */}
      <CornerLogo show={active !== "pp"} t={t} className="z-30 right-[var(--spacing-gutter)] bottom-6 md:bottom-8">
        <img src="/brand/passport-badge-sm.webp" alt="" width="200" height="170" decoding="async" className={LOGO} />
      </CornerLogo>
    </div>
  );
}

// ---------- Shared copy sizing: both brands use exactly the same sizes ----------
// Copy block: phone = bottom of its panel; computer = bottom left, 30% of the hero wide (42.857% of a 70% panel).
const COPY = "hero-copy relative h-full md:h-auto md:absolute md:left-0 md:bottom-0 md:w-[42.857%] flex flex-col justify-end px-[var(--spacing-gutter)] pt-20 pb-8 md:pt-24 md:pb-16";
const labelStyle = { fontSize: scaled("13px", "10px") };
// Bruffles monogram above the headline: same height as the label line it replaced, grown a little.
const markStyle = { height: scaled("40px", "18px") };
const headStyle = { fontSize: scaled("clamp(44px, 5.6vw, 108px)"), marginTop: scaled("12px") };
const bodyStyle = { fontSize: scaled("16px", "11px"), marginTop: scaled("16px"), maxWidth: "30ch" };
// Button: 48px tall at full size, never under 32px when shut.
const btnStyle = {
  marginTop: scaled("32px"),
  fontSize: scaled("13px", "10px"),
  minHeight: scaled("48px", "32px"),
  paddingInline: scaled("24px", "12px"),
};

// Corner logos: one height for both brands (56px phone, 72px computer); width follows each logo's shape.
const LOGO = "h-14 md:h-[72px] w-auto";
// Shown while its side is 50% or 30%; fades out when its side opens to 70%, so the film has the stage.
function CornerLogo({ show, t, className, children }:
  { show: boolean; t: object; className: string; children: React.ReactNode }) {
  return (
    <motion.div aria-hidden className={`absolute pointer-events-none ${className}`}
      initial={false} animate={{ opacity: show ? 1 : 0 }} transition={t}>{children}</motion.div>
  );
}

// Centre circle on the seam (72px phone, 104px computer), a button that resets the split to 50/50.
// Holds the merged BA × PTP logo once Divine supplies it: save it as public/brand/ba-x-ptp.webp and
// set MERGED_LOGO to "/brand/ba-x-ptp.webp".
const MERGED_LOGO: string | null = null;
function SeamMark({ onTap }: { onTap: () => void }) {
  return (
    <button type="button" data-seam onClick={onTap} aria-label="Show both brands side by side"
      className="grid place-items-center rounded-full bg-ink ring-1 ring-gold/60 size-[72px] md:size-[104px] cursor-pointer
        transition-transform duration-300 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-gold">
      {MERGED_LOGO
        ? <img src={MERGED_LOGO} alt="" width="75" height="75" decoding="async" className="w-[72%] h-auto" />
        : <span aria-hidden className="label-pp text-gold text-[10px] tracking-[0.12em]">BA × PTP</span>}
    </button>
  );
}

// Campaign photo (separate phone and computer crops) + optional film + a bottom scrim so the
// headline stays readable. Renders nothing until photos are added, so the placeholder design shows.
// The film never autoplays by itself: useHeroVideos starts and stops it. It is only visible while
// its side is open at 70%; otherwise the photo shows.
function HeroMedia({ m, eager = false, scrim, tint, playOk, open, videoRef, desktop }:
  { m: PanelMedia; eager?: boolean; scrim: string; tint?: string; playOk: boolean; open: boolean; videoRef: RefObject<HTMLVideoElement | null>; desktop: boolean }) {
  const [ready, setReady] = useState(false);
  const d = m.desktop ?? m.mobile, mob = m.mobile ?? m.desktop;
  if (!d || !mob) return null;
  return (
    <div className="absolute inset-0" aria-hidden={!d.alt}>
      <picture>
        <source media="(max-width: 767px)" srcSet={mob.srcset} sizes="100vw" />
        <img src={d.src} srcSet={d.srcset} sizes="70vw" alt={d.alt} width={d.w} height={d.h}
          loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async"
          className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: d.focal }} />
      </picture>
      {m.video && playOk && (
        // Phone and computer get their own crop; key forces a reload if the layout switches.
        <video key={desktop ? "d" : "m"} ref={videoRef} muted loop playsInline preload={desktop ? "metadata" : "none"} aria-hidden onCanPlay={() => setReady(true)}
          poster={desktop ? m.video.poster : undefined}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${open && ready ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition: d.focal }}>
          {(desktop ? m.video.webm : m.video.mobileWebm ?? m.video.webm) && <source src={desktop ? m.video.webm : m.video.mobileWebm ?? m.video.webm} type="video/webm" />}
          <source src={desktop ? m.video.mp4 : m.video.mobileMp4 ?? m.video.mp4} type="video/mp4" />
        </video>
      )}
      {/* Passport grade: a flat charcoal layer (40%) over the duotone media keeps white and yellow type at WCAG AA */}
      {tint && <div className={`absolute inset-0 ${tint}`} />}
      <div className={`absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t ${scrim} to-transparent`} />
      {/* Light top shade so the header reads over any photo */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/45 to-transparent" />
    </div>
  );
}

// ---------- Hooks ----------

// True at 768px and wider (Tailwind's md), where the side-by-side split and hover apply.
// Starts false, so the server-rendered page is the phone layout until the browser says otherwise.
function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setDesktop(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return desktop;
}

// Hover arming: see ARM_MS / ARM_MOVES. Starts fresh on every page load (new visit, refresh or
// arriving from another page) because the component mounts fresh each time.
function useHoverArming() {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    let timer = 0, moves = 0, last = -Infinity;
    const arm = () => { setArmed(true); stop(); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!timer) timer = window.setTimeout(arm, ARM_MS);   // clock starts on the first movement
      if (e.timeStamp - last < MOVE_GAP_MS) return;
      last = e.timeStamp;
      if (++moves >= ARM_MOVES) arm();
    };
    const stop = () => { clearTimeout(timer); window.removeEventListener("pointermove", onMove); };
    window.addEventListener("pointermove", onMove, { passive: true });
    return stop;
  }, []);
  return armed;
}

const toggleVideo = (v: HTMLVideoElement | null) => { if (v) v.paused ? v.play().catch(() => {}) : v.pause(); };

// Film rules (Divine, 2026-11-25):
// - Opening a side to 70% plays its film automatically, the first time only.
// - Opening the other side pauses it (as does going back to 50/50).
// - Opening a side again later keeps its film paused until the visitor clicks it or presses Space.
function useHeroVideos(videos: Record<Side, RefObject<HTMLVideoElement | null>>, active: Side | null, playOk: boolean,
  root: RefObject<HTMLDivElement | null>) {
  const autoPlayed = useRef<Record<Side, boolean>>({ bf: false, pp: false });
  useEffect(() => {
    for (const s of SIDES) {
      const v = videos[s].current;
      if (!v) continue;
      if (s !== active) v.pause();
      else if (playOk && !autoPlayed.current[s]) { autoPlayed.current[s] = true; v.play().catch(() => {}); }
    }
  }, [active, playOk]);

  // Space toggles the open side's film while the hero is on screen (not while typing or on a control).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || !active) return;
      if ((e.target as HTMLElement)?.closest?.("input, textarea, select, button, a, [contenteditable]")) return;
      const r = root.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return;
      const v = videos[active].current;
      if (!v) return;
      e.preventDefault(); toggleVideo(v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);
}

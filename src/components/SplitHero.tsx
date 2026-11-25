import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Monogram from "./Monogram";
import PlaneFlight from "./PlaneFlight";
import FlipPrice from "./FlipPrice";
import type { Pic } from "../lib/pic";

export type PanelMedia = { desktop?: Pic; mobile?: Pic; video?: string };

/*
 * Homepage split hero: Bruffles Apparel (BA, left) and Passport to Paradise (PTP, right).
 *
 * Desktop states, per side:  "even" = 50/50 (nothing hovered)
 *                            "open" = this side is 70% wide (mouse is over it)
 *                            "shut" = this side is 30% wide (mouse is over the other side)
 *
 *            corner logo   copy size            featured piece / hero film
 *   even     shown         full                 hidden / paused
 *   open     fades out     full                 shown  / plays (first time only, see videos)
 *   shut     shown         SHUT_K (about 38%)   hidden / paused
 *
 * Geometry: two overlapping panels, each 70% of the hero wide. Only the Passport panel and the
 * seam layer move, and only with transform, so the open/close never triggers page layout.
 * The copy block in each panel is 30% of the hero wide, so it is fully visible in every state.
 *
 * Mobile (< 768px): two stacked full-width panels with their own buttons. No hover, no scaling.
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

// `featured` = the BA-047 flat lay shown in the open Bruffles panel (placeholder until it exists).
export default function SplitHero({ media = {}, featured }: { media?: { bf?: PanelMedia; pp?: PanelMedia }; featured?: Pic }) {
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

  // Leaving desktop width (window resized) closes any open side, so the stacked layout never moves.
  useEffect(() => { if (!desktop) setActive(null); }, [desktop]);

  const shift = active === "bf" ? OPEN : active === "pp" ? -OPEN : 0;   // seam movement, share of hero width
  const t = { duration: reduce ? 0 : DURATION, ease: EXPO };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !armed || !desktop || !root.current) return;
    const r = root.current.getBoundingClientRect();
    const seam = r.left + r.width * (0.5 + shift);
    const next: Side = e.clientX < seam ? "bf" : "pp";
    if (next !== active) setActive(next);
  };

  // Clicking the open side (anywhere but a link) plays or pauses its film.
  const onClick = (e: React.MouseEvent) => {
    if (!active || (e.target as HTMLElement).closest("a, button")) return;
    toggleVideo(videos[active].current);
  };

  return (
    <div ref={root} className="relative md:h-[100svh] md:min-h-[640px] md:overflow-hidden"
      onPointerMove={onMove} onPointerLeave={() => setActive(null)} onClick={onClick}>

      {/* ---------- Bruffles panel ---------- */}
      <section aria-labelledby="hero-bf" className="bf relative min-h-[70svh] md:min-h-0 md:absolute md:inset-y-0 md:left-0 md:w-[70%] overflow-hidden">
        <HeroMedia m={bf} eager scrim="from-ink/75" playOk={playOk} open={active === "bf"} videoRef={videos.bf} />

        {/* Featured piece 047 (desktop): only while Bruffles is open at 70% */}
        <motion.div aria-hidden={active !== "bf"} className="absolute hidden md:block left-[44%] right-[31%] top-[18%] bottom-[16%]"
          initial={false} animate={{ opacity: active === "bf" ? 1 : 0, scale: active === "bf" ? 1 : 1.04 }}
          transition={{ ...t, delay: active === "bf" && !reduce ? 0.15 : 0 }}>
          <a href="/bruffles/BA-047" tabIndex={active === "bf" ? 0 : -1} className="relative block h-full ph-bf overflow-hidden">
            {featured
              ? <img src={featured.src} srcSet={featured.srcset} sizes="25vw" alt={featured.alt} width={featured.w} height={featured.h}
                  loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
              : <><span className="absolute right-4 bottom-3 num-bf text-[96px] text-ink/10" aria-hidden>047</span>
                  <span className="absolute left-4 top-4 label-bf text-ink-soft">Photo · piece 047</span></>}
          </a>
          <p className={`mt-3 label-bf ${bfHas ? "text-bone/85" : "text-ink-soft"}`}>Piece 047 · Tech Fleece Windrunner</p>
        </motion.div>

        <div data-size={sizeOf("bf")}
          className="hero-copy relative md:absolute md:left-0 md:bottom-0 md:w-[42.857%] flex flex-col justify-end min-h-[70svh] md:min-h-0 px-[var(--spacing-gutter)] md:pr-[max(var(--spacing-gutter),calc(64px*var(--k)))] pt-24 pb-16">
          {/* Phone: featured piece 047 (until campaign photos arrive) */}
          {!bfHas && <div className="md:hidden relative w-[62%] aspect-[4/5] ph-bf self-end mb-auto mt-4 overflow-hidden">
            {featured
              ? <img src={featured.src} srcSet={featured.srcset} sizes="62vw" alt={featured.alt} width={featured.w} height={featured.h}
                  decoding="async" className="absolute inset-0 w-full h-full object-cover" />
              : <><span className="absolute left-3 top-3 label-bf text-ink-soft">Photo · 047</span>
                  <span className="absolute right-3 bottom-1 num-bf text-[64px] text-ink/10" aria-hidden>047</span></>}
          </div>}
          <p className={`relative label-bf rise ${bfHas ? "text-gold" : "text-gold-text mt-8 md:mt-0"}`}
            style={{ fontSize: scaled("13px", "10px") }}>1 of 1 · Restocked twice a month</p>
          <h2 id="hero-bf" className={`relative rise h-koi ${bfHas ? "text-bone" : ""}`}
            style={{ ["--i" as string]: 1, fontSize: scaled("clamp(56px, 6vw, 112px)"), marginTop: scaled("12px") }}>
            Bruffles<br className="hero-br" /> Apparel</h2>
          <p className={`hero-body rise max-w-[28ch] ${bfHas ? "text-bone/85" : "text-ink-soft"}`}
            style={{ ["--i" as string]: 2, fontSize: scaled("16px", "11px"), marginTop: scaled("16px") }}>
            Authentic pieces, one of each. When it's gone, it's gone.</p>
          <a href="/bruffles" className={`self-start label-bf ${bfHas ? "btn-bf !bg-bone !text-ink hover:!bg-gold" : "btn-bf"}`}
            style={btnStyle}>Shop Bruffles</a>
        </div>
      </section>

      {/* ---------- Centre circle: mobile hinge between the stacked panels ---------- */}
      <div className="md:hidden relative z-20 h-0 flex justify-center">
        <SeamMark size={72} className="-translate-y-1/2" />
      </div>

      {/* ---------- Passport panel ---------- */}
      <motion.section aria-labelledby="hero-pp"
        className="pp relative min-h-[70svh] md:min-h-0 md:absolute md:inset-y-0 md:left-1/2 md:w-[70%] overflow-hidden z-10"
        initial={false} animate={{ x: `${(shift / PANEL) * 100}%` }} transition={t}
        style={{ willChange: "transform" }}>
        <HeroMedia m={pp} scrim="from-char/85" playOk={playOk} open={active === "pp"} videoRef={videos.pp} />
        <PlaneFlight />
        {/* Runway dash pointing into Passport, starting at the seam */}
        <div aria-hidden className="hidden md:block absolute inset-y-0 left-2 border-l-2 border-dashed border-signal/40" />
        {/* Passport's stage piece (desktop, placeholder until campaign media): only while open at 70%,
            mirroring Bruffles' featured piece. The corner badge fades out as this fades in. */}
        {!ppHas && <motion.img src="/brand/passport-badge.webp" alt="" aria-hidden width="594" height="505"
          className="hidden md:block absolute left-[46%] top-[20%] w-[22%] max-w-[300px]"
          initial={false} animate={{ opacity: active === "pp" ? 0.95 : 0, scale: active === "pp" ? 1 : 1.04 }}
          transition={{ ...t, delay: active === "pp" && !reduce ? 0.15 : 0 }} />}
        <div data-size={sizeOf("pp")}
          className="hero-copy relative md:absolute md:left-0 md:bottom-0 md:w-[42.857%] flex flex-col justify-end min-h-[70svh] md:min-h-0 px-[var(--spacing-gutter)] md:pl-[max(var(--spacing-gutter),calc(64px*var(--k)))] pt-24 pb-16">
          <img src="/brand/passport-badge.webp" alt="" aria-hidden width="594" height="505" className="relative md:hidden w-40 mb-auto mt-4 self-end" />
          <p className="relative label-pp text-signal" style={{ fontSize: scaled("12px", "10px") }}><FlipPrice text="GATE 02 · NOW BOARDING" /></p>
          <h2 id="hero-pp" className="relative h-koi"
            style={{ fontSize: scaled("clamp(56px, 5.4vw, 104px)"), marginTop: scaled("16px") }}>
            Passport<br className="hero-br" /> to Paradise</h2>
          <p className={`hero-body relative max-w-[30ch] ${ppHas ? "text-paper/85" : "text-muted"}`}
            style={{ fontSize: scaled("16px", "11px"), marginTop: scaled("16px") }}>
            Papers, filters and tools, by the pack and by the box.</p>
          <a href="/passport" className="relative btn-pp self-start label-pp" style={btnStyle}>Board Passport <span aria-hidden>→</span></a>
        </div>
      </motion.section>

      {/* ---------- Corner logos (desktop: BA top-left, PTP top-right; phone: BA only) ----------
          Shown while their side is 50% or 30%; fade out when their side opens to 70%,
          so the film or photo has the stage. Sit just under the 64px header. */}
      <motion.div aria-hidden className="absolute z-30 left-[var(--spacing-gutter)] top-[88px] pointer-events-none"
        initial={false} animate={{ opacity: active === "bf" ? 0 : 1 }} transition={t}>
        <Monogram size={64} tone={bfHas ? "bright" : "deep"} />
      </motion.div>
      <motion.img src="/brand/passport-badge.webp" alt="" aria-hidden width="594" height="505"
        className="hidden md:block absolute z-30 right-[var(--spacing-gutter)] top-[88px] w-[96px] pointer-events-none"
        initial={false} animate={{ opacity: active === "pp" ? 0 : 1 }} transition={t} />

      {/* ---------- Seam (desktop): gold hairline + centre circle, moved by transform ---------- */}
      <motion.div aria-hidden className="hidden md:block absolute inset-0 z-20 pointer-events-none"
        initial={false} animate={{ x: `${shift * 100}%` }} transition={t} style={{ willChange: "transform" }}>
        <div className="absolute inset-y-0 left-1/2 w-px bg-gold/70" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><SeamMark size={104} /></div>
      </motion.div>
    </div>
  );
}

// Shared button sizing for both brands: 48px tall at full size, never under 32px when shut.
const btnStyle = {
  marginTop: scaled("32px"),
  fontSize: scaled("13px", "10px"),
  minHeight: scaled("48px", "32px"),
  paddingInline: scaled("24px", "12px"),
};

// Centre circle on the seam. Holds the merged BA × PTP logo once Divine supplies it:
// save it as public/brand/ba-x-ptp.webp and set MERGED_LOGO to "/brand/ba-x-ptp.webp".
const MERGED_LOGO: string | null = null;
function SeamMark({ size, className = "" }: { size: number; className?: string }) {
  return (
    <span className={`grid place-items-center rounded-full bg-ink ring-1 ring-gold/60 ${className}`} style={{ width: size, height: size }}>
      {MERGED_LOGO
        ? <img src={MERGED_LOGO} alt="" width={Math.round(size * 0.72)} height={Math.round(size * 0.72)} decoding="async" />
        : <span className="label-pp text-gold text-[10px] tracking-[0.12em]">BA × PTP</span>}
    </span>
  );
}

// Campaign photo (separate phone and computer crops) + optional film + a bottom scrim so the
// headline stays readable. Renders nothing until photos are added, so the placeholder design shows.
// The film never autoplays by itself: useHeroVideos starts and stops it. It is only visible while
// its side is open at 70%; otherwise the photo shows.
function HeroMedia({ m, eager = false, scrim, playOk, open, videoRef }:
  { m: PanelMedia; eager?: boolean; scrim: string; playOk: boolean; open: boolean; videoRef: RefObject<HTMLVideoElement | null> }) {
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
        <video ref={videoRef} src={m.video} muted loop playsInline preload="metadata" aria-hidden onCanPlay={() => setReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${open && ready ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition: d.focal }} />
      )}
      <div className={`absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t ${scrim} to-transparent`} />
      {/* Light top shade so the header and corner logo read over any photo */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/45 to-transparent" />
    </div>
  );
}

// ---------- Hooks ----------

// True at 768px and wider (Tailwind's md), where the side-by-side split and hover apply.
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

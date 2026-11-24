import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Monogram from "./Monogram";
import PlaneFlight from "./PlaneFlight";
import { heroMedia } from "../data/media";

type Side = "bf" | "pp";
const EXPO = [0.16, 1, 0.3, 1] as const;
const OPEN = 0.2;          // a hovered side gains 20% of the width (50/50 -> 70/30)
const PANEL = 0.7;         // each panel is 70% wide; the extra is hidden under the other panel
const GRACE_MS = 1200;     // let the 50/50 split be seen before hover can open a side

// Desktop: two overlapping panels moved only with transform (no layout work per frame), so the
// open/close stays smooth on slow phones. The monogram rides the seam like a hinge.
// Mobile: two stacked full-width panels, each with its own button; the monogram joins them.
export default function SplitHero() {
  const [active, setActive] = useState<Side | null>(null);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setReady(true), GRACE_MS); return () => clearTimeout(t); }, []);

  const shift = active === "bf" ? OPEN : active === "pp" ? -OPEN : 0;   // seam movement, share of hero width
  const t = { duration: reduce ? 0 : 0.8, ease: EXPO };

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ready || !root.current) return;
    const r = root.current.getBoundingClientRect();
    const seam = r.left + r.width * (0.5 + shift);
    const next: Side = e.clientX < seam ? "bf" : "pp";
    if (next !== active) setActive(next);
  };

  return (
    <div ref={root} className="relative md:h-[100svh] md:min-h-[640px] md:overflow-hidden"
      onPointerMove={onMove} onPointerLeave={() => setActive(null)}>

      {/* ---------- Bruffles panel ---------- */}
      <section aria-labelledby="hero-bf" className="bf relative min-h-[78svh] md:min-h-0 md:absolute md:inset-y-0 md:left-0 md:w-[70%] overflow-hidden">
        {heroMedia.bf.poster && <img src={heroMedia.bf.poster} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        {/* Featured piece frame: sits in the middle band, visible unless Passport is open */}
        <div className="absolute hidden md:block left-[44%] right-[31%] top-[18%] bottom-[16%]">
          <div className="relative h-full ph-bf">
            <span className="absolute right-4 bottom-3 num-bf text-[96px] text-ink/10" aria-hidden>047</span>
            <span className="absolute left-4 top-4 label-bf text-ink-soft">Photo · piece 047</span>
          </div>
          <p className="mt-3 label-bf text-ink-soft">Piece 047 · Tech Fleece Windrunner</p>
        </div>
        <div className="relative md:absolute md:left-0 md:bottom-0 md:w-[42.857%] flex flex-col justify-end min-h-[78svh] md:min-h-0 px-[var(--spacing-gutter)] pt-24 pb-16 md:pb-16">
          <div className="md:hidden relative w-[62%] aspect-[4/5] ph-bf self-end mb-auto mt-4">
            <span className="absolute left-3 top-3 label-bf text-ink-soft">Photo · 047</span>
            <span className="absolute right-3 bottom-1 num-bf text-[64px] text-ink/10" aria-hidden>047</span>
          </div>
          <p className="mt-8 md:mt-0 label-bf text-gold-text">1 of 1 · Restocked twice a month</p>
          <h2 id="hero-bf" className="h-bf text-[48px] md:text-[clamp(48px,5vw,80px)] mt-4">Bruffles<br />Apparel</h2>
          <p className="mt-4 max-w-[28ch] text-ink-soft">Authentic pieces, one of each. When it's gone, it's gone.</p>
          <a href="/bruffles" className="btn-bf mt-8 self-start">Shop Bruffles</a>
        </div>
      </section>

      {/* ---------- Monogram: mobile hinge between the stacked panels ---------- */}
      <div className="md:hidden relative z-20 h-0 flex justify-center">
        <Monogram disc size={72} className="-translate-y-1/2" />
      </div>

      {/* ---------- Passport panel ---------- */}
      <motion.section aria-labelledby="hero-pp"
        className="pp relative min-h-[78svh] md:min-h-0 md:absolute md:inset-y-0 md:left-1/2 md:w-[70%] overflow-hidden z-10"
        initial={false} animate={{ x: `${(shift / PANEL) * 100}%` }} transition={t}
        style={{ willChange: "transform" }}>
        {heroMedia.pp.poster && <img src={heroMedia.pp.poster} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <PlaneFlight />
        {/* Runway dash pointing into Passport, starting at the seam */}
        <div aria-hidden className="hidden md:block absolute inset-y-0 left-2 border-l-2 border-dashed border-signal/40" />
        <img src="/brand/passport-badge.webp" alt="" aria-hidden width="594" height="505"
          className="hidden md:block absolute left-[46%] top-[20%] w-[22%] max-w-[300px] opacity-95" />
        <div className="relative md:absolute md:left-0 md:bottom-0 md:w-[42.857%] flex flex-col justify-end min-h-[78svh] md:min-h-0 px-[var(--spacing-gutter)] pt-24 pb-16 md:pl-16">
          <img src="/brand/passport-badge.webp" alt="" aria-hidden width="594" height="505" className="md:hidden w-40 mb-auto mt-4 self-end" />
          <p className="label-pp text-signal">Gate 02 · Now boarding</p>
          <h2 id="hero-pp" className="h-pp text-[48px] md:text-[clamp(48px,5vw,80px)] mt-4">Passport<br />to Paradise</h2>
          <p className="mt-4 max-w-[30ch] text-muted">Papers, filters and tools, by the pack and by the box.</p>
          <a href="/passport" className="btn-pp mt-8 self-start label-pp">Board Passport <span aria-hidden>→</span></a>
        </div>
      </motion.section>

      {/* ---------- Seam (desktop): gold hairline + monogram hinge, moved by transform ---------- */}
      <motion.div aria-hidden className="hidden md:block absolute inset-0 z-20 pointer-events-none"
        initial={false} animate={{ x: `${shift * 100}%` }} transition={t} style={{ willChange: "transform" }}>
        <div className="absolute inset-y-0 left-1/2 w-px bg-gold/70" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><Monogram disc size={104} /></div>
      </motion.div>
    </div>
  );
}

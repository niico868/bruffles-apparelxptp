import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Monogram from "./Monogram";
import { heroMedia } from "../data/media";

type Side = "bsa" | "ptp";
const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.75;      // widening speed (20% slower than the original 0.6s)
const ARM_MS = 10_000;      // minimum wait, counted from the visitor's FIRST mouse movement
const ARM_MOVES = 20;       // and at least this many mouse movements before hover can widen

export default function SplitHero() {
  const [active, setActive] = useState<Side | null>(null);
  const [mobile, setMobile] = useState(false);
  const [armed, setArmed] = useState(false);
  const reduce = useReducedMotion();
  const videos = { bsa: useRef<HTMLVideoElement>(null), ptp: useRef<HTMLVideoElement>(null) };
  const root = useRef<HTMLDivElement>(null);
  const textBlocks = { bsa: useRef<HTMLDivElement>(null), ptp: useRef<HTMLDivElement>(null) };

  // Scroll cutoff: once the line 2rem above the brand text scrolls under the header,
  // snap back to 50/50 and stop reacting to hover until the visitor scrolls back up.
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    const check = () => {
      const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      // Use the text's bottom edge (anchored, never moves) minus its height at normal size,
      // so the cutoff line stays put even while an open half's heading is enlarged.
      const tops = (["bsa", "ptp"] as Side[]).map((k) => {
        const el = textBlocks[k].current; if (!el) return Infinity;
        const h2 = el.querySelector("h2") as HTMLElement | null;
        // Height the text would have at normal size: subtract the heading's current growth.
        const grow = h2 ? h2.offsetHeight * (1 - Number(h2.dataset.base) / parseFloat(getComputedStyle(h2).fontSize)) : 0;
        const pad = parseFloat(getComputedStyle(el).paddingTop) || 0; // measure from the text, not the padding
        return el.getBoundingClientRect().top + grow + pad;
      });
      const cutoff = Math.min(...tops) - 2 * rem;
      const isLocked = cutoff < header;
      setLocked(isLocked);
      if (isLocked) setActive(null);
    };
    check();
    // Fonts change the text height; re-measure once they've loaded so the cutoff line is accurate.
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setMobile(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Arming sensor: nothing happens until the mouse first moves. From then, the visitor must
  // keep browsing for ARM_MS and ARM_MOVES before hover is allowed to widen a half.
  useEffect(() => {
    let start = 0, moves = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!start) start = performance.now();
      moves++;
      if (moves >= ARM_MOVES && performance.now() - start >= ARM_MS) {
        setArmed(true);
        window.removeEventListener("pointermove", onMove);
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Video rules: only the open (70%) side plays; switching sides pauses the other.
  useEffect(() => {
    (["bsa", "ptp"] as Side[]).forEach((s) => {
      const v = videos[s].current; if (!v) return;
      if (s === active && !reduce) v.play().catch(() => {}); else v.pause();
    });
  }, [active, reduce]);

  // Click on the open side's video, or Space, toggles that video. No icons, no controls.
  const toggle = () => { const v = active && videos[active].current; if (v) v.paused ? v.play().catch(() => {}) : v.pause(); };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || !active) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") return;
      const r = root.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return; // only while the hero is on screen
      e.preventDefault(); toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const grow = (s: Side) => (active === null ? 1 : active === s ? 7 : 3); // 70 / 30
  const t = { duration: reduce ? 0 : DURATION, ease: EASE };
  const linePct = active === "bsa" ? 70 : active === "ptp" ? 30 : 50;

  const half = (s: Side, href: string, label: string, title: string, dark: boolean) => {
    const open = active === s;
    const m = heroMedia[s];
    return (
      <motion.section
        className={`relative flex min-h-0 overflow-hidden ${dark ? "runway" : "satin"} text-chalk`}
        style={{ flexBasis: 0 }}
        animate={{ flexGrow: grow(s) }}
        transition={t}
        onPointerMove={(e) => e.pointerType === "mouse" && armed && !locked && !mobile && active !== s && setActive(s)}
        onPointerLeave={(e) => e.pointerType === "mouse" && armed && !locked && !mobile && setActive(null)}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) return;
          if (mobile && !open) return setActive(s);
          if (open) toggle();
        }}
        aria-label={title}
      >
        {/* Media: still image by default; the brand video plays only while this half is open */}
        {m.poster && <img src={m.poster} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        {m.video && (
          <motion.video ref={videos[s]} src={m.video} poster={m.poster} muted loop playsInline preload="metadata"
            className="absolute inset-0 w-full h-full object-cover" animate={{ opacity: open ? 1 : 0 }} transition={t} />
        )}
        {!m.poster && !m.video && (
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,255,255,.05),transparent_70%)]`} />
        )}
        <motion.div className="absolute inset-0 bg-black pointer-events-none" animate={{ opacity: active && !open ? 0.35 : 0 }} transition={t} />

        {/* Logo: only on the open side, pinned to the top corner (left for Bruffels, right for Passport) */}
        <AnimatePresence>
          {open && (
            <motion.div key="logo" className={`absolute z-10 top-6 md:top-10 ${dark ? "right-6 md:right-10" : "left-6 md:left-10"}`}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ...t, delay: reduce ? 0 : 0.2 }}>
              {m.logo ? <img src={m.logo} alt={`${title} logo`} className="h-14 md:h-20 w-auto" />
                : <span className={`grid place-items-center h-14 md:h-20 aspect-square border border-chalk/40 ${dark ? "label-ptp" : "label-bsa"} text-[10px]`}>Logo</span>}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={textBlocks[s]} className={`relative z-10 mt-auto w-full p-6 md:p-10 ${dark ? "md:text-right" : ""}`}>
          <p className={dark ? "label-ptp text-signal" : "label-bsa text-gold"}>{label}</p>
          <motion.h2 className={`${dark ? "h-ptp" : "h-bsa"} mt-2 leading-[1.05] whitespace-nowrap`}
            data-base={dark ? (mobile ? 24 : 30) : (mobile ? 30 : 36)} initial={false} animate={{ fontSize: `${(dark ? (mobile ? 24 : 30) : (mobile ? 30 : 36)) * (open ? 1.5 : 1)}px` }} transition={t}>{title}</motion.h2>
          <motion.a href={href}
            className={`mt-5 inline-block text-[11px] tracking-[0.22em] uppercase border-b pb-1 border-chalk/50`}
            animate={{ opacity: open ? 1 : 0, y: open ? 0 : 6 }}
            transition={{ ...t, delay: open && !reduce ? 0.15 : 0 }}
            onFocus={() => setActive(s)}
            style={{ pointerEvents: open ? "auto" : "none" }}
          >Enter</motion.a>
        </div>
      </motion.section>
    );
  };

  return (
    <div ref={root} className="relative flex flex-col md:flex-row h-[calc(100svh-56px)] min-h-[560px]">
      {half("bsa", "/bruffels", "One of one · Est. Port of Spain", "Bruffels Apparel", false)}
      {half("ptp", "/passport", "Gate 02 · Bulk accessories", "Passport to Paradise", true)}
      <motion.div className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 hidden md:block top-1/2"
        animate={{ left: `${linePct}%` }} transition={t}><Monogram /></motion.div>
      <div className="absolute z-20 pointer-events-none left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
        style={{ top: active === "bsa" ? "70%" : active === "ptp" ? "30%" : "50%", transition: `top ${DURATION}s var(--ease-calm)` }}>
        <Monogram size={64} />
      </div>
    </div>
  );
}

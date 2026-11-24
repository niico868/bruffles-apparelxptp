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

  // Scroll cutoff, judged PER HALF: a half locks (snaps closed, ignores hover/tap) once the line
  // 2rem above its own label scrolls under the navbar. Measured at the half's normal 50/50 position,
  // so one half opening or shrinking can never lock the other (the mobile stacked-layout bug).
  const [locked, setLocked] = useState<Record<Side, boolean>>({ bsa: false, ptp: false });
  // Logo position: rides down with the navbar while scrolling, stopping just above the brand labels.
  const [logoTop, setLogoTop] = useState(40);
  useEffect(() => {
    const check = () => {
      const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const heroR = root.current?.getBoundingClientRect();
      if (!heroR) return;
      const stacked = window.innerWidth < 768;
      const closedLabel = {} as Record<Side, number>;
      (["bsa", "ptp"] as Side[]).forEach((k) => {
        const el = textBlocks[k].current; if (!el) { closedLabel[k] = Infinity; return; }
        const h2 = el.querySelector("h2") as HTMLElement | null;
        const label = el.querySelector("p") as HTMLElement | null;
        // undo the heading's enlargement
        const grow = h2 ? h2.offsetHeight * (1 - Number(h2.dataset.base) / parseFloat(getComputedStyle(h2).fontSize)) : 0;
        // undo the section resize: when stacked, the top half's bottom edge moves as it grows/shrinks
        const sec = el.parentElement!.getBoundingClientRect();
        const resize = stacked && k === "bsa" ? sec.height - heroR.height / 2 : 0;
        closedLabel[k] = (label?.getBoundingClientRect().top ?? Infinity) + grow - resize;
      });
      const next = { bsa: closedLabel.bsa - 2 * rem < header, ptp: closedLabel.ptp - 2 * rem < header };
      setLocked((prev) => (prev.bsa === next.bsa && prev.ptp === next.ptp ? prev : next));
      setActive((a) => (a && next[a] ? null : a));

      const logoH = stacked ? 56 : 80;
      const base = stacked ? 24 : 40;
      const follow = header - heroR.top + 24;                     // 24px below the navbar
      const labelNow = Math.min(...(["bsa", "ptp"] as Side[]).map((k) => textBlocks[k].current?.querySelector("p")?.getBoundingClientRect().top ?? Infinity));
      setLogoTop(Math.max(base, Math.min(follow, labelNow - heroR.top - logoH - 16))); // stop 16px above the labels
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const id = setInterval(check, 120); // labels move while a heading animates
    return () => { clearInterval(id); window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
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
        className={`relative flex min-h-0 overflow-hidden ${dark ? "passport-cover" : "satin"} text-chalk`}
        style={{ flexBasis: 0 }}
        animate={{ flexGrow: grow(s) }}
        transition={t}
        onPointerMove={(e) => e.pointerType === "mouse" && armed && !locked[s] && !mobile && active !== s && setActive(s)}
        onPointerLeave={(e) => e.pointerType === "mouse" && armed && !mobile && setActive(null)}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) return;
          if (mobile && !open) return locked[s] ? undefined : setActive(s);
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
        {dark && <div aria-hidden className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none bg-gradient-to-t from-[#22070d] via-[#22070d]/70 to-transparent" />}
        <motion.div className="absolute inset-0 bg-black pointer-events-none" animate={{ opacity: active && !open ? 0.35 : 0 }} transition={t} />

        {/* Logo: only on the open side, pinned to the top corner (left for Bruffles, right for Passport) */}
        <AnimatePresence>
          {open && (
            <motion.div key="logo" className={`absolute z-10 ${dark ? "right-6 md:right-10" : "left-6 md:left-10"}`} style={{ top: logoTop }}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ ...t, delay: reduce ? 0 : 0.2 }}>
              {m.logo ? <img src={m.logo} alt={`${title} logo`} className="h-14 md:h-20 w-auto" />
                : <span className={`grid place-items-center h-14 md:h-20 aspect-square border border-chalk/40 ${dark ? "label-ptp" : "label-bsa"} text-[10px]`}>Logo</span>}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={textBlocks[s]} className={`relative z-10 mt-auto w-full p-6 md:p-10 ${dark ? "md:text-right" : ""}`}>
          <p className={dark ? "label-ptp gold-text" : "label-bsa text-gold"}>{label}</p>
          <motion.h2 className={`${dark ? "h-ptp" : "h-bsa"} mt-2 leading-[1.05] whitespace-nowrap`}
            data-base={dark ? (mobile ? 24 : 30) : (mobile ? 30 : 36)} initial={false} animate={{ fontSize: `${(dark ? (mobile ? 24 : 30) : (mobile ? 30 : 36)) * (open ? (mobile ? 1.2 : 1.5) : 1)}px` }} transition={t}>{title}</motion.h2>
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
      {half("bsa", "/bruffles", "One of one · Restocked twice a month", "Bruffles Apparel", false)}
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

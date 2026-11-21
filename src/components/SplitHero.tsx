import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Monogram from "./Monogram";

type Side = "bsa" | "ptp" | null;
const EASE = [0.22, 1, 0.36, 1] as const;
const ARM_MS = 2500;
const DURATION = 0.75; // 20% slower than the original 0.6s

export default function SplitHero() {
  const [active, setActive] = useState<Side>(null);
  const [mobile, setMobile] = useState(false);
  // Armed: ignore the cursor for the first moments so visitors first see the even 50/50 split.
  // After ARM_MS, the next real mouse movement over a half starts the widening.
  const [armed, setArmed] = useState(false);
  useEffect(() => { const id = setTimeout(() => setArmed(true), ARM_MS); return () => clearTimeout(id); }, []);
  const reduce = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setMobile(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const grow = (s: Exclude<Side, null>) => (active === null ? 1 : active === s ? 7 : 3); // 70 / 30
  const t = { duration: reduce ? 0 : DURATION, ease: EASE };
  const linePct = active === "bsa" ? 70 : active === "ptp" ? 30 : 50;

  // Desktop: hover previews, click enters. Mobile: first tap expands, "Enter" navigates.
  const half = (s: Exclude<Side, null>, href: string, children: React.ReactNode, dark: boolean) => (
    <motion.section
      className={`relative flex min-h-0 overflow-hidden ${dark ? "satin text-chalk" : "bg-paper text-ink"}`}
      style={{ flexBasis: 0 }}
      animate={{ flexGrow: grow(s) }}
      transition={t}
      onPointerMove={(e) => e.pointerType === "mouse" && armed && !mobile && active !== s && setActive(s)}
      onPointerLeave={(e) => e.pointerType === "mouse" && armed && !mobile && setActive(null)}
      onClick={() => mobile && setActive(active === s ? null : s)}
      aria-label={s === "bsa" ? "Brussels Apparel" : "Passport to Paradise"}
    >
      {/* video loop slot: drop Higgsfield <video> here */}
      <div className={`absolute inset-0 ${dark ? "bg-[radial-gradient(ellipse_at_30%_40%,rgba(255,255,255,.05),transparent_70%)]" : "bg-[radial-gradient(ellipse_at_70%_40%,#fbf8f2,transparent_70%)]"}`} />
      <motion.div className="absolute inset-0 bg-black pointer-events-none" animate={{ opacity: active && active !== s ? (dark ? 0.35 : 0.18) : 0 }} transition={t} />
      <div className={`relative z-10 mt-auto w-full p-6 md:p-10 ${dark ? "md:text-right" : ""}`}>
        {children}
        <motion.a
          href={href}
          className={`mt-5 inline-block text-[11px] tracking-[0.22em] uppercase border-b pb-1 ${dark ? "border-chalk/50" : "border-ink/50"}`}
          animate={{ opacity: active === s ? 1 : 0, y: active === s ? 0 : 6 }}
          transition={{ ...t, delay: active === s && !reduce ? 0.15 : 0 }}
          tabIndex={0}
          onFocus={() => setActive(s)}
          style={{ pointerEvents: active === s ? "auto" : "none" }}
        >Enter</motion.a>
      </div>
    </motion.section>
  );

  return (
    <div className="relative flex flex-col md:flex-row h-[calc(100svh-56px)] min-h-[560px]">
      {half("bsa", "/brussels", <>
        <p className="label-bsa text-ink-soft">One of one · Est. Port of Spain</p>
        <h2 className="h-bsa text-3xl md:text-4xl mt-2">Brussels Apparel</h2>
      </>, false)}
      {half("ptp", "/passport", <>
        <p className="label-ptp text-chalk-soft">Gate 02 · Bulk accessories</p>
        <h2 className="h-ptp text-2xl md:text-3xl mt-2">Passport to Paradise</h2>
      </>, true)}
      {/* Monogram rides the seam */}
      <motion.div
        className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2 hidden md:block top-1/2"
        animate={{ left: `${linePct}%` }} transition={t}
      ><Monogram /></motion.div>
      <div className="absolute z-20 pointer-events-none left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden"
        style={{ top: active === "bsa" ? "70%" : active === "ptp" ? "30%" : "50%", transition: `top ${DURATION}s var(--ease-calm)` }}>
        <Monogram size={64} />
      </div>
    </div>
  );
}

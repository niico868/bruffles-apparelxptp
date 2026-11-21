import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SHOTS = ["Front", "Back", "Side", "Fabric detail", "Tag", "On-body"];

// 6-shot gallery. Slow crossfade + gentle hover zoom. No autoplay.
export default function Gallery({ sold = false }: { sold?: boolean }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  return (
    <div className="md:grid md:grid-cols-[64px_1fr] md:gap-4">
      <div className="relative order-2 aspect-[4/5] overflow-hidden bg-paper-2 group">
        <AnimatePresence mode="popLayout">
          <motion.div key={i} className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0 }} animate={{ opacity: sold ? 0.45 : 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#faf8fb,#e9e4ee)] transition-transform duration-[1200ms] ease-[var(--ease-calm)] group-hover:scale-[1.04]" />
            <span className="relative label-bsa text-ink-soft">{SHOTS[i]}</span>
          </motion.div>
        </AnimatePresence>
        {sold && <GoneStamp />}
      </div>
      <div className="order-1 mt-3 md:mt-0 flex md:flex-col gap-2 overflow-x-auto" role="tablist" aria-label="Photos">
        {SHOTS.map((s, n) => (
          <button key={s} role="tab" aria-selected={i === n} aria-label={s} onClick={() => setI(n)}
            className={`shrink-0 w-14 md:w-16 aspect-[4/5] bg-paper-2 border transition-colors duration-300 ${i === n ? "border-ink" : "border-transparent hover:border-line"}`}>
            <span className="label-bsa text-[8px] text-ink-soft">{n + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function GoneStamp({ small = false }: { small?: boolean }) {
  // Bold Montserrat "GONE" in brushed gold, inside a double gold ring, slightly rotated like a real stamp.
  return (
    <div className={`absolute ${small ? "top-3 right-3 w-[72px] h-[72px]" : "top-6 right-6 w-28 h-28"} rotate-[-10deg] rounded-full p-[2px] gold-metal shadow-sm`}>
      <div className="w-full h-full rounded-full bg-white/85 grid place-items-center">
        <div className="w-[86%] h-[86%] rounded-full border border-gold grid place-items-center">
          <span className={`gold-text ${small ? "text-[15px]" : "text-[22px]"} tracking-[0.12em]`} style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800 }}>GONE</span>
        </div>
      </div>
    </div>
  );
}

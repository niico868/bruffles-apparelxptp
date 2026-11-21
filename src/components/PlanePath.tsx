import { motion, useReducedMotion } from "framer-motion";

// A small plane zips along a dotted flight path between sections. Decorative only.
export default function PlanePath({ dark = true }: { dark?: boolean }) {
  const reduce = useReducedMotion();
  const stroke = dark ? "#a19e96" : "#625d55";
  return (
    <div className="relative h-12 overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 10">
        <path d="M0 7 Q 50 1 100 7" fill="none" stroke={stroke} strokeWidth=".3" strokeDasharray="1 1.4" vectorEffect="non-scaling-stroke" />
      </svg>
      <motion.svg width="18" height="18" viewBox="0 0 24 24" className="absolute top-1/2 -translate-y-1/2" fill="var(--color-gold)"
        initial={{ left: "-5%" }} whileInView={{ left: reduce ? "50%" : "102%" }} viewport={{ once: true, amount: 1 }}
        transition={{ duration: reduce ? 0 : 1.1, ease: [0.5, 0, 0.1, 1] }}>
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)" />
      </motion.svg>
    </div>
  );
}

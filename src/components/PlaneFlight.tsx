import { motion, useReducedMotion } from "framer-motion";

// Plane follows a curved flight path across the Passport hero, once, on load.
// Points are sampled from a curve up front, then animated with transform only (x, y, rotate).
const P0 = [-60, 470], P1 = [300, 120], P2 = [700, 520], P3 = [1080, 140];
const at = (t: number) => {
  const u = 1 - t;
  const p = (i: number) => u ** 3 * P0[i] + 3 * u * u * t * P1[i] + 3 * u * t * t * P2[i] + t ** 3 * P3[i];
  const d = (i: number) => 3 * u * u * (P1[i] - P0[i]) + 6 * u * t * (P2[i] - P1[i]) + 3 * t * t * (P3[i] - P2[i]);
  return { x: p(0), y: p(1), r: (Math.atan2(d(1), d(0)) * 180) / Math.PI };
};
const N = 24;
const pts = Array.from({ length: N + 1 }, (_, i) => at(i / N));

export default function PlaneFlight() {
  const reduce = useReducedMotion();
  return (
    <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
      <path d={`M${P0} C${P1} ${P2} ${P3}`} fill="none" stroke="var(--color-paper)" strokeOpacity=".18" strokeWidth="1.5" strokeDasharray="2 10" strokeLinecap="round" />
      {!reduce && (
        <motion.g initial={{ x: pts[0].x, y: pts[0].y, rotate: pts[0].r, opacity: 1 }}
          animate={{ x: pts.map((p) => p.x), y: pts.map((p) => p.y), rotate: pts.map((p) => p.r), opacity: [1, ...Array(N - 1).fill(1), 0] }}
          transition={{ duration: 3.2, delay: 0.6, ease: "linear" }}>
          <path d="M14 0 L-10 -8 L-6 0 L-10 8 Z M-2 -1 L-6 -14 L-2 -14 L6 -1 Z M-2 1 L-6 14 L-2 14 L6 1 Z" fill="var(--color-signal)" />
        </motion.g>
      )}
    </svg>
  );
}

import { motion, useReducedMotion } from "framer-motion";

// Split-flap departure board: each character drops in on its own tile, once, on first view.
// Transform + opacity only (rotateX), so it stays smooth on slow phones.
export default function FlipPrice({ text, className = "", tiles = false }: { text: string; className?: string; tiles?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-flex font-mono tabular-nums ${tiles ? "gap-[2px]" : ""} ${className}`} aria-label={text} role="text" style={{ perspective: 400 }}>
      {text.split("").map((c, i) => (
        <motion.span key={i} aria-hidden
          className={`inline-block ${tiles ? "bg-char px-[3px] min-w-[0.9em] text-center" : ""}`}
          style={{ transformOrigin: "50% 0%" }}
          initial={reduce ? false : { rotateX: -90, opacity: 0 }}
          whileInView={{ rotateX: [-90, 12, 0], opacity: 1 }} viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.24, delay: i * 0.045, ease: [0.5, 0, 0.1, 1] }}
        >{c === " " ? " " : c}</motion.span>
      ))}
    </span>
  );
}

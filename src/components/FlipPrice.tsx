import { motion, useReducedMotion } from "framer-motion";

// Departure-board flip: each character flips in once, staggered, when scrolled into view.
export default function FlipPrice({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-flex font-mono tabular-nums ${className}`} aria-label={text} style={{ perspective: 400 }}>
      {text.split("").map((c, i) => (
        <motion.span key={i} aria-hidden className="inline-block"
          initial={reduce ? false : { rotateX: -90, opacity: 0 }}
          whileInView={{ rotateX: 0, opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.22, delay: i * 0.04, ease: [0.5, 0, 0.1, 1] }}
        >{c}</motion.span>
      ))}
    </span>
  );
}

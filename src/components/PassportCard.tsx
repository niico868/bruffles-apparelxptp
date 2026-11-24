import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import FlipPrice from "./FlipPrice";
import { addToCart } from "../lib/cart";
import { formatPrice } from "../lib/price";
import type { PassportItem } from "../data/products";

// Passport card on charcoal. "Add to bag" fires the passport stamp (see Stamp below).
export default function PassportCard({ item }: { item: PassportItem }) {
  const [stamps, setStamps] = useState(0);
  const out = item.qty === 0;
  const add = () => { addToCart({ id: item.id, name: item.name, priceUsd: item.priceUsd }); setStamps((n) => n + 1); nudge(); };
  return (
    <article className="group/pp relative bg-char-2">
      <a href={`/passport/${item.id}`} className="block relative aspect-[4/5] ph-pp overflow-hidden" aria-label={item.name}>
        <span className="absolute left-3 top-3 label-pp text-muted">Photo</span>
        <span className="absolute right-3 top-3 label-pp bg-char text-signal px-2 py-1">{item.id}</span>
        <AnimatePresence>{stamps > 0 && <Stamp key={stamps} />}</AnimatePresence>
      </a>
      <div className="p-4 flex flex-col gap-3">
        <p className="label-pp text-muted">{out ? "Booked out" : `${item.qty} in stock`}{item.packOf > 1 ? ` · Pack of ${item.packOf}` : ""}</p>
        <h3 className="h-pp text-[20px] leading-tight"><a href={`/passport/${item.id}`} className="hover:text-signal transition-colors duration-150">{item.name}</a></h3>
        <FlipPrice text={formatPrice(item.priceUsd)} className="text-[16px] text-paper" />
        <button onClick={add} disabled={out} className="btn-pp w-full label-pp mt-1 disabled:bg-char-3 disabled:text-muted">
          {out ? "Booked out" : <>Add to bag <span aria-hidden>→</span></>}
        </button>
      </div>
    </article>
  );
}

// The 2px screen nudge that sells the stamp's weight. Transform only, skipped under reduced motion.
export function nudge() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelector("main")?.animate(
    [{ transform: "translate(0,0)" }, { transform: "translate(2px,1px)" }, { transform: "translate(-1px,0)" }, { transform: "translate(0,0)" }],
    { duration: 160, delay: 170, easing: "ease-out" });
}

// Stamp slams in from 1.4x at -8°, lands in 180ms, then the ink fades over 1.2s.
export function Stamp() {
  const reduce = useReducedMotion();
  return (
    <motion.div aria-hidden className="absolute inset-0 grid place-items-center pointer-events-none"
      initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.5, duration: 1.2, ease: "easeIn" }}>
      <motion.div className="grid place-items-center w-36 h-36 rounded-full border-[3px] border-stamp text-stamp text-center"
        initial={reduce ? { scale: 1, rotate: -8, opacity: 1 } : { scale: 1.4, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: -8, opacity: 1 }} transition={{ duration: reduce ? 0 : 0.18, ease: [0.5, 0, 0.1, 1] }}>
        <div className="w-[86%] h-[86%] rounded-full border border-stamp grid place-items-center">
          <span className="h-pp text-[22px] leading-none">Cleared<br /><span className="label-pp text-[12px]">for departure</span></span>
        </div>
      </motion.div>
    </motion.div>
  );
}

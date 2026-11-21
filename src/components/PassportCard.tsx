import { useState } from "react";
import { motion, useAnimationControls, useReducedMotion, AnimatePresence } from "framer-motion";
import FlipPrice from "./FlipPrice";
import { addToCart } from "../lib/cart";
import { formatPrice } from "../lib/price";
import type { PassportItem } from "../data/products";

export default function PassportCard({ item }: { item: PassportItem }) {
  const card = useAnimationControls();
  const [stamped, setStamped] = useState(0);
  const reduce = useReducedMotion();
  const out = item.qty === 0;

  const add = () => {
    addToCart({ id: item.id, name: item.name, priceUsd: item.priceUsd });
    setStamped((n) => n + 1); // re-key so the stamp smacks every time
    if (!reduce) card.start({ x: [0, -5, 4, -2, 0], transition: { duration: 0.28, delay: 0.12 } });
  };

  return (
    <motion.article animate={card} className="relative bg-coal-2 text-chalk">
      <div className="relative aspect-[4/5] bg-[#323337] overflow-hidden">
        <span className="absolute bottom-2 left-2 label-ptp opacity-40">Product shot</span>
        <AnimatePresence>
          {stamped > 0 && (
            <motion.div key={stamped}
              className="absolute right-4 top-4 grid place-items-center w-24 h-24 rounded-full border-2 border-gold text-gold label-ptp text-center leading-tight rotate-[-14deg]"
              initial={reduce ? { opacity: 1 } : { scale: 2.2, opacity: 0, rotate: -30 }}
              animate={{ scale: [2.2, 0.86, 1.06, 1], scaleY: [2.2, 0.7, 1.05, 1], opacity: 1, rotate: -14 }}
              transition={{ duration: 0.32, times: [0, 0.45, 0.75, 1], ease: "easeOut" }}
            >Cleared<br />for<br />departure</motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-4 space-y-2">
        <p className="label-ptp text-chalk-soft">Item {item.itemNo} · {out ? "Sold out" : `Qty ${item.qty}`}{item.packOf > 1 ? ` · Pack ${item.packOf}` : ""}</p>
        <h3 className="font-grotesk text-base font-medium tracking-tight">{item.name}</h3>
        <div className="flex items-center justify-between pt-1">
          <FlipPrice text={formatPrice(item.priceUsd)} className="text-sm" />
          <motion.button onClick={add} disabled={out} whileTap={{ scale: 0.94 }}
            className="label-ptp px-3 py-2 min-h-11 border border-chalk/30 hover:border-gold hover:text-gold transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none"
          >{out ? "Gate closed" : "Add to bag"}</motion.button>
        </div>
      </div>
    </motion.article>
  );
}

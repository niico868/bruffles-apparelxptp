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
    <motion.article animate={card} className="relative bg-jet-2/70 backdrop-blur-[1px] text-chalk">
      <a href={`/passport/${item.id}`} className="block relative aspect-[4/5] bg-jet-3/60 overflow-hidden">
        <span className="absolute bottom-2 left-2 label-ptp opacity-40">Product shot</span>
        <AnimatePresence>
          {stamped > 0 && (
            <motion.div key={stamped}
              className="absolute right-4 top-4 grid place-items-center w-24 h-24 rounded-full border-2 border-signal text-signal label-ptp text-center leading-tight rotate-[-14deg]"
              initial={reduce ? { opacity: 1 } : { scale: 2.2, opacity: 0, rotate: -30 }}
              animate={{ scale: [2.2, 0.86, 1.06, 1], scaleY: [2.2, 0.7, 1.05, 1], opacity: 1, rotate: -14 }}
              transition={{ duration: 0.32, times: [0, 0.45, 0.75, 1], ease: "easeOut" }}
            >Cleared<br />for<br />departure</motion.div>
          )}
        </AnimatePresence>
      </a>
      <div className="h-44 p-4 flex flex-col items-center text-center justify-between">
        <p className="label-ptp text-signal w-full truncate text-[10px] sm:text-[11px]">Item {item.itemNo} · {out ? "Sold out" : `Qty ${item.qty}`}{item.packOf > 1 ? ` · Pack ${item.packOf}` : ""}</p>
        <a href={`/passport/${item.id}`} className="h-ptp name-hover text-[15px] max-w-full truncate hover:text-white">{item.name}</a>
        <FlipPrice text={formatPrice(item.priceUsd)} className="text-sm text-chalk-soft" />
        <BoardButton out={out} onBoard={add} />
      </div>
    </motion.article>
  );
}

// Passport button: a boarding-pass ticket. Leaf-green body with punched notches and a perforated
// stub; a quick lift on hover and a squash on press, like a ticket being torn at the gate.
export function BoardButton({ out, onBoard }: { out: boolean; onBoard: () => void }) {
  const notch = { WebkitMask: "radial-gradient(circle 7px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 7px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat",
                  mask: "radial-gradient(circle 7px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 7px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat" } as React.CSSProperties;
  return (
    <motion.button onClick={onBoard} disabled={out} style={notch}
      whileHover={out ? undefined : { y: -2 }} whileTap={out ? undefined : { scaleY: 0.9, scaleX: 1.03 }}
      transition={{ duration: 0.15, ease: [0.5, 0, 0.1, 1] }}
      className={`relative w-full min-h-11 flex items-stretch label-ptp ${out ? "bg-jet-3/60 text-chalk-soft" : "bg-signal text-jet hover:bg-[#ffd447]"} transition-colors duration-150`}>
      <span className="flex-1 grid place-items-center tracking-[0.14em] whitespace-nowrap">{out ? "Booked" : <><span className="sm:hidden">Board</span><span className="hidden sm:inline">Board · Add to bag</span></>}</span>
      <span aria-hidden className={`w-10 sm:w-12 grid place-items-center border-l border-dashed ${out ? "border-chalk/20" : "border-jet/40 text-jet"}`}>{out ? "—" : "+1"}</span>
    </motion.button>
  );
}

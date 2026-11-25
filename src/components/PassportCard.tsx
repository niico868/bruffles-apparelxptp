import { useRef } from "react";
import FlipPrice from "./FlipPrice";
import { addToCart } from "../lib/cart";
import { formatPrice } from "../lib/price";
import type { PassportItem } from "../data/products";
import type { Pic } from "../lib/pic";

// Passport card on charcoal. "Add to bag" fires the passport stamp (see Stamp below).
export default function PassportCard({ item, pic }: { item: PassportItem; pic?: Pic }) {
  const stamp = useRef<HTMLDivElement>(null);
  const out = item.qty === 0;
  const add = () => { slam(stamp.current); nudge(); addToCart({ id: item.id, name: item.name, priceUsd: item.priceUsd }); };
  return (
    <article className="group/pp relative bg-char-2">
      <a href={`/passport/${item.id}`} className="block relative aspect-[4/5] ph-pp overflow-hidden" aria-label={item.name}>
        {pic
          ? <img src={pic.src} srcSet={pic.srcset} sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" alt={pic.alt}
              width={pic.w} height={pic.h} loading="lazy" decoding="async"
              className={`absolute inset-0 w-full h-full object-cover ${out ? "grayscale opacity-60" : ""}`} style={{ objectPosition: pic.focal }} />
          : <span className="absolute left-3 top-3 label-pp text-muted">Photo</span>}
        <Stamp ref={stamp} />
      </a>
      <div className="p-4 flex flex-col gap-3">
        <p className="label-pp text-muted">{out ? "Sold out" : `${item.qty} in stock`}{item.packOf > 1 ? ` · Pack of ${item.packOf}` : ""}</p>
        <h3 className="h-pp text-[20px] leading-tight"><a href={`/passport/${item.id}`} className="hover:text-signal transition-colors duration-150">{item.name}</a></h3>
        <FlipPrice text={formatPrice(item.priceUsd)} className="text-[16px] text-paper" />
        <button onClick={add} disabled={out} className="btn-pp w-full label-pp mt-1 !px-3 whitespace-nowrap disabled:bg-char-3 disabled:text-muted">
          {out ? "Sold out" : "Add to bag"}
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

// The stamp is always in the page, invisible. slam() replays it with the Web Animations API:
// it slams in from 1.4x at -8° and lands in 180ms, then the ink fades over 1.2s.
// No React re-render on click, so the tap stays instant on slow phones.
export function slam(el: HTMLElement | null) {
  if (!el) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.getAnimations().forEach((a) => a.cancel());
  el.animate(reduce
    ? [{ opacity: 1 }, { opacity: 1, offset: 0.3 }, { opacity: 0 }]
    : [{ opacity: 0, transform: "scale(1.4) rotate(-8deg)" },
       { opacity: 1, transform: "scale(1) rotate(-8deg)", offset: 0.13, easing: "ease-in" },
       { opacity: 1, transform: "scale(1) rotate(-8deg)", offset: 0.27 },
       { opacity: 0, transform: "scale(1) rotate(-8deg)" }],
    { duration: 1380, easing: "cubic-bezier(.5,0,.1,1)" });
}

export const Stamp = ({ ref }: { ref: React.Ref<HTMLDivElement> }) => (
  <div aria-hidden className="absolute inset-0 grid place-items-center pointer-events-none">
    <div ref={ref} style={{ opacity: 0 }} className="grid place-items-center w-36 h-36 rounded-full border-[3px] border-stamp text-stamp text-center">
      <div className="w-[86%] h-[86%] rounded-full border border-stamp grid place-items-center">
        <span className="h-pp text-[22px] leading-none">Added<br /><span className="label-pp text-[12px]">to your bag</span></span>
      </div>
    </div>
  </div>
);

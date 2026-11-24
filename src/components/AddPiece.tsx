import { useEffect, useRef, useState } from "react";
import { addToCart } from "../lib/cart";
import { formatPrice } from "../lib/price";

// Buy button for a 1-of-1 piece. On phones, a bar with price + "Add to bag" sticks to the bottom
// of the screen whenever the main button has scrolled out of view.
export default function AddPiece({ id, name, priceUsd, sold }: { id: string; name: string; priceUsd: number; sold: boolean }) {
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting), { threshold: 0 });
    io.observe(ref.current); return () => io.disconnect();
  }, []);
  const add = () => { addToCart({ id, name, priceUsd }); setAdded(true); };
  if (sold) return <p className="w-full text-center py-4 border border-hair text-ink-soft">Found its owner</p>;
  const label = added ? "In your bag" : "Add to bag";
  return (
    <>
      <div ref={ref}><button disabled={added} onClick={add} className="btn-bf w-full label-bf disabled:bg-gold disabled:text-ink">{label}</button></div>
      <div className={`md:hidden fixed inset-x-0 bottom-0 z-40 bg-bone border-t border-hair px-4 py-3 flex items-center gap-4 transition-transform duration-500 ease-[var(--ease-calm)] ${showBar ? "translate-y-0" : "translate-y-full"}`}
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }} aria-hidden={!showBar}>
        <div className="min-w-0 flex-1"><p className="text-[14px] truncate">{name}</p><p className="tabular-nums font-semibold">{formatPrice(priceUsd)}</p></div>
        <button disabled={added} tabIndex={showBar ? 0 : -1} onClick={add} className="btn-bf label-bf disabled:bg-gold disabled:text-ink">{label}</button>
      </div>
    </>
  );
}

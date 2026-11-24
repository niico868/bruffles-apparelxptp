import { useEffect, useState } from "react";
import { addToCart } from "../lib/cart";
import { formatPrice } from "../lib/price";

// KOI sticky mini bar (computers): slides down under the header once the main "Add to bag" button
// has scrolled away. Phones keep their own bottom bar (inside AddPiece).
export default function MiniBuyBar({ id, name, num, priceUsd, thumb }: { id: string; name: string; num: string; priceUsd: number; thumb?: string }) {
  const [show, setShow] = useState(false);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    const target = document.getElementById("buy-main"); if (!target) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(target); return () => io.disconnect();
  }, []);
  return (
    <div aria-hidden={!show} className={`hidden md:block fixed inset-x-0 top-14 z-30 bg-bone/95 backdrop-blur border-b border-hair transition-transform duration-500 ease-[var(--ease-calm)] ${show ? "translate-y-0" : "-translate-y-[200%]"}`}>
      <div className="wrap h-16 flex items-center gap-4">
        <div className="w-10 h-[50px] ph-bf overflow-hidden shrink-0">{thumb && <img src={thumb} alt="" className="w-full h-full object-cover" />}</div>
        <p className="ui text-[13px] min-w-0 truncate"><span className="num-bf text-[20px] mr-2 normal-case">{num}</span>{name}</p>
        <p className="ui ml-auto tabular-nums">{formatPrice(priceUsd)}</p>
        <button tabIndex={show ? 0 : -1} disabled={added} onClick={() => { addToCart({ id, name, priceUsd }); setAdded(true); }}
          className="btn-bf label-bf !min-h-10 disabled:bg-gold disabled:text-ink">{added ? "In your bag" : "Add to bag"}</button>
      </div>
    </div>
  );
}

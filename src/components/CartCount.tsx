import { useEffect, useState } from "react";
import { cartCount } from "../lib/cart";

export default function CartCount({ icon = false }: { icon?: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const sync = () => setN(cartCount());
    sync();
    window.addEventListener("cart:change", sync);
    return () => window.removeEventListener("cart:change", sync);
  }, []);
  if (icon) return (
    <a href="/bag" className="relative w-10 h-10 grid place-items-center" aria-label={`Bag, ${n} ${n === 1 ? "item" : "items"}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M5 8h14l-1.2 12H6.2z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
      {n > 0 && <span aria-hidden className="absolute right-0.5 top-0.5 min-w-4 h-4 px-1 rounded-full bg-gold text-ink text-[10px] font-semibold grid place-items-center tabular-nums">{n}</span>}
    </a>
  );
  return <a href="/bag" aria-live="polite">Bag ({n})</a>;
}

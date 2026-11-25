import FlipPrice from "./FlipPrice";
import { formatPrice } from "../lib/price";
import type { PassportItem } from "../data/products";

// Passport price list: one row per product (name, pack, price, availability). Prices flip in on first view.
export default function PassportList({ items }: { items: PassportItem[] }) {
  return (
    <div className="bg-char-2 border border-char-3">
      <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_140px_120px_140px] gap-4 px-4 py-3 border-b border-char-3 label-pp text-muted">
        <span>Product</span><span className="hidden md:block">Pack</span><span className="hidden md:block text-right">Price</span><span className="text-right">Availability</span>
      </div>
      {items.map((it) => {
        const out = it.qty === 0;
        return (
          <a key={it.id} href={`/passport/${it.id}`}
            className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_140px_120px_140px] gap-4 items-center px-4 min-h-14 py-2 border-b border-char-3 last:border-b-0 hover:bg-char-3 transition-colors duration-150">
            <span className="h-pp text-[18px] truncate">{it.name}</span>
            <span className="hidden md:block label-pp text-muted">{it.packOf > 1 ? `Pack of ${it.packOf}` : "Single"}</span>
            <span className="hidden md:block text-right"><FlipPrice text={formatPrice(it.priceUsd)} className="text-[16px]" /></span>
            <span className={`text-right label-pp ${out ? "text-muted" : "text-signal"}`}>{out ? "Sold out" : "In stock"}</span>
          </a>
        );
      })}
    </div>
  );
}

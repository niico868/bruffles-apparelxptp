import FlipPrice from "./FlipPrice";
import { formatPrice } from "../lib/price";
import type { PassportItem } from "../data/products";

// The Passport collection as a departures board: one row per item, flips in on first view.
export default function DepartureBoard({ items }: { items: PassportItem[] }) {
  return (
    <div className="bg-char-2 border border-char-3">
      <div className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[96px_1fr_140px_120px_140px] gap-4 px-4 py-3 border-b border-char-3 label-pp text-muted">
        <span>Item</span><span>Departure</span><span className="hidden md:block">Pack</span><span className="hidden md:block text-right">Fare</span><span className="text-right">Status</span>
      </div>
      {items.map((it) => {
        const out = it.qty === 0;
        return (
          <a key={it.id} href={`/passport/${it.id}`}
            className="grid grid-cols-[64px_1fr_auto] md:grid-cols-[96px_1fr_140px_120px_140px] gap-4 items-center px-4 min-h-14 py-2 border-b border-char-3 last:border-b-0 hover:bg-char-3 transition-colors duration-150">
            <FlipPrice text={String(it.itemNo).padStart(2, "0")} tiles className="text-[16px] text-signal" />
            <span className="h-pp text-[18px] truncate">{it.name}</span>
            <span className="hidden md:block label-pp text-muted">{it.packOf > 1 ? `Pack of ${it.packOf}` : "Single"}</span>
            <span className="hidden md:block text-right"><FlipPrice text={formatPrice(it.priceUsd)} className="text-[16px]" /></span>
            <span className={`text-right label-pp ${out ? "text-muted" : "text-signal"}`}><FlipPrice text={out ? "BOOKED" : "BOARDING"} /></span>
          </a>
        );
      })}
    </div>
  );
}

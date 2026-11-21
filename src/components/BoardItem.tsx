import { useState } from "react";
import { BoardButton } from "./PassportCard";
import { addToCart } from "../lib/cart";

// Passport product page: quantity stepper (bulk) + the boarding-pass Board button.
export default function BoardItem({ id, name, priceUsd, qty }: { id: string; name: string; priceUsd: number; qty: number }) {
  const [n, setN] = useState(1);
  const [done, setDone] = useState(false);
  const out = qty === 0;
  return (
    <div className="space-y-3">
      {!out && (
        <div className="flex items-center justify-between border border-jet/25 h-12 px-2 label-ptp">
          <button className="w-10 h-10 hover:text-signal-deep" onClick={() => setN(Math.max(1, n - 1))} aria-label="Fewer">−</button>
          <span className="tabular-nums">{n} {n === 1 ? "unit" : "units"}</span>
          <button className="w-10 h-10 hover:text-signal-deep" onClick={() => setN(Math.min(qty, n + 1))} aria-label="More">+</button>
        </div>
      )}
      <BoardButton out={out} onBoard={() => { addToCart({ id, name, priceUsd }, n); setDone(true); }} />
      {done && <p className="label-ptp text-signal-deep">Cleared · {n} in your bag</p>}
    </div>
  );
}

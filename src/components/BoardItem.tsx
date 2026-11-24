import { useState } from "react";
import { addToCart } from "../lib/cart";
import { nudge } from "./PassportCard";

// Passport product page: bulk quantity stepper + Add to bag with the stamp moment.
export default function BoardItem({ id, name, priceUsd, qty }: { id: string; name: string; priceUsd: number; qty: number }) {
  const [n, setN] = useState(1);
  const [stamps, setStamps] = useState(0);
  const out = qty === 0;
  const add = () => { addToCart({ id, name, priceUsd }, n); setStamps((s) => s + 1); window.dispatchEvent(new CustomEvent("pp:stamp")); nudge(); };
  return (
    <div className="relative space-y-3">
      {!out && (
        <div className="flex items-center justify-between border border-char-3 h-12 label-pp">
          <button className="w-12 h-12 hover:text-signal" onClick={() => setN(Math.max(1, n - 1))} aria-label="Fewer">−</button>
          <span className="tabular-nums" aria-live="polite">{n} {n === 1 ? "unit" : "units"}</span>
          <button className="w-12 h-12 hover:text-signal" onClick={() => setN(Math.min(qty, n + 1))} aria-label="More">+</button>
        </div>
      )}
      <button onClick={add} disabled={out} className="btn-pp w-full label-pp disabled:bg-char-3 disabled:text-muted">
        {out ? "Booked out" : "Add to bag"}
      </button>
      {stamps > 0 && <p className="label-pp text-signal" aria-live="polite">Cleared · in your bag</p>}
    </div>
  );
}

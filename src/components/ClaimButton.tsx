import { useState } from "react";
import { addToCart } from "../lib/cart";

// Bruffels button: quiet luxury. Gold hairline; on hover a gold fill sweeps in slowly from the left
// and the text turns royal purple. Reads like reserving a gallery piece, not "adding to cart".
export default function ClaimButton({ id, name, priceUsd, sold, full = false }: { id: string; name: string; priceUsd: number; sold: boolean; full?: boolean }) {
  const [claimed, setClaimed] = useState(false);
  const h = full ? "min-h-12" : "min-h-11";
  if (sold) return <span className={`grid place-items-center ${h} w-full border border-dashed border-gold/40 label-bsa text-gold/70 whitespace-nowrap`}><span className="sm:hidden">Gone</span><span className="hidden sm:inline">Gone · found its owner</span></span>;
  return (
    <button
      disabled={claimed}
      onClick={() => { addToCart({ id, name, priceUsd }); setClaimed(true); }}
      className={`group relative ${h} w-full overflow-hidden border border-gold label-bsa text-gold transition-colors duration-700 ease-[var(--ease-calm)] hover:text-royal disabled:text-royal`}
    >
      <span aria-hidden className={`absolute inset-0 bg-gold origin-left transition-transform duration-700 ease-[var(--ease-calm)] ${claimed ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
      <span className="relative whitespace-nowrap">{claimed ? <><span className="sm:hidden">Claimed</span><span className="hidden sm:inline">Claimed · in your bag</span></> : <><span className="sm:hidden">Claim</span><span className="hidden sm:inline">Claim · 1 of 1</span></>}</span>
    </button>
  );
}

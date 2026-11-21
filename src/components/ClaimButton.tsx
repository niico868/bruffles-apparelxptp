import { useState } from "react";
import { addToCart } from "../lib/cart";

// Bruffels button: brushed-gold outline that simply illuminates. On hover the gold fill
// fades in smoothly (no sweep, no charge-up) and the text turns royal purple.
export default function ClaimButton({ id, name, priceUsd, sold, full = false }: { id: string; name: string; priceUsd: number; sold: boolean; full?: boolean }) {
  const [claimed, setClaimed] = useState(false);
  const h = full ? "min-h-12" : "min-h-11";
  if (sold) return <span className={`grid place-items-center ${h} w-full border border-dashed border-gold/60 label-bsa text-sm text-gold whitespace-nowrap`}><span className="sm:hidden">Gone</span><span className="hidden sm:inline">Gone · found its owner</span></span>;
  return (
    <button
      disabled={claimed}
      onClick={() => { addToCart({ id, name, priceUsd }); setClaimed(true); }}
      className={`group relative ${h} w-full overflow-hidden p-px gold-metal label-bsa text-sm ${claimed ? "text-jet" : "text-chalk hover:text-jet"} transition-colors duration-300`}
    >
      {/* inner panel: white at rest, fades out to reveal the gold on hover */}
      <span aria-hidden className={`absolute inset-px bg-jet-2 transition-opacity duration-300 ease-out ${claimed ? "opacity-0" : "group-hover:opacity-0"}`} />
      <span className={`relative whitespace-nowrap font-semibold ${claimed ? "" : ""}`}>
        {claimed ? <><span className="sm:hidden">Claimed</span><span className="hidden sm:inline">Claimed · in your bag</span></>
          : <><span className="sm:hidden">Claim</span><span className="hidden sm:inline">Claim · 1 of 1</span></>}
      </span>
    </button>
  );
}

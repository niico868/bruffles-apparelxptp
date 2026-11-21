import { useState } from "react";
import { addToCart } from "../lib/cart";

export default function AddPiece({ id, name, priceUsd, sold }: { id: string; name: string; priceUsd: number; sold: boolean }) {
  const [added, setAdded] = useState(false);
  if (sold) return <p className="w-full text-center py-4 border border-line label-bsa text-ink-soft">This piece has found its owner</p>;
  return (
    <button disabled={added} onClick={() => { addToCart({ id, name, priceUsd }); setAdded(true); }}
      className="w-full min-h-12 py-4 bg-ink text-paper label-bsa hover:bg-gold hover:text-ink transition-colors duration-500 disabled:bg-gold disabled:text-ink">
      {added ? "In your bag · held 15 min" : "Add to bag"}
    </button>
  );
}

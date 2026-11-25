import { useState } from "react";
import AddPiece from "./AddPiece";

export type Swatch = { key: string; colour: string; size: string; thumb?: string };

// Colour swatches beside the price (Divine's reference, 2026-11-25). Each colourway is its own single
// piece in its own size, so picking a swatch changes the size shown and what "Add to bag" adds, and
// tells the gallery to show that colourway ("piece-variant" event).
export default function VariantPicker({ id, name, priceUsd, swatches }: { id: string; name: string; priceUsd: number; swatches: Swatch[] }) {
  const [k, setK] = useState(0);
  const v = swatches[k];
  const pick = (n: number) => {
    setK(n);
    dispatchEvent(new CustomEvent("piece-variant", { detail: { key: swatches[n].key } }));
  };
  const lineId = k === 0 ? id : `${id}-${v.key}`;
  return (
    <div>
      <p className="ui text-[13px]">Colour: <span className="text-ink-soft">{v.colour}</span></p>
      <div className="mt-3 flex gap-3" role="radiogroup" aria-label="Colour">
        {swatches.map((s, n) => (
          <button key={s.key} type="button" role="radio" aria-checked={n === k} aria-label={`${s.colour}, size ${s.size}`} onClick={() => pick(n)}
            className={`w-[76px] aspect-square bg-white p-1 border transition-colors duration-300 ${n === k ? "border-ink ring-1 ring-ink" : "border-hair hover:border-ink-soft"}`}>
            {s.thumb ? <img src={s.thumb} alt="" width={68} height={68} className="w-full h-full object-contain" /> : <span className="ui text-[11px]">{s.colour}</span>}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <p className="ui text-[13px]">Size: <span className="text-ink-soft">{v.size}</span></p>
        <div className="mt-3 flex">
          <span key={v.key} className="ui text-[13px] min-h-12 px-5 grid place-items-center border border-ink bg-ink text-bone anim-fade">{v.size} · the only one</span>
        </div>
      </div>

      <div id="buy-main" className="mt-6 space-y-3">
        <AddPiece key={lineId} id={lineId} name={`${name}, ${v.colour}`} priceUsd={priceUsd} sold={false} />
        <p className="text-[13px] text-ink-soft">One piece in each colour. First to check out gets it.</p>
      </div>
    </div>
  );
}

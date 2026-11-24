import { useRef, useState } from "react";

// KOI's Details / Shipping / Care tabs, built as proper tabs (arrow keys move between them).
export default function InfoTabs({ size, measurements }: { size: string; measurements: Record<string, string> }) {
  const tabs = ["Size & measurements", "Delivery", "Care"] as const;
  const [t, setT] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const key = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!d) return;
    const n = (t + d + tabs.length) % tabs.length; setT(n); refs.current[n]?.focus();
  };
  const ph = (what: string) => (
    <div className="border border-dashed border-gold-deep/60 p-4"><p className="label-bf text-gold-text">[CLIENT TO CONFIRM]</p>
      <p className="mt-2 text-ink-soft">{what}</p></div>
  );
  return (
    <div>
      <div role="tablist" aria-label="Piece information" className="flex gap-6 border-b border-hair" onKeyDown={key}>
        {tabs.map((label, n) => (
          <button key={label} ref={(el) => { refs.current[n] = el; }} role="tab" id={`tab-${n}`} aria-controls={`panel-${n}`} aria-selected={t === n} tabIndex={t === n ? 0 : -1}
            onClick={() => setT(n)} className={`ui text-[13px] min-h-12 -mb-px border-b ${t === n ? "border-ink" : "border-transparent text-ink-soft hover:text-ink"}`}>{label}</button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${t}`} aria-labelledby={`tab-${t}`} tabIndex={0} className="pt-5 focus:outline-none">
        {t === 0 && (
          <dl className="divide-y divide-hair">
            <div className="flex justify-between py-2"><dt className="ui text-[13px] text-ink-soft">Size</dt><dd className="tabular-nums">{size}</dd></div>
            {Object.entries(measurements).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2"><dt className="ui text-[13px] text-ink-soft">{k}</dt><dd className="tabular-nums">{v}</dd></div>
            ))}
          </dl>
        )}
        {t === 1 && ph("Delivery areas, times and costs in Trinidad & Tobago, in the owners' words.")}
        {t === 2 && ph("Care instructions (washing, drying, storing), from the brand tag.")}
      </div>
    </div>
  );
}

import { useRef, useState } from "react";

export type SearchItem = { name: string; maker: string; href: string; tag: string };

// Search across both shops (the catalogue is small, so it is filtered right here in the browser).
export default function ShopSearch({ items }: { items: SearchItem[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hits = words.length ? items.filter((it) => words.every((w) => `${it.name} ${it.maker} ${it.tag}`.toLowerCase().includes(w))) : [];
  return (
    <>
      <button type="button" onClick={() => dlg.current?.showModal()} className="w-10 h-10 grid place-items-center" aria-label="Search" aria-haspopup="dialog">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
      </button>
      <dialog ref={dlg} onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}
        className="m-0 mt-0 w-full max-w-none bg-white text-ink p-0 backdrop:bg-ink/40" aria-label="Search the shop">
        <div className="wrap py-6">
          <div className="flex items-center gap-3 border-b border-ink pb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pieces, brands, Passport items" aria-label="Search"
              className="flex-1 min-w-0 bg-transparent text-[18px] outline-none placeholder:text-ink-soft" />
            <button type="button" onClick={() => dlg.current?.close()} className="ui text-[13px] min-h-12 px-2">Close</button>
          </div>
          <ul className="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-hair" aria-live="polite">
            {hits.map((h) => (
              <li key={h.href}><a href={h.href} className="flex items-baseline justify-between gap-4 py-3 hover:text-gold-text">
                <span><span className="ui text-[12px] text-gold-text mr-2">{h.maker}</span>{h.name}</span>
                <span className="ui text-[12px] text-ink-soft shrink-0">{h.tag}</span></a></li>
            ))}
            {words.length > 0 && hits.length === 0 && <li className="py-3 text-ink-soft">Nothing matches "{q}". Try a brand, like BAPE or Nike.</li>}
          </ul>
        </div>
      </dialog>
    </>
  );
}

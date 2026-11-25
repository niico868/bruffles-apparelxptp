// ADDON: missed-it waitlist. The archive of Gone pieces with a "Request it back" on each.
import { useState } from "react";
import RequestBack from "./RequestBack";

export type ArchiveItem = {
  id: string; pieceNo: number; num: string; name: string; maker: string; size: string; requests: number;
  pic?: { src: string; srcset: string; alt: string; w: number; h: number };
  sig?: { d: string; w: number; h: number; area: string };
};

export default function ArchiveList({ items }: { items: ArchiveItem[] }) {
  const [sort, setSort] = useState<"new" | "most">("new");
  const list = [...items].sort((a, b) => (sort === "new" ? b.pieceNo - a.pieceNo : b.requests - a.requests));
  return (
    <div>
      <div className="flex items-center justify-between gap-4 border-b border-hair pb-4" role="group" aria-label="Sort the archive">
        <p className="ui text-[13px] text-ink-soft">{items.length} pieces gone</p>
        <div className="flex gap-1">
          {([["new", "Newest"], ["most", "Most requested"]] as const).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={sort === k} onClick={() => setSort(k)}
              className={`ui text-[13px] min-h-11 px-3 ${sort === k ? "underline underline-offset-4 decoration-ink" : "text-ink-soft hover:text-ink"}`}>{l}</button>
          ))}
        </div>
      </div>
      <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
        {list.map((p, n) => (
          <li key={p.id}>
            <a href={`/bruffles/${p.id}`} className="group/a block" aria-label={`${p.name}, piece ${p.id}, gone`}>
              <div className={`relative aspect-[4/5] overflow-hidden ${p.pic ? "bg-paper" : "ph-bf"}`}>
                {p.pic
                  ? <img src={p.pic.src} srcSet={p.pic.srcset} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" alt={p.pic.alt}
                      width={p.pic.w} height={p.pic.h} loading={n < 3 ? "eager" : "lazy"} fetchPriority={n === 0 ? "high" : undefined} decoding="async" className="absolute inset-0 w-full h-full object-cover gone-img" />
                  : <><span className="absolute left-3 top-3 label-bf text-ink-soft">Photo · {p.num}</span>
                      <span aria-hidden className="absolute right-4 bottom-2 num-bf text-[96px] text-ink/10">{p.num}</span></>}
                <span aria-hidden className="gone-stamp right-3 top-3">Gone</span>
              </div>
            </a>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="ui text-[12px] text-ink-soft">{p.id} · {p.maker}</p>
                <h2 className="ui mt-1 text-[15px]"><a href={`/bruffles/${p.id}`} className="hover:underline underline-offset-4 decoration-hair">{p.name}</a></h2>
              </div>
              {p.sig && (
                <a href={`/bruffles/${p.id}#signed`} className="shrink-0 bg-white px-2 py-1 shadow-[0_1px_2px_rgb(28_26_23/.08)] -rotate-2"
                  aria-label={`Customer Verified: signed for in ${p.sig.area}`}>
                  <svg viewBox={`0 0 ${p.sig.w} ${p.sig.h}`} className="sig block h-7 w-auto max-w-[96px]" aria-hidden><path d={p.sig.d} /></svg>
                </a>
              )}
            </div>
            <div className="mt-4"><RequestBack id={p.id} requests={p.requests} size={p.size} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

export type Shot = { label: string; alt: string; src?: string; srcset?: string; full?: string; w?: number; h?: number };

// KOI-style gallery (today each piece has one flat lay; it still handles several if that changes). Desktop: first photo full width, then a two-column grid, scrolled past the
// sticky buy column. Phone: a swipe strip with a counter. Any photo opens a full-screen viewer
// (arrow keys, Esc, swipe). Missing photos show labelled placeholders in the same order.
export default function Gallery({ shots, sold = false, num }: { shots: Shot[]; sold?: boolean; num: string }) {
  const strip = useRef<HTMLDivElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const real = shots.map((s, n) => (s.src ? n : -1)).filter((n) => n >= 0);
  const onScroll = () => { const el = strip.current; if (el) setI(Math.round(el.scrollLeft / el.clientWidth)); };

  const show = (n: number) => { if (!shots[n]?.src) return; setOpen(n); dlg.current?.showModal(); };
  const step = (d: number) => setOpen((o) => { if (o === null) return o; const k = real.indexOf(o); return real[(k + d + real.length) % real.length]; });
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (open === null) return; if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [open]);

  const shot = (s: Shot, n: number, sizes: string, tail = false) => (
    <div className={`relative ${tail ? "aspect-[4/3]" : "aspect-[4/5]"} overflow-hidden ${s.src ? "" : "ph-bf"}`}>
      {s.src ? (
        <button type="button" onClick={() => show(n)} className="absolute inset-0 w-full h-full cursor-zoom-in" aria-label={`Open photo: ${s.alt}`}>
          <img src={s.src} srcSet={s.srcset} sizes={sizes} alt={s.alt} width={s.w} height={s.h} loading={n === 0 ? "eager" : "lazy"} fetchPriority={n === 0 ? "high" : undefined}
            className={`absolute inset-0 w-full h-full object-cover ${sold ? "gone-img" : ""}`} />
        </button>
      ) : <span className="absolute left-4 top-4 label-bf text-ink-soft">Photo · {s.label}</span>}
      {n === 0 && !s.src && <span aria-hidden className="absolute right-4 bottom-2 num-bf text-[96px] text-ink/10">{num}</span>}
      {n === 0 && sold && <span aria-hidden className="gone-stamp right-4 top-4 !w-20 !h-20 !text-[14px]">Gone</span>}
    </div>
  );

  return (
    <div>
      <div className="hidden md:grid grid-cols-2 gap-2">
        {shots.map((s, n) => {
          // First photo full width; if the rest don't pair up evenly, the last one goes full width too.
          const wide = n === 0 || (shots.length % 2 === 0 && n === shots.length - 1);
          return <div key={s.label} className={wide ? "col-span-2" : ""}>{shot(s, n, wide ? "60vw" : "30vw", wide && n > 0)}</div>;
        })}
      </div>
      <div className="md:hidden relative -mx-[var(--spacing-gutter)]">
        <div ref={strip} onScroll={onScroll} className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none]" aria-label="Photos, swipe for more">
          {shots.map((s, n) => <div key={s.label} className="snap-center shrink-0 w-full">{shot(s, n, "100vw")}</div>)}
        </div>
        {shots.length > 1 && <p className="absolute right-4 top-4 ui text-[12px] bg-bone/90 px-2 py-1 tabular-nums" aria-live="polite">{i + 1} / {shots.length}</p>}
      </div>

      <dialog ref={dlg} onClose={() => setOpen(null)} onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}
        className="m-0 w-full h-full max-w-none max-h-none bg-bone p-0 backdrop:bg-ink/60" aria-label="Photo viewer">
        {open !== null && (
          <div className="relative w-full h-full flex items-center justify-center"
            onTouchStart={(e) => ((dlg.current as any)._x = e.touches[0].clientX)}
            onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - (dlg.current as any)._x; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }}>
            <img src={shots[open].full ?? shots[open].src} alt={shots[open].alt} className="max-w-full max-h-full object-contain" />
            <p className="absolute left-4 top-4 ui text-[13px]">{shots[open].label}{real.length > 1 && ` · ${real.indexOf(open) + 1} / ${real.length}`}</p>
            <button type="button" onClick={() => dlg.current?.close()} className="absolute right-2 top-2 ui min-h-12 px-4">Close</button>
            {real.length > 1 && <>
              <button type="button" onClick={() => step(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center ui bg-bone/80" aria-label="Previous photo">←</button>
              <button type="button" onClick={() => step(1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center ui bg-bone/80" aria-label="Next photo">→</button>
            </>}
          </div>
        )}
      </dialog>
    </div>
  );
}

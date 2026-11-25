import { useEffect, useRef, useState } from "react";
import type { Shot } from "./Gallery";

export type ShotSet = { key: string; colour: string; shots: Shot[] };

// Product page gallery (Divine's reference, 2026-11-25): a "product view list" of thumbnails down
// the left, one big photo beside it. Phone: swipe strip with the thumbnails in a row underneath.
// When a colour swatch is picked (VariantPicker fires "piece-variant"), the photos switch to that
// colourway. Any photo opens a full-screen viewer (arrow keys, Esc, swipe).
export default function PieceGallery({ sets, sold = false }: { sets: ShotSet[]; sold?: boolean }) {
  const [key, setKey] = useState(sets[0]?.key);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const shots = (sets.find((s) => s.key === key) ?? sets[0]).shots.filter((s) => s.src);

  useEffect(() => {
    const on = (e: Event) => { setKey((e as CustomEvent<{ key: string }>).detail.key); go(0, false); };
    addEventListener("piece-variant", on); return () => removeEventListener("piece-variant", on);
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (!open) return; if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, [open, shots.length]);

  // Keep the phone strip and the thumbnails in step.
  function go(n: number, smooth = true) {
    setI(n);
    const el = strip.current;
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }
  const step = (d: number) => setI((n) => (n + d + shots.length) % shots.length);
  const onScroll = () => { const el = strip.current; if (el) setI(Math.round(el.scrollLeft / el.clientWidth)); };
  const cur = shots[Math.min(i, shots.length - 1)];
  const imgCls = `absolute inset-0 w-full h-full object-contain ${sold ? "gone-img" : ""}`;

  const thumbs = (row: boolean) => (
    <ul className={row ? "flex gap-2 overflow-x-auto [scrollbar-width:none] px-[var(--spacing-gutter)]" : "flex flex-col gap-2"} aria-label="Product views">
      {shots.map((s, n) => (
        <li key={s.src} className="shrink-0">
          <button type="button" onClick={() => go(n)} aria-current={n === i ? "true" : undefined} aria-label={`View ${n + 1}: ${s.label}`}
            className={`block w-16 md:w-[76px] aspect-[4/5] bg-white border transition-colors duration-300 ${n === i ? "border-ink" : "border-hair hover:border-ink-soft"}`}>
            <img src={s.thumb ?? s.src} alt="" width={76} height={95} loading="lazy" decoding="async" className="w-full h-full object-contain" />
          </button>
        </li>
      ))}
    </ul>
  );

  if (!cur) return <div className="aspect-[4/5] ph-bf" />;
  return (
    <div>
      {/* Computer: view list on the left, one big photo */}
      <div className="hidden md:grid grid-cols-[76px_1fr] gap-6 items-start">
        {thumbs(false)}
        <button type="button" onClick={() => { setOpen(true); dlg.current?.showModal(); }}
          className="relative block aspect-[4/5] w-full bg-white cursor-zoom-in" aria-label={`Open photo: ${cur.alt}`}>
          <img key={cur.src} src={cur.src} srcSet={cur.srcset} sizes="(min-width: 1024px) 50vw, 55vw" alt={cur.alt} width={cur.w} height={cur.h}
            loading="eager" fetchPriority={i === 0 ? "high" : undefined} className={`${imgCls} anim-fade`} />
          {sold && <span aria-hidden className="gone-stamp right-4 top-4 !w-20 !h-20 !text-[14px]">Gone</span>}
        </button>
      </div>

      {/* Phone: swipe strip, thumbnails underneath */}
      <div className="md:hidden -mx-[var(--spacing-gutter)]">
        <div className="relative">
          <div ref={strip} onScroll={onScroll} className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none]" aria-label="Photos, swipe for more">
            {shots.map((s, n) => (
              <div key={s.src} className="snap-center shrink-0 w-full relative aspect-[4/5] bg-white">
                <img src={s.src} srcSet={s.srcset} sizes="100vw" alt={s.alt} width={s.w} height={s.h}
                  loading={n === 0 ? "eager" : "lazy"} fetchPriority={n === 0 ? "high" : undefined} className={imgCls} />
              </div>
            ))}
          </div>
          {sold && <span aria-hidden className="gone-stamp right-4 top-4">Gone</span>}
          {shots.length > 1 && <p className="absolute right-4 bottom-4 ui text-[12px] bg-white/90 px-2 py-1 tabular-nums" aria-live="polite">{i + 1} / {shots.length}</p>}
        </div>
        {shots.length > 1 && <div className="mt-3">{thumbs(true)}</div>}
      </div>

      <dialog ref={dlg} onClose={() => setOpen(false)} onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}
        className="m-0 w-full h-full max-w-none max-h-none bg-white p-0 backdrop:bg-ink/60" aria-label="Photo viewer">
        {open && (
          <div className="relative w-full h-full flex items-center justify-center"
            onTouchStart={(e) => ((dlg.current as any)._x = e.touches[0].clientX)}
            onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - (dlg.current as any)._x; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }}>
            <img src={cur.full ?? cur.src} alt={cur.alt} className="max-w-full max-h-full object-contain" />
            <p className="absolute left-4 top-4 ui text-[13px]">{cur.label}{shots.length > 1 && ` · ${i + 1} / ${shots.length}`}</p>
            <button type="button" onClick={() => dlg.current?.close()} className="absolute right-2 top-2 ui min-h-12 px-4">Close</button>
            {shots.length > 1 && <>
              <button type="button" onClick={() => step(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center ui bg-white/80" aria-label="Previous photo">←</button>
              <button type="button" onClick={() => step(1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center ui bg-white/80" aria-label="Next photo">→</button>
            </>}
          </div>
        )}
      </dialog>
    </div>
  );
}

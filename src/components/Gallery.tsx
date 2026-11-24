import { useRef, useState } from "react";

const SHOTS = ["Front", "Back", "Detail", "Fabric", "Tag", "On body"];

// Nike-style gallery. Desktop: a two-column grid of every shot, scrolled past the sticky buy column.
// Mobile: a swipeable strip (CSS scroll-snap, no library) with a position counter.
export default function Gallery({ sold = false, num }: { sold?: boolean; num: string }) {
  const strip = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const onScroll = () => { const el = strip.current; if (el) setI(Math.round(el.scrollLeft / el.clientWidth)); };
  const shot = (s: string, n: number) => (
    <div key={s} className={`relative aspect-[4/5] ph-bf overflow-hidden ${sold ? "grayscale opacity-60" : ""}`}>
      <span className="absolute left-4 top-4 label-bf text-ink-soft">Photo · {s}</span>
      {n === 0 && <span aria-hidden className="absolute right-4 bottom-2 num-bf text-[96px] text-ink/10">{num}</span>}
    </div>
  );
  return (
    <div>
      <div className="hidden md:grid grid-cols-2 gap-2">{SHOTS.map(shot)}</div>
      <div className="md:hidden relative -mx-[var(--spacing-gutter)]">
        <div ref={strip} onScroll={onScroll} className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none]" aria-label="Photos, swipe for more">
          {SHOTS.map((s, n) => <div key={s} className="snap-center shrink-0 w-full">{shot(s, n)}</div>)}
        </div>
        <p className="absolute right-4 top-4 label-bf bg-bone/90 px-2 py-1 tabular-nums" aria-live="polite">{i + 1} / {SHOTS.length}</p>
      </div>
    </div>
  );
}

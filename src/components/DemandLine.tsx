import { useEffect, useState } from "react";
import RollNumber from "./RollNumber";
import { readList, toggleIn } from "../lib/store";

// The quiet demand line under the price on unsold Bruffles pieces: "In 3 bags · ♡ 21 saves".
// A calm fact, like a gallery's reserved dot: no badges, no red, no "hurry".
// Rules: "bags" hides at 0; the saves count hides under 3 (the heart stays, labelled "Save").
// Numbers come from getSignals() (src/data/demo-signals.ts) via props, so the live site can feed real ones.
const KEY = "ba-saves";

export default function DemandLine({ id, bags, saves }: { id: string; bags: number; saves: number }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const sync = () => setSaved(readList(KEY).includes(id));
    sync(); window.addEventListener(`store:${KEY}`, sync);
    return () => window.removeEventListener(`store:${KEY}`, sync);
  }, [id]);
  const count = saves + (saved ? 1 : 0);
  const showCount = count >= 3;
  return (
    <p className="demand flex items-center flex-wrap gap-x-2 min-h-8">
      {bags > 0 && <><span>In {bags} {bags === 1 ? "bag" : "bags"}</span><span aria-hidden>·</span></>}
      <button type="button" aria-pressed={saved} onClick={() => toggleIn(KEY, id, !saved)}
        className="group/save inline-flex items-center gap-1.5 min-h-8 -my-1 pr-1 cursor-pointer hover:text-ink focus-visible:outline-2">
        <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" className="heart" data-on={saved}>
          <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2.1 0 3.6 1.2 5.1 3 1.5-1.8 3-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"
            fill={saved ? "var(--color-gold)" : "none"} stroke={saved ? "var(--color-gold-deep)" : "currentColor"} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">{saved ? "Saved" : "Save"}</span>
        {showCount ? <span aria-hidden><RollNumber value={count} /> saves</span> : <span aria-hidden>{saved ? "Saved" : "Save"}</span>}
      </button>
    </p>
  );
}

// ADDON: missed-it waitlist. "Request it back" is the paid add-on from the proposal: a Gone piece
// collects requests, and the owners hunt for another one and message those people first.
// Demo: nothing is stored server-side. The visitor's own request is remembered on this device only
// (localStorage). The starting count comes from getSignals() in src/data/demo-signals.ts.
import { useEffect, useRef, useState } from "react";
import RollNumber from "./RollNumber";
import { readList, toggleIn } from "../lib/store";

const KEY = "ba-requests";

export default function RequestBack({ id, requests, size }: { id: string; requests: number; size?: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState(false);
  const [via, setVia] = useState<"whatsapp" | "email">("whatsapp");
  const first = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const sync = () => setDone(readList(KEY).includes(id));
    sync(); window.addEventListener(`store:${KEY}`, sync);
    return () => window.removeEventListener(`store:${KEY}`, sync);
  }, [id]);
  useEffect(() => { if (open) first.current?.focus(); }, [open]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(false), 4500); return () => clearTimeout(t); }, [toast]);

  const count = requests + (done ? 1 : 0);
  const fid = `rb-${id}`;
  const submit = (e: React.FormEvent) => { e.preventDefault(); toggleIn(KEY, id, true); setOpen(false); setToast(true); };

  return (
    <div className="rb">
      <div className="flex items-center gap-3 flex-wrap">
        <button type="button" disabled={done} aria-expanded={open} aria-controls={fid} onClick={() => setOpen((o) => !o)}
          className={`btn-bf-ghost label-bf !min-h-12 gap-2 ${done ? "!border-gold-deep !text-ink cursor-default hover:!bg-transparent" : ""}`}>
          {done && <svg aria-hidden width="14" height="14" viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7" fill="none" stroke="var(--color-gold-deep)" strokeWidth="2" /></svg>}
          {done ? "Requested" : "Request it back"}
        </button>
        <span className="demand"><RollNumber value={count} /> {count === 1 ? "request" : "requests"}</span>
      </div>
      <p className="mt-2 text-[13px] text-ink-soft">One of one. We'll hunt for another and message you first.</p>

      {open && !done && (
        <form id={fid} onSubmit={submit} className="mt-4 border border-hair p-4 space-y-3 bg-bone">
          <fieldset className="flex gap-6 label-bf">
            <legend className="sr-only">Message me by</legend>
            {(["whatsapp", "email"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 min-h-11 cursor-pointer">
                <input type="radio" name={`${fid}-via`} checked={via === v} onChange={() => setVia(v)} className="w-4 h-4 accent-[var(--color-ink)]" />
                {v === "email" ? "Email" : "WhatsApp"}
              </label>
            ))}
          </fieldset>
          <label className="block">
            <span className="sr-only">{via === "email" ? "Email address" : "WhatsApp number"}</span>
            <input ref={first} required type={via === "email" ? "email" : "tel"} autoComplete={via === "email" ? "email" : "tel"}
              placeholder={via === "email" ? "you@example.com" : "+1 868 000 0000"}
              className="w-full min-h-12 px-4 bg-transparent border border-ink placeholder:text-ink-soft focus:outline-none focus:ring-1 focus:ring-gold-deep" />
          </label>
          <label className="block">
            <span className="ui text-[12px] text-ink-soft">Size (optional)</span>
            <input type="text" defaultValue={size} maxLength={12} placeholder="M"
              className="mt-1 w-full min-h-12 px-4 bg-transparent border border-hair focus:border-ink focus:outline-none" />
          </label>
          <div className="flex gap-3">
            <button className="btn-bf label-bf flex-1">Send request</button>
            <button type="button" onClick={() => setOpen(false)} className="ui min-h-12 px-4 underline underline-offset-4 decoration-hair">Cancel</button>
          </div>
        </form>
      )}
      {toast && <div role="status" className="toast">We'll hunt for another one and message you first.</div>}
    </div>
  );
}

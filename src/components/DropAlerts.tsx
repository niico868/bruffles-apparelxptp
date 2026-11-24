import { useState } from "react";

// "Get the next drop first". Demo only: shows the success state, nothing is sent or stored.
export default function DropAlerts({ compact = false }: { compact?: boolean }) {
  const [via, setVia] = useState<"email" | "whatsapp">("email");
  const [done, setDone] = useState(false);
  const id = compact ? "da-footer" : "da-main";
  if (done) return (
    <div role="status" className={compact ? "py-2" : "py-6"}>
      <p className={compact ? "font-semibold" : "h-bf text-[32px]"}>You're on the list.</p>
      <p className="mt-2 text-ink-soft">We'll {via === "email" ? "email" : "WhatsApp"} you when the next drop lands. <span className="label-bf">(Demo: nothing was sent)</span></p>
    </div>
  );
  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="w-full">
      <fieldset className="flex gap-6 label-bf">
        <legend className="sr-only">Send alerts by</legend>
        {(["email", "whatsapp"] as const).map((v) => (
          <label key={v} className="flex items-center gap-2 min-h-12 cursor-pointer">
            <input type="radio" name={`${id}-via`} checked={via === v} onChange={() => setVia(v)} className="accent-[var(--color-ink)] w-4 h-4" />
            {v === "email" ? "Email" : "WhatsApp"}
          </label>
        ))}
      </fieldset>
      <div className="mt-2 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3">
        <label htmlFor={id} className="sr-only">{via === "email" ? "Email address" : "WhatsApp number"}</label>
        <input id={id} required type={via === "email" ? "email" : "tel"} autoComplete={via === "email" ? "email" : "tel"}
          placeholder={via === "email" ? "you@example.com" : "+1 868 000 0000"}
          className="flex-1 min-w-0 min-h-12 px-4 bg-transparent border border-ink placeholder:text-ink-soft focus:outline-none focus:border-gold-deep focus:ring-1 focus:ring-gold-deep" />
        <button className="btn-bf label-bf">Notify me</button>
      </div>
    </form>
  );
}

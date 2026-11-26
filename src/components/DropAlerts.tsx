import { useState } from "react";

// "Get the next drop first". Demo only: shows the success state, nothing is sent or stored.
// slim (Drop Log, round 5): WhatsApp first, then email, and the field and button sit on one row at
// the same height, on every screen.
export default function DropAlerts({ compact = false, dark = false, slim = false }: { compact?: boolean; dark?: boolean; slim?: boolean }) {
  const [via, setVia] = useState<"email" | "whatsapp">(slim ? "whatsapp" : "email");
  const [done, setDone] = useState(false);
  const id = compact ? "da-footer" : slim ? "da-drop" : "da-main";
  const order = slim ? (["whatsapp", "email"] as const) : (["email", "whatsapp"] as const);
  if (done) return (
    <div role="status" className={compact || slim ? "py-2" : "py-6"}>
      <p className={compact ? "font-semibold" : slim ? "h-bf text-[22px]" : "h-bf text-[32px]"}>You're on the list.</p>
      <p className={`mt-2 ${dark ? "opacity-75" : "text-ink-soft"}`}>We'll {via === "email" ? "email" : "WhatsApp"} you when the next drop lands. <span className="label-bf">(Demo: nothing was sent)</span></p>
    </div>
  );
  return (
    <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="w-full">
      <fieldset className={`flex label-bf ${slim ? "gap-5" : "gap-6"}`}>
        <legend className="sr-only">Send alerts by</legend>
        {order.map((v) => (
          <label key={v} className={`flex items-center gap-2 cursor-pointer ${slim ? "min-h-10" : "min-h-12"}`}>
            <input type="radio" name={`${id}-via`} checked={via === v} onChange={() => setVia(v)} className={`w-4 h-4 ${dark ? "accent-[var(--color-gold)]" : "accent-[var(--color-ink)]"}`} />
            {v === "email" ? "Email" : "WhatsApp"}
          </label>
        ))}
      </fieldset>
      <div className={slim ? "mt-1 flex items-stretch" : "mt-2 flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3"}>
        <label htmlFor={id} className="sr-only">{via === "email" ? "Email address" : "WhatsApp number"}</label>
        <input id={id} required type={via === "email" ? "email" : "tel"} autoComplete={via === "email" ? "email" : "tel"}
          placeholder={via === "email" ? "you@example.com" : "+1 868 000 0000"}
          className={`flex-1 min-w-0 min-h-12 px-4 border ${slim ? "bg-white/10 backdrop-blur-sm border-r-0" : "bg-transparent"} focus:outline-none focus:ring-1 ${dark ? "border-current/50 placeholder:opacity-60 focus:border-gold focus:ring-gold" : "border-ink placeholder:text-ink-soft focus:border-gold-deep focus:ring-gold-deep"}`} />
        <button className={`${dark ? "btn-bf label-bf !bg-bone !text-ink hover:!bg-gold" : "btn-bf label-bf"} ${slim ? "shrink-0 !px-5" : ""}`}>Notify me</button>
      </div>
    </form>
  );
}

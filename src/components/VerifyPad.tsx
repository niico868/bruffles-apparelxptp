// Demo "sign for your piece" (the page the QR card in the package opens). Nothing is saved or sent:
// the signature, the photo and the consent stay in this browser tab and vanish on reload.
// Signature: signature_pad (finger, stylus or mouse) exported as SVG. touch-action: none on the canvas
// so a finger draws instead of scrolling the page.
import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";

type Props = { id: string; maker: string; name: string; photo?: { src: string; alt: string } };

export default function VerifyPad({ id, maker, name, photo }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pad = useRef<SignaturePad | null>(null);
  const done = useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = useState(true);
  const [fit, setFit] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [area, setArea] = useState("");
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    // Runs again when "Sign again" brings the canvas back; the signed card has no canvas.
    const c = canvas.current;
    if (!c) return;
    const p = new SignaturePad(c, { penColor: "#1C1A17", minWidth: 0.9, maxWidth: 2.6, velocityFilterWeight: 0.6 });
    pad.current = p;
    p.addEventListener("endStroke", () => { setEmpty(p.isEmpty()); setErr(""); });
    // Match the canvas to its on-screen size and the screen's pixel density, keeping what's drawn.
    const fitCanvas = () => {
      const data = p.toData(), ratio = Math.max(window.devicePixelRatio || 1, 1);
      c.width = c.offsetWidth * ratio; c.height = c.offsetHeight * ratio;
      c.getContext("2d")!.scale(ratio, ratio); p.clear(); p.fromData(data);
    };
    fitCanvas(); window.addEventListener("resize", fitCanvas);
    return () => { window.removeEventListener("resize", fitCanvas); p.off(); };
  }, [svg]);

  const clear = () => { pad.current?.clear(); setEmpty(true); };
  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (fit) URL.revokeObjectURL(fit);
    setFit(f ? URL.createObjectURL(f) : null);
  };
  const sign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pad.current || pad.current.isEmpty()) { setErr("Sign in the box first."); return; }
    setSvg(pad.current.toSVG());
    // Bring the new card into view: on a phone the form is taller than the card that replaces it.
    requestAnimationFrame(() => done.current?.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
  };

  if (svg) {
    const showFit = !!fit && consent;
    const meta = `${id} · ${maker}${area.trim() ? ` · ${area.trim()}` : ""}`;
    return (
      <div ref={done} className="text-center" role="status">
        <p className="label-bf text-gold-text">Signed. Customer Verified.</p>
        <div className="mt-8 mx-auto w-[260px] bg-white text-ink shadow-[0_1px_2px_rgb(28_26_23/.08)] -rotate-1 text-left">
          {showFit ? (
            <div className="p-2 pb-0">
              <div className="relative aspect-square overflow-hidden">
                <img src={fit!} alt={`Your fit pic with ${name}`} className="absolute inset-0 w-full h-full object-cover" />
                <img src="/brand/bruffles-monogram-gold.webp" alt="" aria-hidden width="28" height="28" className="absolute right-1 top-1 w-7 h-7 -rotate-[8deg]" />
              </div>
              <div className="px-1 py-2">
                <div className="h-12 [&_svg]:h-full [&_svg]:w-auto" dangerouslySetInnerHTML={{ __html: svg }} />
                <p className="wall-meta-r">{meta}</p>
              </div>
            </div>
          ) : (
            <div className="p-4 flex flex-col items-center text-center">
              <span aria-hidden className="block w-2 h-2 rounded-full bg-bone ring-1 ring-hair" />
              <img src="/brand/bruffles-monogram-gold-deep.webp" alt="" aria-hidden width="28" height="28" className="mt-3 w-7 h-7 -rotate-[8deg]" />
              <div className="mt-3 h-14 [&_svg]:h-full [&_svg]:w-auto" dangerouslySetInnerHTML={{ __html: svg }} />
              <p className="wall-meta-r mt-2 w-full border-t border-hair pt-2">{meta}</p>
            </div>
          )}
        </div>
        <p className="mt-8 text-ink-soft max-w-[40ch] mx-auto">{showFit ? "Your card would go up on the wall." : fit && !consent ? "Your card would be kept private: you didn't tick \"Show my fit on the wall\"." : "Your card would go up on the wall as a hang-tag."} Demo: nothing was saved.</p>
        <button type="button" onClick={() => { setSvg(null); setEmpty(true); }} className="ui mt-6 underline underline-offset-4 decoration-hair hover:decoration-ink min-h-12">Sign again</button>
      </div>
    );
  }

  return (
    <form onSubmit={sign} className="space-y-8">
      <div>
        <div className="flex items-end justify-between">
          <label htmlFor="sig-pad" className="label-bf">Your signature</label>
          <button type="button" onClick={clear} disabled={empty} className="ui text-[13px] min-h-11 px-2 underline underline-offset-4 decoration-hair disabled:opacity-40">Clear</button>
        </div>
        <canvas id="sig-pad" ref={canvas} role="img" aria-label="Signature box. Draw your signature with a finger, stylus or mouse."
          className="mt-2 block w-full h-48 bg-white border border-ink cursor-crosshair" style={{ touchAction: "none" }} />
        <p className="mt-2 text-[13px] text-ink-soft">{err || "Sign with your finger on a phone, or your mouse on a computer."}</p>
      </div>

      <label className="block">
        <span className="label-bf">Your area <span className="text-ink-soft normal-case tracking-normal font-normal">(shown on the card instead of your name)</span></span>
        <input value={area} onChange={(e) => setArea(e.target.value)} maxLength={24} placeholder="Arima"
          className="mt-2 w-full min-h-12 px-4 bg-transparent border border-hair focus:border-ink focus:outline-none" />
      </label>

      <div>
        <label className="label-bf block" htmlFor="fit">Add a fit pic <span className="text-ink-soft normal-case tracking-normal font-normal">(optional, preview only)</span></label>
        <input id="fit" type="file" accept="image/*" onChange={onPhoto} className="mt-2 block w-full text-[14px] file:mr-4 file:min-h-12 file:px-4 file:border file:border-ink file:bg-transparent file:ui file:cursor-pointer" />
        {fit && <img src={fit} alt="Preview of your fit pic" className="mt-3 w-32 h-32 object-cover" />}
      </div>

      <label className="flex items-start gap-3 cursor-pointer min-h-12">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 w-5 h-5 accent-[var(--color-ink)]" />
        <span>Show my fit on the wall</span>
      </label>

      <button className="btn-bf label-bf w-full">Sign</button>
    </form>
  );
}

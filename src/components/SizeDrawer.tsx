import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SizeDrawer({ size, measurements }: { size: string; measurements: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc); return () => window.removeEventListener("keydown", esc);
  }, []);
  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full min-h-12 flex items-center justify-between border-y border-hair label-bf hover:text-gold-text transition-colors">Size & measurements <span aria-hidden>+</span></button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-ink/40" onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
            <motion.aside role="dialog" aria-modal="true" aria-label="Size chart"
              className="fixed z-50 bg-bone bottom-0 inset-x-0 md:inset-y-0 md:left-auto md:w-[420px] p-8 max-h-[80svh] md:max-h-none overflow-auto"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex justify-between items-baseline">
                <h2 className="h-bf text-[32px]">Measurements</h2>
                <button onClick={() => setOpen(false)} className="label-bf min-h-12 px-2">Close</button>
              </div>
              <p className="label-bf text-ink-soft mt-2">Tagged size {size}</p>
              <dl className="mt-6 divide-y divide-hair">
                {Object.entries(measurements).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-4"><dt className="text-ink-soft">{k}</dt><dd className="tabular-nums">{v}</dd></div>
                ))}
              </dl>
              <p className="text-ink-soft mt-6 leading-relaxed">One piece, one size. If it fits, it is yours.</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

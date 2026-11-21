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
      <button onClick={() => setOpen(true)} className="label-bsa underline underline-offset-4 decoration-line hover:decoration-ink min-h-11">Size & measurements</button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-ink/30" onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
            <motion.aside role="dialog" aria-modal="true" aria-label="Size chart"
              className="fixed z-50 bg-paper bottom-0 inset-x-0 md:inset-y-0 md:left-auto md:w-[420px] p-8 max-h-[80svh] md:max-h-none overflow-auto"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex justify-between items-baseline">
                <h2 className="h-bsa text-2xl">Measurements</h2>
                <button onClick={() => setOpen(false)} className="label-bsa min-h-11">Close</button>
              </div>
              <p className="label-bsa text-ink-soft mt-2">Tagged size {size} · measured flat, by hand</p>
              <dl className="mt-6 divide-y divide-line">
                {Object.entries(measurements).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3 text-sm"><dt className="text-ink-soft">{k}</dt><dd className="tabular-nums">{v}</dd></div>
                ))}
              </dl>
              <p className="text-sm text-ink-soft mt-6 leading-relaxed">One size only. Each piece is one of one, so if it fits, it's yours.</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

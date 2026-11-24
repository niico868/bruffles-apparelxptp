import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// "Ask about this piece". Demo only: opens a short form and shows a success state.
export default function AskPiece({ num }: { num: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="btn-bf-ghost w-full label-bf">Ask about this piece</button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 border border-hair p-4">
            {sent ? <p role="status">Thanks. We'll reply about piece {num} soon. <span className="label-bf text-ink-soft">(Demo: nothing was sent)</span></p> : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3">
                <label className="block"><span className="label-bf text-ink-soft">Your question about piece {num}</span>
                  <textarea required rows={3} className="mt-2 w-full p-3 bg-transparent border border-ink focus:outline-none focus:border-gold-deep" placeholder="Fit, condition, more photos..." /></label>
                <label className="block"><span className="label-bf text-ink-soft">Email or WhatsApp</span>
                  <input required className="mt-2 w-full min-h-12 px-3 bg-transparent border border-ink focus:outline-none focus:border-gold-deep" /></label>
                <button className="btn-bf w-full label-bf">Send question</button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Stamp } from "./PassportCard";

// Sits over the Passport product photo and shows the stamp whenever "Add to bag" fires.
export default function StampTarget() {
  const [n, setN] = useState(0);
  useEffect(() => { const on = () => setN((x) => x + 1); window.addEventListener("pp:stamp", on); return () => window.removeEventListener("pp:stamp", on); }, []);
  return <AnimatePresence>{n > 0 && <Stamp key={n} />}</AnimatePresence>;
}

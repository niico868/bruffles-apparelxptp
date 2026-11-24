import { useEffect, useRef } from "react";
import { Stamp, slam } from "./PassportCard";

// Sits over the Passport product photo and replays the stamp whenever "Add to bag" fires.
export default function StampTarget() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const on = () => slam(ref.current); window.addEventListener("pp:stamp", on); return () => window.removeEventListener("pp:stamp", on); }, []);
  return <Stamp ref={ref} />;
}

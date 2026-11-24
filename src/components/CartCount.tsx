import { useEffect, useState } from "react";
import { cartCount } from "../lib/cart";

export default function CartCount() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const sync = () => setN(cartCount());
    sync();
    window.addEventListener("cart:change", sync);
    return () => window.removeEventListener("cart:change", sync);
  }, []);
  return <a href="/bag" aria-live="polite">Bag ({n})</a>;
}

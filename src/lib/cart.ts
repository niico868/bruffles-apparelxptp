// Tiny client cart for the demo. Phase 2 swaps this for a server cart + payment adapter.
export type CartLine = { id: string; name: string; priceUsd: number; qty: number };
const KEY = "bsa-cart";

export function readCart(): CartLine[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export function addToCart(line: Omit<CartLine, "qty">, qty = 1) {
  const cart = readCart();
  const hit = cart.find((l) => l.id === line.id);
  hit ? (hit.qty += qty) : cart.push({ ...line, qty });
  try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {}
  window.dispatchEvent(new CustomEvent("cart:change"));
}
export const cartCount = () => readCart().reduce((n, l) => n + l.qty, 0);

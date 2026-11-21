// Prices are stored in USD cents. TTD rate is a placeholder until the owners confirm one.
export type Currency = "USD" | "TTD";
export const TTD_PER_USD = 6.78;

export function formatPrice(usdCents: number, currency: Currency = "USD") {
  const amount = currency === "USD" ? usdCents / 100 : (usdCents / 100) * TTD_PER_USD;
  const n = new Intl.NumberFormat("en-TT", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  return currency === "TTD" ? n.replace(/^[^\d]+/, "TT$") : n;
}

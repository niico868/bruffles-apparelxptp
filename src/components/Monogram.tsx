// The client's gold monogram (cut from their store artwork). Letters await client confirmation,
// so the alt text names the brand rather than spelling the letters.
// tone "bright" for dark grounds, "deep" for the bone ground (passes 3:1 as a graphic).
export default function Monogram({ size = 88, tone = "bright", disc = false, className = "" }:
  { size?: number; tone?: "bright" | "deep"; disc?: boolean; className?: string }) {
  const src = tone === "deep" ? "/brand/bruffles-monogram-gold-deep.webp" : "/brand/bruffles-monogram-gold.webp";
  const img = <img src={src} width={disc ? Math.round(size * 0.72) : size} height={disc ? Math.round(size * 0.72) : size}
    alt="Bruffles Apparel monogram" decoding="async" className={disc ? "" : className} />;
  if (!disc) return img;
  return (
    <span className={`grid place-items-center rounded-full bg-ink ring-1 ring-gold/60 ${className}`} style={{ width: size, height: size }}>
      {img}
    </span>
  );
}

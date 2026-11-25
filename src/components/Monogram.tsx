// The client's gold monogram (cut from their store artwork). Letters await client confirmation,
// so the alt text names the brand rather than spelling the letters.
// tone "bright" for dark grounds and photos, "deep" for the bone ground (passes 3:1 as a graphic).
// Used as the Bruffles corner logo in the homepage hero (SplitHero).
export default function Monogram({ size = 88, tone = "bright", className = "", style }:
  { size?: number; tone?: "bright" | "deep"; className?: string; style?: React.CSSProperties }) {
  const src = tone === "deep" ? "/brand/bruffles-monogram-gold-deep.webp" : "/brand/bruffles-monogram-gold.webp";
  return <img src={src} width={size} height={size} alt="Bruffles Apparel monogram" decoding="async" className={className} style={style} />;
}

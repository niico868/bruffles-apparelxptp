// Gold circular BSA monogram. Placeholder mark until the client's real one arrives.
export default function Monogram({ size = 88 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Brussels Apparel monogram">
      <circle cx="50" cy="50" r="48" fill="var(--color-gold)" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#f4f0e8" strokeOpacity=".55" strokeWidth=".75" />
      <text x="50" y="58" textAnchor="middle" fontFamily="Fraunces Variable, serif" fontSize="24" fontWeight="500" letterSpacing="2" fill="#1c1b19">BSA</text>
    </svg>
  );
}

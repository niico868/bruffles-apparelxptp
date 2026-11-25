// A number that rolls up into place when it changes: 300ms, ease-out, no bounce.
// Reduced motion: global.css cuts the animation to nothing, so the number simply swaps.
export default function RollNumber({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden align-bottom tabular-nums ${className}`}>
      <span key={value} className="num-roll">{value}</span>
    </span>
  );
}

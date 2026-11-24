// Split-flap departure board: each character drops in on its own tile, once, on first view.
// Pure CSS keyframes (rotateX + opacity) started by one shared observer in Base.astro, so a board
// full of characters costs no JavaScript per character. Works without hydration.
export default function FlipPrice({ text, className = "", tiles = false }: { text: string; className?: string; tiles?: boolean }) {
  return (
    <span data-flip className={`flip inline-flex font-mono tabular-nums ${tiles ? "gap-[2px]" : ""} ${className}`} aria-label={text} role="text">
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden className={`flip-c inline-block ${tiles ? "bg-char px-[3px] min-w-[0.9em] text-center" : ""}`}
          style={{ animationDelay: `${i * 45}ms` }}>{c === " " ? " " : c}</span>
      ))}
    </span>
  );
}

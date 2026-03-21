/** Match `.material-symbols-outlined` in globals.css; partial `FILL` overrides can drop other axes. */
const SYMBOL_VAR_OUTLINE = '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24';
const SYMBOL_VAR_FILLED = '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24';

export function Icon({
  name,
  filled = false,
  className = "",
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: filled ? SYMBOL_VAR_FILLED : SYMBOL_VAR_OUTLINE }}
    >
      {name}
    </span>
  );
}

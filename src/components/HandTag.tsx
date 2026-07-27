const COLORS = {
  terracotta: "#b1482a",
  sage: "#5f7a56",
  ochre: "#8a6a2a",
} as const;

/**
 * Replaces the tracked-uppercase-sans "eyebrow" pattern with a small
 * handwritten note — the human voice instead of a corporate label.
 * Color + rotation vary per instance so repeated tags don't read as one stamp.
 */
export default function HandTag({
  children,
  color = "terracotta",
  rotate = -2,
  className = "",
}: {
  children: React.ReactNode;
  color?: keyof typeof COLORS;
  rotate?: number;
  className?: string;
}) {
  return (
    <p
      className={`font-hand inline-block text-2xl ${className}`}
      style={{ color: COLORS[color], transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </p>
  );
}

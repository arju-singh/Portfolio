// "AS" monogram — Arju Singh. Matches the site language: a panel-style rounded
// badge (dark fill, hairline border like the cards) with a monoline letterform
// in the lime accent. Themeable via the `accent` prop; scales to any size.
export default function Logo({ size = 40, accent = 'var(--accent)', withWord = false, className }) {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Arju Singh logo"
    >
      <rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="28"
        fill="#0d0d12"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="2"
      />
      <g fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 84 L45 38 L60 84" />
        <path d="M35 67 L55 67" />
        <path d="M88 48 C88 41 81 39 75 39 C67 39 63 44 63 50 C63 57 71 59 76 61 C83 64 89 66 89 72 C89 80 82 83 75 83 C69 83 65 80 63 76" />
      </g>
    </svg>
  );

  if (!withWord) return <span className={className}>{mark}</span>;

  return (
    <span className={`logo ${className || ''}`}>
      {mark}
      <span className="logo__word">
        Arju<span className="logo__word-accent">Singh</span>
      </span>
    </span>
  );
}

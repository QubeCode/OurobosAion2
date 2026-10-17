export function OuroborosRing({
  className = "",
  size = 280,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`anim-ouroboros ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="serpentStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5ee7df" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#d4a84b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#5ee7df" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5ee7df" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#0a1628" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="70" fill="url(#coreGlow)" className="anim-pulse-glow" />
      <circle
        cx="100"
        cy="100"
        r="62"
        fill="none"
        stroke="url(#serpentStroke)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="160 28"
      />
      <circle
        cx="100"
        cy="100"
        r="48"
        fill="none"
        stroke="rgba(212,168,75,0.35)"
        strokeWidth="1"
        strokeDasharray="4 8"
      />
      {/* Stylized head / mouth meeting point */}
      <ellipse
        cx="100"
        cy="38"
        rx="7"
        ry="5"
        fill="#d4a84b"
        opacity="0.95"
      />
      <circle cx="100" cy="38" r="2.2" fill="#050b16" />
    </svg>
  );
}

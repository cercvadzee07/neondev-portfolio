type Props = { size?: number; className?: string; title?: string };

/** NEONDEV badge: gradient-bordered rounded square, gradient "N" and a green online dot. */
export default function LogoMark({ size = 36, className, title = "NEONDEV" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id="nd-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dcfff" />
          <stop offset="50%" stopColor="#a9b1ff" />
          <stop offset="100%" stopColor="#bb9af7" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="16" fill="#10131e" stroke="url(#nd-g)" strokeWidth="3.5" />
      <path d="M20 46V18h5.2l13.4 19.2V18H44v28h-5.2L25.4 26.8V46z" fill="url(#nd-g)" />
      <circle cx="49" cy="15" r="3.6" fill="#9ece6a" />
    </svg>
  );
}

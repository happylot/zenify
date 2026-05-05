type ZenifyLogoProps = {
  size?: number;
  className?: string;
};

export function ZenifyLogo({ size = 40, className }: ZenifyLogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="zenifyLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
        <linearGradient id="zenifyLogoAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#00f2fe" />
        </linearGradient>
      </defs>
      <path
        d="M8 8 L32 8 L32 12 L16 12 L32 28 L32 32 L8 32 L8 28 L24 28 L8 12 Z"
        fill="url(#zenifyLogoGradient)"
      />
      <circle cx="12" cy="16" r="2" fill="url(#zenifyLogoAccent)" opacity="0.8" />
      <circle cx="20" cy="12" r="1.5" fill="url(#zenifyLogoAccent)" opacity="0.6" />
      <circle cx="28" cy="20" r="2" fill="url(#zenifyLogoAccent)" opacity="0.8" />
      <circle cx="20" cy="24" r="1.5" fill="url(#zenifyLogoAccent)" opacity="0.6" />
      <line x1="12" y1="16" x2="20" y2="12" stroke="url(#zenifyLogoAccent)" strokeWidth="1" opacity="0.4" />
      <line x1="20" y1="12" x2="28" y2="20" stroke="url(#zenifyLogoAccent)" strokeWidth="1" opacity="0.4" />
      <line x1="28" y1="20" x2="20" y2="24" stroke="url(#zenifyLogoAccent)" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}
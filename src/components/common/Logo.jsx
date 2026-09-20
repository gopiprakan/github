import React from 'react';

export function LogoIcon({ size = 28, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-md flex items-center justify-center bg-gh-darkPanel border border-emerald-500/30 shadow-sm overflow-hidden group-hover:border-emerald-500/60 transition-all duration-200 shrink-0 ${className}`}
    >
      {/* Subtle glowing backdrop gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-emerald-500/10 pointer-events-none" />
      
      {/* Professional Git Commit Streak Vector */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1.5"
      >
        <defs>
          <linearGradient id="logoEmeraldGrad" x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="glowLine" x1="8" y1="24" x2="24" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer subtle grid guide / frame */}
        <rect
          x="3"
          y="3"
          width="26"
          height="26"
          rx="4"
          stroke="#30363d"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.4"
        />

        {/* Git Branch / Connecting Velocity Track */}
        <path
          d="M8 24L16 16M16 16L24 8"
          stroke="url(#glowLine)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Curved branch offshoot */}
        <path
          d="M8 14C8 17.5 11 20 15 20H23"
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Node 1: Origin commit */}
        <circle cx="8" cy="24" r="3.2" fill="#0d1117" stroke="#22c55e" strokeWidth="2" />
        <circle cx="8" cy="24" r="1.2" fill="#4ade80" />

        {/* Node 2: Merge / Active commit */}
        <circle cx="16" cy="16" r="3.2" fill="#0d1117" stroke="#22c55e" strokeWidth="2" />
        <circle cx="16" cy="16" r="1.2" fill="#4ade80" />

        {/* Node 3: Apex / Velocity Arrow Streak */}
        <path
          d="M19 8H24V13"
          stroke="url(#logoEmeraldGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="8" r="2.2" fill="#34d399" />
      </svg>
    </div>
  );
}

export default function Logo({ size = 'md', showSubtitle = true, className = '' }) {
  const isSmall = size === 'sm';
  const iconSize = isSmall ? 26 : 30;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={iconSize} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1 leading-none">
          <span className="font-bold text-sm tracking-tight text-gh-lightText dark:text-gh-darkText font-sans">
            Commit<span className="text-emerald-500 font-extrabold">Streak</span>
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
        </div>
        {showSubtitle && (
          <span className="text-[9px] font-mono uppercase tracking-wider text-gh-lightMuted dark:text-gh-darkMuted mt-0.5">
            Dev Activity Engine
          </span>
        )}
      </div>
    </div>
  );
}

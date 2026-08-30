"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

// A stylised petri dish with colonies "growing" in on load — the one bold
// visual moment on the page, tied directly to microbiology rather than a
// generic abstract blob or gradient orb.

interface Colony {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  delay: number;
}

function useColonies(): Colony[] {
  return useMemo(() => {
    const palette = ["#3E7C6B", "#C97A3D", "#28564A", "#E0AD79"];
    const seeded: Colony[] = [
      { cx: 190, cy: 150, r: 34, fill: palette[0], delay: 0 },
      { cx: 290, cy: 110, r: 16, fill: palette[1], delay: 0.15 },
      { cx: 330, cy: 220, r: 24, fill: palette[2], delay: 0.3 },
      { cx: 230, cy: 260, r: 12, fill: palette[1], delay: 0.45 },
      { cx: 130, cy: 240, r: 18, fill: palette[3], delay: 0.6 },
      { cx: 260, cy: 190, r: 8, fill: palette[0], delay: 0.75 },
      { cx: 150, cy: 320, r: 10, fill: palette[2], delay: 0.9 },
      { cx: 340, cy: 310, r: 14, fill: palette[3], delay: 1.05 },
      { cx: 90, cy: 170, r: 9, fill: palette[1], delay: 1.2 },
      { cx: 300, cy: 330, r: 7, fill: palette[0], delay: 1.3 },
    ];
    return seeded;
  }, []);
}

export default function PetriHero() {
  const colonies = useColonies();
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      <svg viewBox="0 0 420 420" className="h-full w-full" role="img" aria-label="Illustration of a petri dish with growing bacterial colonies">
        <defs>
          <radialGradient id="dishGlass" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="55%" stopColor="#F3F6F4" />
            <stop offset="100%" stopColor="#E4EAE7" />
          </radialGradient>
          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#0F2E2B" floodOpacity="0.16" />
          </filter>
        </defs>

        {/* dish rim */}
        <circle cx="210" cy="210" r="196" fill="url(#dishGlass)" filter="url(#softShadow)" />
        <circle cx="210" cy="210" r="196" fill="none" stroke="#0F2E2B" strokeOpacity="0.08" strokeWidth="2" />
        <circle cx="210" cy="210" r="170" fill="none" stroke="#0F2E2B" strokeOpacity="0.06" strokeWidth="1" />

        {/* faint agar grid, like a counting grid under the dish */}
        <g stroke="#0F2E2B" strokeOpacity="0.05">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h${i}`} x1="30" x2="390" y1={30 + i * 42} y2={30 + i * 42} />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} y1="30" y2="390" x1={30 + i * 42} x2={30 + i * 42} />
          ))}
        </g>

        {/* colonies */}
        {colonies.map((c, i) => (
          <motion.circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            fill={c.fill}
            fillOpacity={0.82}
            initial={{ scale: prefersReduced ? 1 : 0, opacity: prefersReduced ? 0.82 : 0 }}
            animate={{ scale: 1, opacity: 0.82 }}
            transition={{ duration: 0.9, delay: prefersReduced ? 0 : 0.4 + c.delay, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
          />
        ))}
        {colonies.map((c, i) => (
          <motion.circle
            key={`ring-${i}`}
            cx={c.cx}
            cy={c.cy}
            r={c.r + 6}
            fill="none"
            stroke={c.fill}
            strokeOpacity="0.35"
            initial={{ scale: prefersReduced ? 1 : 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.35 }}
            transition={{ duration: 1, delay: prefersReduced ? 0 : 0.5 + c.delay, ease: "easeOut" }}
            style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
          />
        ))}

        {/* rim highlight */}
        <ellipse cx="150" cy="90" rx="90" ry="34" fill="#FFFFFF" fillOpacity="0.35" />
      </svg>

      <div className="field-label absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1 shadow-sm">
        Sample culture — 24h growth
      </div>
    </div>
  );
}

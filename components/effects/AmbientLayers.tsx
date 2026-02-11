"use client";

import { motion } from "framer-motion";

type AmbientLayersProps = {
  showDragon?: boolean;
  showPortal?: boolean;
  showOcean?: boolean;
};

const particles = Array.from({ length: 16 }).map((_, i) => ({
  id: i,
  left: `${(i * 17) % 100}%`,
  delay: `${(i * 0.55) % 6}s`,
  duration: `${8 + (i % 6)}s`,
  size: `${2 + (i % 3)}px`
}));

const stars = Array.from({ length: 28 }).map((_, i) => ({
  id: i,
  top: `${(i * 11) % 100}%`,
  left: `${(i * 23) % 100}%`,
  delay: `${(i * 0.2) % 3}s`
}));

export function AmbientLayers({ showDragon, showPortal, showOcean }: AmbientLayersProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,181,94,0.15),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(136,183,255,0.12),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(201,167,115,0.05)_0%,transparent_20%,transparent_78%,rgba(201,167,115,0.08)_100%)]" />
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-amber-100/35 animate-dust"
            style={{ left: p.left, bottom: "-2rem", animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size }}
          />
        ))}
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute h-[2px] w-[2px] rounded-full bg-slate-100/70 animate-twinkle"
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,140,60,0.12),transparent_60%)] mix-blend-screen animate-flicker" />

      {showDragon ? (
        <motion.div
          className="pointer-events-none absolute inset-y-0 -left-20 h-24 w-64 rotate-3 bg-[radial-gradient(closest-side,rgba(0,0,0,0.45),rgba(0,0,0,0)_70%)] blur-sm animate-dragonSweep"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      ) : null}

      {showPortal ? (
        <motion.div
          className="pointer-events-none absolute right-[8%] top-[15%] h-44 w-44 rounded-full border border-cyan-200/25 bg-[radial-gradient(circle,rgba(88,244,255,0.28),rgba(22,31,52,0.03)_60%)] blur-[1px] animate-portalPulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      ) : null}

      {showOcean ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(71,160,255,0.2),rgba(12,30,52,0)_70%)]" />
      ) : null}
    </>
  );
}


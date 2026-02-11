"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Chapter } from "@/content/book";
import { SigilSet } from "@/components/icons/SigilIcons";
import { ParticleMode } from "@/lib/chapter-meta";
import { getWorldModules } from "@/lib/world-engine";

type CinematicBackgroundProps = {
  scrollProgress: number;
  particleMode: ParticleMode;
  chapter?: Chapter;
};

const stars = Array.from({ length: 56 }).map((_, i) => ({
  id: i,
  top: `${(i * 13) % 100}%`,
  left: `${(i * 17) % 100}%`,
  delay: `${(i * 0.21) % 4}s`
}));

const particles = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  left: `${(i * 19) % 100}%`,
  duration: `${6 + (i % 8)}s`,
  delay: `${(i * 0.37) % 4}s`,
  size: `${2 + (i % 3)}px`
}));

const particleClass: Record<ParticleMode, string> = {
  dust: "bg-amber-100/35 animate-dust",
  embers: "bg-orange-300/55 animate-dust",
  snow: "bg-slate-100/60 animate-floatDown"
};

export function CinematicBackground({ scrollProgress, particleMode, chapter }: CinematicBackgroundProps) {
  const y1 = useMemo(() => `${scrollProgress * -36}px`, [scrollProgress]);
  const y2 = useMemo(() => `${scrollProgress * -72}px`, [scrollProgress]);
  const modules = chapter ? getWorldModules(chapter) : [];

  return (
    <>
      <motion.div className="pointer-events-none fixed inset-0 z-0" style={{ y: y1 }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,165,102,0.25),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(120,180,255,0.2),transparent_38%),linear-gradient(180deg,#1b151d_0%,#151117_65%,#0e0c11_100%)]" />
        <div className="absolute inset-0 opacity-35 blur-[2px] bg-[repeating-linear-gradient(90deg,rgba(93,68,43,0.22)_0_4%,rgba(37,28,20,0.22)_4.1%_7%)]" />
        {modules.includes("psy") ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(255,168,117,0.11)_0_48%,rgba(113,176,255,0.15)_52%_100%)]" />
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,rgba(103,181,255,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(103,181,255,0.1)_1px,transparent_1px)] [background-size:42px_42px]" />
          </>
        ) : null}
        {modules.includes("guild") ? (
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-[linear-gradient(180deg,transparent,rgba(20,20,30,0.42)),repeating-linear-gradient(90deg,rgba(36,36,48,0.45)_0_14px,rgba(14,14,18,0.5)_14px_24px)] opacity-45" />
        ) : null}
      </motion.div>

      <motion.div className="pointer-events-none fixed inset-0 z-[1]" style={{ y: y2 }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(124,166,255,0.18),transparent_38%),radial-gradient(circle_at_83%_42%,rgba(166,236,255,0.12),transparent_42%)]" />
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute h-[2px] w-[2px] rounded-full bg-slate-100/75 animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              opacity: `${0.25 + ((scrollProgress * (star.id % 9 + 1)) % 0.45)}`
            }}
          />
        ))}
        {modules.includes("legacy") ? (
          <>
            <SigilSet.GlyphSigil className="absolute left-[16%] top-[22%] h-24 w-24 text-cyan-100/10 animate-glyphRotate" />
            <SigilSet.GlyphSigil className="absolute right-[10%] top-[58%] h-16 w-16 text-cyan-100/10 animate-glyphRotate [animation-direction:reverse]" />
          </>
        ) : null}
      </motion.div>

      <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
        {particles.map((particle) => (
          <span
            key={`${particleMode}-${particle.id}`}
            className={`absolute rounded-full ${particleClass[particleMode]}`}
            style={{
              left: particle.left,
              ...(particleMode === "snow" ? { top: "-3rem" } : { bottom: "-3rem" }),
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              width: particle.size,
              height: particle.size
            }}
          />
        ))}
        {modules.includes("guild")
          ? Array.from({ length: 12 }).map((_, i) => (
              <span
                key={`feather-${i}`}
                className="absolute left-[-2rem] top-[20%] h-[2px] w-6 rotate-12 bg-slate-100/40 animate-featherDrift"
                style={{ top: `${16 + i * 6}%`, animationDelay: `${i * 0.2}s` }}
              />
            ))
          : null}
      </div>

      {modules.includes("fae") ? <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(circle_at_70%_30%,rgba(121,255,214,0.16),transparent_28%),radial-gradient(circle_at_20%_75%,rgba(123,177,255,0.14),transparent_30%)] animate-realmShift" /> : null}

      <div className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.5)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-[2] animate-flicker bg-[radial-gradient(circle_at_50%_90%,rgba(255,144,61,0.12),transparent_40%)]" />
    </>
  );
}


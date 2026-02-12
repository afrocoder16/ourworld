"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type RedactionRevealProps = {
  text: string;
  className?: string;
  onReveal?: () => void;
};

export function RedactionReveal({ text, className, onReveal }: RedactionRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [peeling, setPeeling] = useState(false);

  const onTap = () => {
    if (revealed) {
      setRevealed(false);
      return;
    }
    setPeeling(true);
    onReveal?.();
    window.setTimeout(() => {
      setPeeling(false);
      setRevealed(true);
    }, 420);
  };

  return (
    <button
      type="button"
      onClick={onTap}
      className={cn("group relative w-full overflow-hidden rounded-md border border-red-500/35 bg-black/30 px-3 py-2 text-left text-sm text-red-100/85", className)}
      aria-expanded={revealed}
    >
      <div className="mb-1 text-[10px] uppercase tracking-[0.25em] text-red-200/70">Classified line · tap to reveal</div>
      {!revealed ? (
        <div className="relative h-10">
          <span className="absolute inset-x-0 top-1 h-4 rounded bg-red-950/75" />
          <span className="absolute inset-x-5 top-6 h-3 rounded bg-red-950/75" />
          {peeling ? (
            <motion.span
              className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-red-700/85 via-red-800/85 to-red-900/60"
              initial={{ x: "0%" }}
              animate={{ x: "105%", rotate: -6 }}
              transition={{ duration: 0.42, ease: "easeInOut" }}
            />
          ) : (
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-120%", "130%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      ) : (
        <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-xs tracking-wide text-red-100">
          {text}
        </motion.p>
      )}
    </button>
  );
}

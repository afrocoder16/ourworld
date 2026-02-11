"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type CrackedLineRevealProps = {
  text: string;
  className?: string;
};

const shards = [
  "polygon(0 0, 48% 0, 43% 100%, 0 100%)",
  "polygon(46% 0, 76% 0, 68% 100%, 38% 100%)",
  "polygon(74% 0, 100% 0, 100% 100%, 66% 100%)"
];

export function CrackedLineReveal({ text, className }: CrackedLineRevealProps) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className={cn("relative w-full overflow-hidden rounded-lg border border-cyan-200/25 bg-slate-950/45 px-3 py-3 text-left", className)}
      aria-expanded={open}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">Fracture line · tap</p>
      {!open ? (
        <div className="relative mt-2 h-12">
          {shards.map((clip, i) => (
            <motion.span
              key={clip}
              className="absolute inset-y-0 left-0 w-full bg-cyan-100/10 backdrop-blur-[1px]"
              style={{ clipPath: clip }}
              animate={{ x: [0, i % 2 ? 6 : -6, 0], opacity: [0.45, 0.75, 0.45] }}
              transition={{ duration: 2 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <span className="absolute inset-x-0 top-5 h-px bg-cyan-100/40" />
        </div>
      ) : (
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-sm text-cyan-100/90">
          {text}
        </motion.p>
      )}
    </button>
  );
}


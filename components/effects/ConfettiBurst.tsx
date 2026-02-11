"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type ConfettiBurstProps = {
  trigger: number;
};

const colors = ["#f8e3b0", "#ff8a3d", "#8bc4ff", "#ff5778", "#d8b4ff", "#91f2c2"];

export function ConfettiBurst({ trigger }: ConfettiBurstProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
        id: `${trigger}-${i}`,
        left: `${(i * 13) % 100}%`,
        delay: (i % 8) * 0.04,
        size: 6 + (i % 8),
        color: colors[i % colors.length],
        rotate: (i * 47) % 360
      })),
    [trigger]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{ left: piece.left, width: piece.size, height: Math.max(4, piece.size - 2), background: piece.color }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: "105vh", opacity: [0, 1, 1, 0], rotate: piece.rotate }}
          transition={{ duration: 3.8, delay: piece.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}


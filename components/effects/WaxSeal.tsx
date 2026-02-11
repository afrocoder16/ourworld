"use client";

import { motion } from "framer-motion";
import { SigilSet } from "@/components/icons/SigilIcons";
import { cn } from "@/lib/cn";

type WaxSealProps = {
  className?: string;
  label?: string;
};

export function WaxSeal({ className, label = "Oath Sealed" }: WaxSealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 1.2 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={cn("relative inline-flex items-center gap-2", className)}
    >
      <div className="relative grid h-14 w-14 place-items-center rounded-full border border-red-200/20 bg-gradient-to-br from-red-800 via-red-700 to-red-900 shadow-[inset_0_-6px_20px_rgba(0,0,0,0.35),0_10px_20px_rgba(0,0,0,0.3)] animate-sealPress">
        <div className="absolute inset-1 rounded-full border border-red-100/20" />
        <SigilSet.WaxSealSigil className="h-7 w-7 text-red-100/90" />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.45),transparent_35%)]" />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-red-200/80">{label}</span>
    </motion.div>
  );
}

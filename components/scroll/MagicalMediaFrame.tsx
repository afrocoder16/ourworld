"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MediaItem } from "@/content/book";
import { cn } from "@/lib/cn";

type MagicalMediaFrameProps = {
  media: MediaItem;
  className?: string;
  priority?: boolean;
  onVideoPlay?: () => void;
  onVideoEnded?: () => void;
  fit?: "cover" | "contain";
  mediaPosition?: "center" | "top" | "bottom";
  mediaClassName?: string;
};

function MissingMedia({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,203,129,0.2),transparent_34%),linear-gradient(160deg,rgba(20,25,40,0.95),rgba(10,15,24,0.95))] text-center">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold/70">Arcane Frame Waiting</p>
        <p className="mt-2 text-sm text-zinc-100/85">Drop edited media into `public/media/`</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-300/70">{label}</p>
      </div>
    </div>
  );
}

export function MagicalMediaFrame({
  media,
  className,
  priority,
  onVideoPlay,
  onVideoEnded,
  fit = "cover",
  mediaPosition = "center",
  mediaClassName
}: MagicalMediaFrameProps) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-gold/30 bg-black/35 shadow-[0_30px_60px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl border border-gold/20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,220,140,0.24),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(108,196,255,0.2),transparent_32%)] opacity-80 transition group-hover:opacity-100" />
      {!failed ? (
        media.type === "image" ? (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            priority={priority}
            onError={() => setFailed(true)}
            className={cn(
              "transition duration-500 group-hover:scale-105",
              fit === "contain" ? "object-contain" : "object-cover",
              mediaPosition === "top" && "object-top",
              mediaPosition === "bottom" && "object-bottom",
              mediaClassName
            )}
            sizes="(max-width: 768px) 90vw, 48vw"
          />
        ) : (
          <video
            className={cn(
              "h-full w-full transition duration-500 group-hover:scale-[1.02]",
              fit === "contain" ? "object-contain bg-black/40" : "object-cover",
              mediaPosition === "top" && "object-top",
              mediaPosition === "bottom" && "object-bottom",
              mediaClassName
            )}
            src={media.src}
            autoPlay
            muted
            playsInline
            loop={media.loop ?? false}
            controls
            preload="metadata"
            onPlay={onVideoPlay}
            onEnded={onVideoEnded}
            onError={() => setFailed(true)}
            aria-label={media.alt}
          />
        )
      ) : (
        <MissingMedia label={media.alt} />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
      <div className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 rotate-[12deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition duration-700 group-hover:left-[120%] group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[linear-gradient(to_right,transparent,rgba(255,172,102,0.75),transparent)] animate-flicker" />
    </motion.div>
  );
}

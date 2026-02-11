"use client";

import Image from "next/image";
import { MediaItem } from "@/content/book";
import { cn } from "@/lib/cn";

type MediaFrameProps = {
  media: MediaItem;
  className?: string;
  priority?: boolean;
};

export function MediaFrame({ media, className, priority }: MediaFrameProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-gold/25 bg-black/25 shadow-lg", className)}>
      {media.type === "image" ? (
        <Image src={media.src} alt={media.alt} fill priority={priority} className="object-cover" sizes="(max-width: 768px) 92vw, 42vw" />
      ) : (
        <video
          className="h-full w-full object-cover"
          src={media.src}
          autoPlay
          muted
          playsInline
          loop={media.loop ?? false}
          controls
          preload="metadata"
          aria-label={media.alt}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />
    </div>
  );
}

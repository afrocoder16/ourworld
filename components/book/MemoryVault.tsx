"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Chapter, ChapterTag, MediaItem } from "@/content/book";
import { tagIcon } from "@/components/icons/SigilIcons";
import { cn } from "@/lib/cn";

type VaultMedia = MediaItem & {
  id: string;
  chapterId: string;
  chapterTitle: string;
  tags: ChapterTag[];
  primaryTag: ChapterTag;
  chapterOrder: number;
  mediaOrder: number;
};

type MemoryVaultProps = {
  chapters: Chapter[];
  extraMedia?: MediaItem[];
};

const tileAspectRatios = [
  "aspect-[4/3]",
  "aspect-square",
  "aspect-[5/4]",
  "aspect-[3/4]",
  "aspect-[16/10]"
];

function VaultPreview({ media, onBroken }: { media: VaultMedia; onBroken: (id: string) => void }) {
  if (media.type === "image") {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.05]"
        sizes="(max-width: 768px) 88vw, (max-width: 1280px) 42vw, 30vw"
        onError={() => onBroken(media.id)}
      />
    );
  }

  return (
    <video
      src={media.src}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
      muted
      playsInline
      loop={media.loop ?? true}
      autoPlay
      controls={false}
      preload="metadata"
      onError={() => onBroken(media.id)}
      aria-label={media.alt}
    />
  );
}

function VaultTile({
  media,
  index,
  onOpen,
  onBroken
}: {
  media: VaultMedia;
  index: number;
  onOpen: (index: number) => void;
  onBroken: (id: string) => void;
}) {
  const aspectClass = tileAspectRatios[(media.chapterOrder + media.mediaOrder) % tileAspectRatios.length];

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      className={cn(
        "group relative mb-3 w-full overflow-hidden rounded-xl border border-gold/22 bg-black/35 text-left shadow-[0_18px_34px_rgba(0,0,0,0.22)]",
        aspectClass
      )}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.45, delay: (index % 9) * 0.03, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <VaultPreview media={media} onBroken={onBroken} />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(170deg,rgba(255,255,255,0.06),transparent_35%,rgba(0,0,0,0.38)_100%)]" />
      <motion.span
        className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/3 rotate-[14deg] bg-gradient-to-r from-transparent via-white/24 to-transparent"
        animate={{ x: ["0%", "380%"] }}
        transition={{ duration: 3.8 + (index % 3) * 0.5, repeat: Infinity, ease: "linear", delay: (index % 5) * 0.22 }}
      />
      <div className="pointer-events-none absolute inset-x-2 bottom-2 rounded border border-gold/26 bg-black/52 px-2 py-1.5">
        <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-gold/90">{media.chapterTitle}</p>
      </div>
      {media.type === "video" ? (
        <span className="pointer-events-none absolute right-2 top-2 rounded-full border border-sky-100/45 bg-sky-900/38 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-sky-100/85">
          clip
        </span>
      ) : null}
    </motion.button>
  );
}

export function MemoryVault({ chapters, extraMedia = [] }: MemoryVaultProps) {
  const media = useMemo(() => {
    const rows: VaultMedia[] = [];

    chapters.forEach((chapter, chapterIndex) => {
      const primaryTag = chapter.tags[0] ?? "cozy";
      [chapter.heroMedia, ...chapter.supportingMedia].forEach((item, mediaIndex) => {
        rows.push({
          ...item,
          id: `${chapter.id}-${item.src}-${mediaIndex}`,
          chapterId: chapter.id,
          chapterTitle: chapter.chapterTitle,
          tags: chapter.tags,
          primaryTag,
          chapterOrder: chapterIndex,
          mediaOrder: mediaIndex
        });
      });
    });

    extraMedia.forEach((item, extraIndex) => {
      rows.push({
        ...item,
        id: `vault-extra-${item.src}-${extraIndex}`,
        chapterId: "vault-extra",
        chapterTitle: "Vault Extras",
        tags: ["goofy", "adventure"],
        primaryTag: "goofy",
        chapterOrder: chapters.length + 1,
        mediaOrder: extraIndex
      });
    });

    return rows.sort((a, b) => a.chapterOrder - b.chapterOrder || a.mediaOrder - b.mediaOrder);
  }, [chapters, extraMedia]);

  const orderedTags = useMemo(() => {
    const tags = new Set<ChapterTag>();
    chapters.forEach((chapter) => chapter.tags.forEach((tag) => tags.add(tag)));
    if (!tags.has("goofy")) tags.add("goofy");
    if (!tags.has("adventure")) tags.add("adventure");
    return Array.from(tags);
  }, [chapters]);

  const [activeTag, setActiveTag] = useState<ChapterTag | "all">("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [brokenIds, setBrokenIds] = useState<Set<string>>(new Set());

  const visibleMedia = useMemo(() => media.filter((item) => !brokenIds.has(item.id)), [media, brokenIds]);

  const markBroken = useCallback((id: string) => {
    setBrokenIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const filteredMedia = useMemo(() => {
    if (activeTag === "all") return visibleMedia;
    return visibleMedia.filter((item) => item.tags.includes(activeTag));
  }, [activeTag, visibleMedia]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { all: visibleMedia.length };
    orderedTags.forEach((tag) => {
      counts[tag] = visibleMedia.filter((item) => item.tags.includes(tag)).length;
    });
    return counts;
  }, [visibleMedia, orderedTags]);

  const openLightbox = (index: number) => setSelected(index);
  const closeLightbox = useCallback(() => setSelected(null), []);
  const nextItem = useCallback(
    () => setSelected((prev) => (prev === null ? null : (prev + 1) % filteredMedia.length)),
    [filteredMedia.length]
  );
  const prevItem = useCallback(
    () => setSelected((prev) => (prev === null ? null : (prev - 1 + filteredMedia.length) % filteredMedia.length)),
    [filteredMedia.length]
  );

  useEffect(() => {
    if (selected === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") nextItem();
      if (event.key === "ArrowLeft") prevItem();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, closeLightbox, nextItem, prevItem]);

  useEffect(() => {
    if (selected === null) return;
    if (filteredMedia.length === 0) {
      setSelected(null);
      return;
    }
    setSelected((prev) => (prev === null ? prev : Math.min(prev, filteredMedia.length - 1)));
  }, [filteredMedia.length, selected]);

  const selectedItem = selected === null ? null : filteredMedia[selected];

  return (
    <div className="relative space-y-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,208,141,0.2),transparent_36%),radial-gradient(circle_at_86%_14%,rgba(123,194,255,0.18),transparent_34%)]" />
        {Array.from({ length: 20 }).map((_, spark) => (
          <motion.span
            key={`vault-spark-${spark}`}
            className="absolute h-[4px] w-[4px] rounded-full bg-gold/60"
            style={{ left: `${4 + spark * 5}%`, top: `${8 + (spark % 6) * 14}%` }}
            animate={{ y: [0, -8, 0], opacity: [0.15, 0.72, 0.15] }}
            transition={{ duration: 3 + (spark % 4) * 0.35, repeat: Infinity, ease: "easeInOut", delay: spark * 0.09 }}
          />
        ))}
      </div>

      <div className="relative">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold/80">Memory Vault</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">{filteredMedia.length} files visible</p>
        </div>
        <div className="h-[2px] w-full rounded bg-[linear-gradient(90deg,rgba(180,146,91,0.12),rgba(180,146,91,0.62),rgba(180,146,91,0.12))]" />
      </div>

      <div className="sticky top-2 z-20 rounded-xl border border-gold/18 bg-[linear-gradient(160deg,rgba(235,220,187,0.94),rgba(223,203,167,0.9))] p-2 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag("all")}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition",
              activeTag === "all"
                ? "border-gold/75 bg-gold/25 text-ink"
                : "border-gold/22 bg-black/10 text-ink/72 hover:border-gold/42"
            )}
          >
            All ({tagCounts.all ?? 0})
          </button>
          {orderedTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] transition",
                activeTag === tag
                  ? "border-gold/75 bg-gold/25 text-ink"
                  : "border-gold/22 bg-black/10 text-ink/72 hover:border-gold/42"
              )}
            >
              {tagIcon(tag, "h-3.5 w-3.5")}
              {tag} ({tagCounts[tag] ?? 0})
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-h-[62vh] overflow-y-auto rounded-xl border border-gold/14 bg-black/6 p-2 pr-1">
        <div className="columns-1 gap-3 sm:columns-2 xl:columns-3">
          {filteredMedia.map((item, index) => (
            <div key={`${item.id}::${activeTag}`} className="break-inside-avoid">
              <VaultTile media={item} index={index} onOpen={openLightbox} onBroken={markBroken} />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/84 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-gold/25 bg-[linear-gradient(160deg,rgba(7,11,20,0.96),rgba(11,9,18,0.94))] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative h-[68vh] overflow-hidden rounded-lg border border-gold/22 bg-black/35">
                {selectedItem.type === "image" ? (
                  <Image src={selectedItem.src} alt={selectedItem.alt} fill className="object-contain" sizes="90vw" />
                ) : (
                  <video src={selectedItem.src} className="h-full w-full object-contain" controls autoPlay muted playsInline />
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold/85">{selectedItem.chapterTitle}</p>
                  <p className="text-sm text-zinc-200/80">{selectedItem.alt}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={prevItem} className="rounded border border-gold/30 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-gold/90 transition hover:bg-gold/15">
                    Prev
                  </button>
                  <button type="button" onClick={nextItem} className="rounded border border-gold/30 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-gold/90 transition hover:bg-gold/15">
                    Next
                  </button>
                  <button type="button" onClick={closeLightbox} className="rounded border border-gold/30 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-gold/90 transition hover:bg-gold/15">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

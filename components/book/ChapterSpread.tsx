"use client";

import { motion } from "framer-motion";
import { Chapter } from "@/content/book";
import { tagIcon } from "@/components/icons/SigilIcons";
import { MediaFrame } from "@/components/book/MediaFrame";
import { RedactionReveal } from "@/components/book/RedactionReveal";
import { WaxSeal } from "@/components/effects/WaxSeal";

type ChapterSpreadProps = {
  chapter: Chapter;
};

export function ChapterSpread({ chapter }: ChapterSpreadProps) {
  const isMission = chapter.tags.includes("mission");
  const isProposal = chapter.tags.includes("proposal");

  return (
    <div className="relative grid min-h-[70vh] grid-cols-1 gap-4 md:grid-cols-2">
      <section className="page-parchment wing-corners relative overflow-hidden rounded-xl border border-gold/20 bg-parchment/95 p-5 shadow-page">
        <div className="pointer-events-none absolute -left-8 top-8 text-ink/8">{tagIcon(chapter.tags[0], "h-40 w-40")}</div>
        <div className="relative">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/60">{chapter.dateLabel}</p>
          <h2 className="mt-2 bg-[linear-gradient(to_right,rgba(200,169,109,0.25),rgba(200,169,109,0.08))] bg-[length:0%_100%] bg-no-repeat font-display text-3xl text-ink animate-inkReveal">
            {chapter.chapterTitle}
          </h2>
          {isProposal ? <WaxSeal className="mt-3" label="Proposal" /> : null}
        </div>

        <div className="relative mt-4 space-y-2 text-lg leading-relaxed text-ink/90">
          {chapter.bodyText.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <motion.blockquote
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-4 border-l-2 border-gold/45 pl-3 font-display text-xl italic text-ink/85"
        >
          <span className="relative inline-block">
            {chapter.quoteLine}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 translate-x-[1px] text-ink/20"
              style={{ clipPath: "polygon(0 56%,100% 44%,100% 100%,0 100%)" }}
            >
              {chapter.quoteLine}
            </span>
          </span>
        </motion.blockquote>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">{chapter.footnote}</p>
        {chapter.redactedLine ? <RedactionReveal className="mt-4" text={chapter.redactedLine} /> : null}

        {isMission ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
            <div className="absolute left-0 top-0 h-full w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-cyan-100/20 to-transparent animate-shimmer" />
            <div className="absolute right-3 top-3 rounded border border-red-600/55 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-red-700/80">
              mission file
            </div>
          </div>
        ) : null}
      </section>

      <section className="relative overflow-hidden rounded-xl border border-gold/20 bg-black/25 p-3 shadow-page">
        <div className="grid h-full grid-rows-[minmax(220px,1fr)_auto] gap-3">
          <MediaFrame media={chapter.heroMedia} className="h-full min-h-56" priority />
          {chapter.supportingMedia.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {chapter.supportingMedia.slice(0, 6).map((item) => (
                <MediaFrame key={`${chapter.id}-${item.src}`} media={item} className="h-24" />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

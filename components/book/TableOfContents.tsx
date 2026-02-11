"use client";

import { Chapter } from "@/content/book";
import { tagIcon } from "@/components/icons/SigilIcons";

type TableOfContentsProps = {
  chapters: Chapter[];
  onJump: (chapterId: string) => void;
};

export function TableOfContents({ chapters, onJump }: TableOfContentsProps) {
  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/80">Table of Contents</p>
      <ul className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
        {chapters.map((chapter, idx) => {
          const mainTag = chapter.tags[0];
          return (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => onJump(chapter.id)}
                className="group flex w-full items-center justify-between rounded-md border border-gold/15 bg-black/10 px-3 py-2 text-left transition hover:border-gold/40 hover:bg-black/20"
              >
                <span className="flex items-center gap-2">
                  <span className="text-gold/80">{tagIcon(mainTag, "h-4 w-4")}</span>
                  <span>
                    <span className="block font-display text-sm text-ink/95">{chapter.chapterTitle}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">{chapter.dateLabel}</span>
                  </span>
                </span>
                <span className="font-mono text-xs text-ink/55">{String(idx + 1).padStart(2, "0")}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

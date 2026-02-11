"use client";

import { Chapter } from "@/content/book";
import { tagIcon } from "@/components/icons/SigilIcons";

type BondMeterProps = {
  chapters: Chapter[];
  activeChapterId?: string;
  visitedChapterIds: string[];
  onJump: (chapterId: string) => void;
};

export function BondMeter({ chapters, activeChapterId, visitedChapterIds, onJump }: BondMeterProps) {
  const visited = new Set(visitedChapterIds);
  const activeIndex = activeChapterId ? chapters.findIndex((chapter) => chapter.id === activeChapterId) : -1;
  const progress = activeIndex < 0 ? 0 : ((activeIndex + 1) / chapters.length) * 100;

  return (
    <>
      <aside className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <div className="relative w-16 rounded-2xl border border-gold/25 bg-black/45 px-3 py-5 backdrop-blur-sm">
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-gold/80">Bond</p>
          <div className="mx-auto mt-3 h-64 w-3 overflow-hidden rounded-full bg-red-950/70">
            <div className="w-full bg-gradient-to-t from-red-700 via-red-500 to-orange-300 transition-[height] duration-500" style={{ height: `${progress}%`, marginTop: `${100 - progress}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-1">
            {chapters.map((chapter, i) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onJump(chapter.id)}
                className={`${activeIndex === i ? "text-gold" : visited.has(chapter.id) ? "text-gold/75" : "text-gold/25"} transition hover:text-gold`}
                aria-label={`Jump to ${chapter.chapterTitle}`}
              >
                {tagIcon(chapter.tags[0], "h-4 w-4")}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-40 mx-auto mt-2 w-[94vw] max-w-xl rounded-full border border-gold/25 bg-black/50 px-3 py-2 backdrop-blur-sm lg:hidden">
        <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-red-950/65">
          <div className="h-full bg-gradient-to-r from-red-600 to-gold transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between">
          {chapters.slice(0, 8).map((chapter, i) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onJump(chapter.id)}
              className={`${activeIndex === i ? "text-gold" : visited.has(chapter.id) ? "text-gold/75" : "text-gold/25"} transition`}
            >
              {tagIcon(chapter.tags[0], "h-3.5 w-3.5")}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}


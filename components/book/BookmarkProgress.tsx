"use client";

import { Chapter } from "@/content/book";
import { tagIcon } from "@/components/icons/SigilIcons";

type BookmarkProgressProps = {
  chapters: Chapter[];
  currentChapterId?: string;
};

export function BookmarkProgress({ chapters, currentChapterId }: BookmarkProgressProps) {
  const currentIndex = chapters.findIndex((c) => c.id === currentChapterId);
  const progress = currentIndex < 0 ? 0 : ((currentIndex + 1) / chapters.length) * 100;

  return (
    <aside className="relative hidden w-16 shrink-0 lg:flex lg:flex-col lg:items-center">
      <div className="relative mt-8 h-[420px] w-4 overflow-hidden rounded-b-full rounded-t-sm bg-red-950/70 shadow-[0_12px_22px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-x-0 top-0 h-5 bg-red-700/95" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-800 to-red-600 transition-all duration-700" style={{ height: `${progress}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-md border border-gold/20 bg-black/20 p-2">
        {chapters.map((chapter, i) => {
          const active = currentIndex >= i;
          return (
            <span key={chapter.id} className={active ? "text-gold" : "text-gold/30"}>
              {tagIcon(chapter.tags[0], "h-4 w-4")}
            </span>
          );
        })}
      </div>
    </aside>
  );
}

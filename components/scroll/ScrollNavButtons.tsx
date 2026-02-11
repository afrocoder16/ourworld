"use client";

type ScrollNavButtonsProps = {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
};

export function ScrollNavButtons({ onPrev, onNext, currentIndex, total }: ScrollNavButtonsProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-gold/25 bg-black/65 p-2 backdrop-blur-sm">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentIndex <= 0}
        className="rounded border border-gold/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold/90 hover:bg-gold/10 disabled:opacity-35"
      >
        Prev
      </button>
      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold/75">
        {currentIndex + 1}/{total}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={currentIndex >= total - 1}
        className="rounded border border-gold/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold/90 hover:bg-gold/10 disabled:opacity-35"
      >
        Next
      </button>
    </div>
  );
}


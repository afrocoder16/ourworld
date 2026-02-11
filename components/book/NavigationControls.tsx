"use client";

type NavigationControlsProps = {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export function NavigationControls({ currentIndex, total, onPrev, onNext }: NavigationControlsProps) {
  return (
    <nav className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-gold/20 bg-black/25 px-3 py-2 text-sm backdrop-blur">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentIndex <= 0}
        className="rounded-md border border-gold/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-gold transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/85">
        Page {currentIndex + 1} / {total}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={currentIndex >= total - 1}
        className="rounded-md border border-gold/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-gold transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}

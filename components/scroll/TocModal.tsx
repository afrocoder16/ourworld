"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Chapter } from "@/content/book";
import { tagIcon } from "@/components/icons/SigilIcons";

type TocModalProps = {
  open: boolean;
  onClose: () => void;
  chapters: Chapter[];
  activeChapterId?: string;
  onJump: (id: string) => void;
  onJumpVault: () => void;
  onJumpLocked: () => void;
  onJumpFinal: () => void;
};

export function TocModal({ open, onClose, chapters, activeChapterId, onJump, onJumpVault, onJumpLocked, onJumpFinal }: TocModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl rounded-2xl border border-gold/25 bg-[linear-gradient(150deg,rgba(244,230,198,0.98),rgba(214,194,161,0.95))] p-5 text-ink shadow-[0_30px_70px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl">Codex Map</h3>
              <button type="button" onClick={onClose} className="rounded border border-ink/20 px-2 py-1 font-mono text-xs uppercase tracking-[0.18em]">
                Close
              </button>
            </div>
            <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => {
                    onJump(chapter.id);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left ${
                    activeChapterId === chapter.id ? "border-gold/70 bg-gold/20" : "border-gold/20 bg-black/10 hover:border-gold/45"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-gold">{tagIcon(chapter.tags[0], "h-4 w-4")}</span>
                    <span>
                      <span className="block font-display text-lg">{chapter.chapterTitle}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60">{chapter.dateLabel}</span>
                    </span>
                  </span>
                </button>
              ))}
              <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => {
                    onJumpVault();
                    onClose();
                  }}
                  className="rounded border border-gold/20 bg-black/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] hover:border-gold/45"
                >
                  Memory Vault
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onJumpLocked();
                    onClose();
                  }}
                  className="rounded border border-gold/20 bg-black/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] hover:border-gold/45"
                >
                  Locked Archive
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onJumpFinal();
                    onClose();
                  }}
                  className="rounded border border-gold/20 bg-black/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] hover:border-gold/45"
                >
                  Final Oath
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}


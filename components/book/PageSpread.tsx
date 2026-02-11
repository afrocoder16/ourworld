"use client";

import { motion } from "framer-motion";
import { BookConfig } from "@/content/book";
import { tagIcon, SigilSet } from "@/components/icons/SigilIcons";
import { TableOfContents } from "@/components/book/TableOfContents";
import { ChapterSpread } from "@/components/book/ChapterSpread";
import { MemoryVault } from "@/components/book/MemoryVault";
import { LockedSecretPage } from "@/components/book/LockedSecretPage";
import { FinalValentinePage } from "@/components/book/FinalValentinePage";
import { BookPage } from "@/lib/book-pages";

type PageSpreadProps = {
  page: BookPage;
  book: BookConfig;
  onOpenBook: () => void;
  onJumpChapter: (chapterId: string) => void;
};

const pageTransition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

export function PageSpread({ page, book, onOpenBook, onJumpChapter }: PageSpreadProps) {
  if (page.kind === "chapter") {
    return (
      <motion.div
        key={page.id}
        initial={{ opacity: 0, rotateY: -9, transformPerspective: 1100 }}
        animate={{ opacity: 1, rotateY: 0, transformPerspective: 1100 }}
        exit={{ opacity: 0, rotateY: 9, transformPerspective: 1100 }}
        transition={pageTransition}
      >
        <ChapterSpread chapter={page.chapter} />
      </motion.div>
    );
  }

  if (page.kind === "cover") {
    return (
      <motion.div
        key="cover"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={pageTransition}
        className="grid min-h-[70vh] grid-cols-1 gap-4 md:grid-cols-2"
      >
        <section className="relative overflow-hidden rounded-xl border border-gold/25 bg-[radial-gradient(circle_at_10%_20%,rgba(255,201,104,0.22),transparent_40%),linear-gradient(150deg,#211829,#110f14_65%)] p-6 shadow-page">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(67,164,255,0.24),transparent_30%)]" />
          <div className="relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">Enchanted Grimoire</p>
            <h1 className="mt-4 font-display text-5xl leading-tight text-gold">{book.title}</h1>
            <p className="mt-3 max-w-md text-lg text-zinc-200/90">{book.subtitle}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-gold/70">{book.dedication}</p>
            <button
              type="button"
              onClick={onOpenBook}
              className="mt-8 rounded-md border border-gold/55 bg-gold/15 px-5 py-3 font-mono text-xs uppercase tracking-[0.24em] text-gold transition hover:bg-gold/30"
            >
              Open the Book
            </button>
          </div>
        </section>
        <section className="page-parchment wing-corners relative overflow-hidden rounded-xl border border-gold/20 bg-parchment/95 p-6 shadow-page">
          <div className="pointer-events-none absolute inset-0 opacity-15">
            <SigilSet.StarSigil className="absolute left-5 top-10 h-12 w-12 text-ink" />
            <SigilSet.FlameSigil className="absolute right-6 top-24 h-16 w-16 text-ink" />
            <SigilSet.DaggerSigil className="absolute bottom-8 left-8 h-14 w-14 text-ink" />
          </div>
          <h2 className="relative font-display text-2xl text-ink">Field Rules</h2>
          <ul className="relative mt-3 space-y-2 text-lg text-ink/90">
            <li>Turn pages with buttons or arrow keys.</li>
            <li>Every chapter is a case file and a spell at once.</li>
            <li>Mission pages contain hidden redacted lines.</li>
            <li>Vault and classified files unlock near the end.</li>
          </ul>
        </section>
      </motion.div>
    );
  }

  if (page.kind === "toc") {
    return (
      <motion.div
        key="toc"
        initial={{ opacity: 0, rotateY: -7 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: 7 }}
        transition={pageTransition}
        className="grid min-h-[70vh] grid-cols-1 gap-4 md:grid-cols-2"
      >
        <section className="page-parchment wing-corners rounded-xl border border-gold/20 bg-parchment/95 p-5 shadow-page">
          <TableOfContents chapters={book.chapters} onJump={onJumpChapter} />
        </section>
        <section className="relative overflow-hidden rounded-xl border border-gold/20 bg-black/25 p-5 shadow-page">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold/80">Sigil Index</p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-200/85">
            <div className="flex items-center gap-2">{tagIcon("prologue", "h-4 w-4")} Prologue</div>
            <div className="flex items-center gap-2">{tagIcon("mission", "h-4 w-4")} Mission</div>
            <div className="flex items-center gap-2">{tagIcon("trial", "h-4 w-4")} Trial</div>
            <div className="flex items-center gap-2">{tagIcon("proposal", "h-4 w-4")} Proposal</div>
            <div className="flex items-center gap-2">{tagIcon("epilogue", "h-4 w-4")} Epilogue</div>
            <div className="flex items-center gap-2">{tagIcon("adventure", "h-4 w-4")} Adventure</div>
          </div>
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-950/20 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-200/80">Guild Hunter Stamp</p>
            <p className="mt-2 text-sm text-zinc-100/80">Case files marked in crimson carry higher emotional threat levels.</p>
          </div>
        </section>
      </motion.div>
    );
  }

  if (page.kind === "vault") {
    return (
      <motion.div
        key="vault"
        initial={{ opacity: 0, rotateY: -8 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: 8 }}
        transition={pageTransition}
        className="page-parchment wing-corners rounded-xl border border-gold/20 bg-parchment/95 p-5 shadow-page"
      >
        <MemoryVault chapters={book.chapters} />
      </motion.div>
    );
  }

  if (page.kind === "locked") {
    return (
      <motion.div
        key="locked"
        initial={{ opacity: 0, rotateY: -8 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: 8 }}
        transition={pageTransition}
        className="page-parchment wing-corners rounded-xl border border-gold/20 bg-parchment/95 p-5 shadow-page"
      >
        <LockedSecretPage config={book.locked} />
      </motion.div>
    );
  }

  return (
    <motion.div
      key="final"
      initial={{ opacity: 0, rotateY: -8 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: 8 }}
      transition={pageTransition}
      className="page-parchment wing-corners rounded-xl border border-gold/20 bg-parchment/95 p-5 shadow-page"
    >
      <FinalValentinePage config={book.finalPrompt} />
    </motion.div>
  );
}

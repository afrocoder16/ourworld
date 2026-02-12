"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { book } from "@/content/book";
import { MemoryVault } from "@/components/book/MemoryVault";
import { LockedSecretPage } from "@/components/book/LockedSecretPage";
import { FinalValentinePage } from "@/components/book/FinalValentinePage";
import { CinematicBackground } from "@/components/scroll/CinematicBackground";
import { ChapterSceneSection } from "@/components/scroll/ChapterSceneSection";
import { BondMeter } from "@/components/scroll/BondMeter";
import { TocModal } from "@/components/scroll/TocModal";
import { AudioManager } from "@/components/scroll/AudioManager";
import { ScrollNavButtons } from "@/components/scroll/ScrollNavButtons";
import { getParticleMode } from "@/lib/chapter-meta";
import { dispatchCodexAudio } from "@/lib/audio-events";

const COVER_ID = "cover";
const VAULT_ID = "vault";
const LOCKED_ID = "locked";
const FINAL_ID = "final";

export function BookShell() {
  const [activeSectionId, setActiveSectionId] = useState(COVER_ID);
  const [visitedChapterIds, setVisitedChapterIds] = useState<string[]>([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const chapters = book.chapters;
  const sectionOrder = useMemo(
    () => [COVER_ID, ...chapters.map((chapter) => chapter.id), VAULT_ID, LOCKED_ID, FINAL_ID],
    [chapters]
  );

  const setSectionRef = (id: string) => (element: HTMLElement | null) => {
    sectionRefs.current[id] = element;
  };

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onEnterChapterOne = () => {
    dispatchCodexAudio({ action: "start" });
    scrollToSection(chapters[0].id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        const id = visible[0].target.id;
        setActiveSectionId(id);
        if (chapters.some((chapter) => chapter.id === id)) {
          setVisitedChapterIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
        }
      },
      { threshold: [0.25, 0.45, 0.66], rootMargin: "-28% 0px -36% 0px" }
    );

    sectionOrder.forEach((id) => {
      const section = sectionRefs.current[id];
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [chapters, sectionOrder]);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollProgress(window.scrollY / max);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const currentIndex = Math.max(0, sectionOrder.findIndex((id) => id === activeSectionId));
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        scrollToSection(sectionOrder[Math.min(currentIndex + 1, sectionOrder.length - 1)]);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        scrollToSection(sectionOrder[Math.max(currentIndex - 1, 0)]);
      }
      if (event.key.toLowerCase() === "m") setMapOpen((prev) => !prev);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSectionId, sectionOrder]);

  const activeChapter = chapters.find((chapter) => chapter.id === activeSectionId);
  const activeAudio = activeChapter
    ? {
        sectionId: activeSectionId,
        trackId: activeChapter.trackId,
        intensity: activeChapter.intensity,
        stinger: activeChapter.stinger
      }
    : activeSectionId === FINAL_ID
      ? {
          sectionId: activeSectionId,
          trackId: book.audio.specialTrackId,
          intensity: 0.9,
          stinger: "/audio/sfx/rider-oath.mp3"
        }
      : activeSectionId === LOCKED_ID
        ? {
            sectionId: activeSectionId,
            trackId: "veil-of-glyphs",
            intensity: 0.52,
            stinger: "/audio/sfx/chest-unlock.mp3"
          }
        : activeSectionId === VAULT_ID
          ? {
              sectionId: activeSectionId,
              trackId: "chaos-sidequest",
              intensity: 0.55
            }
          : {
              sectionId: activeSectionId,
              trackId: book.audio.defaultTrackId,
              intensity: 0.48
            };

  const currentSectionIndex = Math.max(0, sectionOrder.findIndex((id) => id === activeSectionId));
  const particleMode = getParticleMode(activeChapter);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <CinematicBackground scrollProgress={scrollProgress} particleMode={particleMode} chapter={activeChapter} />
      <BondMeter chapters={chapters} activeChapterId={activeChapter?.id} visitedChapterIds={visitedChapterIds} onJump={scrollToSection} />

      <button
        type="button"
        onClick={() => setMapOpen(true)}
        className="fixed right-4 top-4 z-50 rounded-full border border-gold/35 bg-black/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur-sm"
      >
        Codex Map
      </button>

      <AudioManager tracks={book.audio.tracks} defaultTrackId={book.audio.defaultTrackId} activeAudio={activeAudio} />
      <ScrollNavButtons
        currentIndex={currentSectionIndex}
        total={sectionOrder.length}
        onPrev={() => scrollToSection(sectionOrder[Math.max(0, currentSectionIndex - 1)])}
        onNext={() => scrollToSection(sectionOrder[Math.min(sectionOrder.length - 1, currentSectionIndex + 1)])}
      />

      <TocModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        chapters={chapters}
        activeChapterId={activeChapter?.id}
        onJump={scrollToSection}
        onJumpVault={() => scrollToSection(VAULT_ID)}
        onJumpLocked={() => scrollToSection(LOCKED_ID)}
        onJumpFinal={() => scrollToSection(FINAL_ID)}
      />

      <section id={COVER_ID} ref={setSectionRef(COVER_ID)} className="relative flex min-h-screen items-center px-5 py-24 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`page-fragment-${i}`}
              className="absolute h-16 w-12 rounded-sm border border-gold/25 bg-[linear-gradient(160deg,rgba(236,219,186,0.2),rgba(163,126,84,0.14))]"
              style={{ left: `${8 + i * 16}%`, top: `${16 + (i % 3) * 20}%` }}
              animate={{ y: [0, -12 - (i % 3) * 2, 0], rotate: [-4 + i, 2 + i, -4 + i], opacity: [0.22, 0.42, 0.22] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={`cover-ember-${i}`}
              className="absolute h-[3px] w-[3px] rounded-full bg-orange-300/55 animate-dust"
              style={{ left: `${(i * 11) % 100}%`, bottom: `${-10 - (i % 4) * 10}px`, animationDelay: `${i * 0.18}s`, animationDuration: `${2.8 + (i % 4)}s` }}
            />
          ))}
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-7 lg:grid-cols-2">
          <div className="rounded-2xl border border-gold/30 bg-[linear-gradient(155deg,rgba(33,24,41,0.94),rgba(13,12,18,0.93))] p-7 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/80">Living Codex</p>
            <h1 className="mt-3 font-display text-5xl leading-tight text-gold sm:text-6xl">{book.title}</h1>
            <p className="mt-3 max-w-md text-xl text-zinc-100/90">{book.subtitle}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-gold/70">{book.dedication}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onEnterChapterOne}
                className="rounded-md border border-gold/55 bg-gold/15 px-5 py-3 font-mono text-xs uppercase tracking-[0.24em] text-gold transition hover:bg-gold/30"
              >
                Enter Chapter One
              </button>
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="rounded-md border border-gold/35 bg-black/25 px-5 py-3 font-mono text-xs uppercase tracking-[0.24em] text-gold/85 transition hover:bg-black/35"
              >
                Open Map
              </button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl border border-gold/25 bg-[linear-gradient(155deg,rgba(244,230,198,0.96),rgba(218,196,159,0.95))] p-7 text-ink shadow-[0_30px_70px_rgba(0,0,0,0.38)]"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Ritual Checklist</p>
            <ul className="mt-3 space-y-2 text-xl leading-relaxed">
              <li>Scroll to travel chapter by chapter.</li>
              <li>Tap redactions, unlock seals, collect sigils.</li>
              <li>Use map or arrow keys for quick jumps.</li>
              <li>Sound orb shifts music as chapters change.</li>
            </ul>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-ink/55">Press M for map</p>
          </motion.div>
        </div>
      </section>

      {chapters.map((chapter, index) => (
        <ChapterSceneSection
          key={chapter.id}
          sectionRef={setSectionRef(chapter.id)}
          chapter={chapter}
          index={index}
          total={chapters.length}
          active={activeSectionId === chapter.id}
        />
      ))}

      <section id={VAULT_ID} ref={setSectionRef(VAULT_ID)} className="relative flex min-h-screen items-center px-4 py-20 sm:px-8 lg:px-14">
        <div className="relative z-10 mx-auto w-full max-w-6xl rounded-2xl border border-gold/25 bg-[linear-gradient(160deg,rgba(244,230,198,0.97),rgba(217,197,164,0.94))] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.42)]">
          <MemoryVault chapters={chapters} extraMedia={book.vault.extraMedia} />
        </div>
      </section>

      <section id={LOCKED_ID} ref={setSectionRef(LOCKED_ID)} className="relative flex min-h-screen items-center px-4 py-20 sm:px-8 lg:px-14">
        <div className="relative z-10 mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-gold/25 bg-[linear-gradient(160deg,rgba(244,230,198,0.97),rgba(217,197,164,0.94))] p-6 shadow-[0_30px_70px_rgba(0,0,0,0.42)]">
          <div className="pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(circle_at_center,black_30%,transparent_85%)]">
            <div className="absolute -right-6 top-10 rotate-6 font-mono text-xs tracking-[0.4em] text-ink/40">GLYPH-AX9 ORIGIN-FILE 7X</div>
            <div className="absolute left-6 top-24 -rotate-6 font-mono text-xs tracking-[0.35em] text-ink/40">CLASSIFIED ORIGIN DOSSIER</div>
            <div className="absolute bottom-16 right-10 font-mono text-xs tracking-[0.3em] text-ink/35">SIGIL-CODE 118 207 19</div>
          </div>
          <LockedSecretPage config={book.locked} />
        </div>
      </section>

      <section id={FINAL_ID} ref={setSectionRef(FINAL_ID)} className="relative min-h-screen">
        <div className="relative z-10 w-full">
          <FinalValentinePage config={book.finalPrompt} />
        </div>
      </section>
    </main>
  );
}

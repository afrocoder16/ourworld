"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Chapter } from "@/content/book";
import { tagIcon, tagSigilName, SigilSet } from "@/components/icons/SigilIcons";
import { RedactionReveal } from "@/components/book/RedactionReveal";
import { WaxSeal } from "@/components/effects/WaxSeal";
import { MagicalMediaFrame } from "@/components/scroll/MagicalMediaFrame";
import { CrackedLineReveal } from "@/components/scroll/CrackedLineReveal";
import { RecoveredDmArtifact } from "@/components/scroll/RecoveredDmArtifact";
import { getTagWatermark, getWorldModules } from "@/lib/world-engine";
import { cn } from "@/lib/cn";
import { dispatchCodexAudio } from "@/lib/audio-events";
import { withBasePath } from "@/lib/base-path";

type ChapterSceneSectionProps = {
  chapter: Chapter;
  active: boolean;
  index: number;
  total: number;
  sectionRef?: (element: HTMLElement | null) => void;
};

const featherCount = 10;
const firstEncounterScenes = [
  { id: "scene-01", label: "Scene 01", text: "Lunch first, butterflies hidden." },
  { id: "scene-02", label: "Scene 02", text: "Rain outside, u still said yes." },
  { id: "scene-03", label: "Scene 03", text: "Now playing: Nobody 2." }
];
const worldOfHerDragonMedia = { type: "image" as const, src: withBasePath("/media/dragon.jpg"), alt: "Cute dragon mascot" };
const worldOfHerBaklavaMedia = { type: "image" as const, src: withBasePath("/media/our_first_Baklava.jpg"), alt: "Our first baklava" };
const sideQuestSaltSprayCount = 10;
const sideQuestInkFleckCount = 10;
const candleDustParticleCount = 40;
const candleFireflyCount = 28;
const candleCollageAnchor = { x: 76, y: 24 };
const candleHeartOffsets = Array.from({ length: candleFireflyCount }).map((_, i) => {
  const t = (i / candleFireflyCount) * Math.PI * 2;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: x * 2.1, y: y * 2.1 };
});
const candleEdgeOffsets = [
  { x: -182, y: -106 },
  { x: 0, y: -118 },
  { x: 182, y: -106 },
  { x: -192, y: 0 },
  { x: 192, y: 0 },
  { x: -182, y: 106 },
  { x: 0, y: 118 },
  { x: 182, y: 106 }
];
const finalMissionOrderByName: Record<string, number> = {
  "the_process": 1,
  "the_process-2": 2,
  "the_process-3": 3,
  "the_process-4": 4,
  "the_process-5": 5,
  "the_process=5": 5,
  "proposal_1": 6,
  "proposal_2": 7,
  "proposal_3": 8,
  "proposal_4": 9
};

const finalMissionLabelByName: Record<string, string> = {
  "the_process": "The Blank Canvas",
  "the_process-2": "Behind the Scenes Setup",
  "the_process-3": "Florals Up, Magic Loading",
  "the_process-4": "The Stage Is Set",
  "the_process-5": "Ready for Her Entrance",
  "the_process=5": "Ready for Her Entrance",
  "proposal_1": "The Question",
  "proposal_2": "The Ring Moment",
  "proposal_3": "She Said Yes",
  "proposal_4": "Forever Starts Here"
};
const epilogueClipLabelByName: Record<string, string> = {
  "video project 2": "Moonlight Dance Cut",
  "video project 3": "Twirl & Giggles Cut"
};
const dragonRoarEffectSrc = withBasePath("/audio/Dragon roar sound effect - Sound Treasures.mp3");
const publicTrackSrc = withBasePath("/audio/PUBLIC.mp3");
const elvisTrackSrc = withBasePath("/audio/Elvis Presley.mp3");
const taioTrackSrc = withBasePath("/audio/Taio Cruz.mp3");
const alexWarrenTrackSrc = withBasePath("/audio/Alex Warren.mp3");

const getMediaBaseName = (src: string) => {
  const fileName = src.split("/").pop() ?? src;
  return fileName.replace(/\.[^.]+$/, "").toLowerCase();
};

const getFinalMissionOrder = (src: string) => {
  const baseName = getMediaBaseName(src);
  return finalMissionOrderByName[baseName] ?? Number.MAX_SAFE_INTEGER;
};

const getFinalMissionLabel = (src: string, fallbackIndex: number) => {
  const baseName = getMediaBaseName(src);
  return finalMissionLabelByName[baseName] ?? `Step ${fallbackIndex + 1}`;
};

const getEpilogueClipLabel = (src: string, fallbackIndex: number) => {
  const baseName = getMediaBaseName(src);
  return epilogueClipLabelByName[baseName] ?? `After Oath Clip ${fallbackIndex + 1}`;
};

type PsyRevealLineProps = {
  text: string;
  className?: string;
  onReveal?: () => void;
};

function PsyRevealLine({ text, className, onReveal }: PsyRevealLineProps) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const [rippleTick, setRippleTick] = useState(0);
  const [distortTick, setDistortTick] = useState(0);

  const onTap = () => {
    if (revealed) {
      setRevealed(false);
      return;
    }
    setRippleTick((prev) => prev + 1);
    setDistortTick((prev) => prev + 1);
    setRevealed(true);
    onReveal?.();
  };

  return (
    <button
      type="button"
      onClick={onTap}
      className={cn(
        "group relative w-full overflow-hidden rounded-md border border-cyan-400/25 bg-[linear-gradient(145deg,rgba(17,26,36,0.42),rgba(17,24,34,0.28))] px-3 py-2 text-left text-sm text-cyan-100/85",
        className
      )}
      aria-expanded={revealed}
    >
      <div className="mb-1 text-[10px] uppercase tracking-[0.25em] text-cyan-200/75">Classified line - tap to reveal</div>
      {!revealed ? (
        <div className="relative h-10 overflow-hidden rounded">
          <span className="absolute inset-x-0 top-1 h-4 rounded bg-cyan-950/55" />
          <span className="absolute inset-x-5 top-6 h-3 rounded bg-cyan-950/55" />
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-100/20 to-transparent"
            animate={reduceMotion ? undefined : { x: ["-120%", "130%"] }}
            transition={reduceMotion ? undefined : { duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
          />
          {rippleTick ? (
            <>
              <motion.span
                key={`psy-ripple-a-${rippleTick}`}
                className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/70"
                initial={{ scale: 0.3, opacity: 0.75 }}
                animate={{ scale: reduceMotion ? 1 : 8, opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.2 : 0.65, ease: "easeOut" }}
              />
              <motion.span
                key={`psy-ripple-b-${rippleTick}`}
                className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-200/55"
                initial={{ scale: 0.3, opacity: 0.7 }}
                animate={{ scale: reduceMotion ? 1 : 6.5, opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.15 : 0.5, delay: reduceMotion ? 0 : 0.1, ease: "easeOut" }}
              />
            </>
          ) : null}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded">
          {distortTick ? (
            <motion.div
              key={`psy-distort-${distortTick}`}
              className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(175deg,rgba(135,222,255,0.24)_0_2px,transparent_2px_6px)] mix-blend-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.75, 0.15, 0], x: [0, -2, 2, 0] }}
              transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: "easeOut" }}
            />
          ) : null}
          {distortTick ? (
            <motion.span
              key={`psy-distort-ripple-${distortTick}`}
              className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/75"
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: reduceMotion ? 1 : 7, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: "easeOut" }}
            />
          ) : null}
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: "easeOut" }}
            className="relative font-mono text-xs tracking-wide text-cyan-100"
          >
            {text}
          </motion.p>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(117,240,255,0.22),transparent_62%)] opacity-0 transition duration-300 group-hover:opacity-50" />
    </button>
  );
}

export function ChapterSceneSection({ chapter, active, index, total, sectionRef }: ChapterSceneSectionProps) {
  const reduceMotion = useReducedMotion();
  const modules = getWorldModules(chapter);
  const mission = modules.includes("guild") || modules.includes("assassin");
  const fae = modules.includes("fae");
  const proposal = chapter.tags.includes("proposal");
  const trial = modules.includes("shatter");
  const ocean = modules.includes("quest");
  const legacy = modules.includes("legacy");
  const psy = modules.includes("psy");
  const rune = modules.includes("rune");
  const rider = modules.includes("rider");
  const assassin = modules.includes("assassin");
  const isPrologue = chapter.id === "prologue-first-signal";
  const firstEncounterCinema = chapter.id === "chapter-1-first-encounter";
  const reservationLiePsy = chapter.id === "mission-01-reservation-lie";
  const worldOfHerCollage = chapter.id === "chapter-2-world-of-her";
  const candlelightCollage = chapter.id === "mission-02-candlelight-rituals";
  const cityWalkOrbit = chapter.id === "mission-03-city-walk";
  const proofChemistryLab = chapter.id === "chapter-4-proof-of-chemistry";
  const endOfSummerMission = chapter.id === "mission-04-end-of-summer";
  const chaosButOursWinter = chapter.id === "chapter-5-chaos-but-ours";
  const trialDistanceSignal = chapter.id === "trial-distance";
  const epilogueAfterOath = chapter.id === "epilogue-after-oath";
  const finalMissionOath = chapter.id === "final-mission-oath";
  const sideQuestAdventure = chapter.id === "chapter-3-side-quest-adventure";
  const missionTwoFools = chapter.id === "mission-03-city-walk";
  const manuscriptRomance =
    chapter.id === "chapter-4-proof-of-chemistry" ||
    chapter.id === "mission-04-end-of-summer" ||
    chapter.id === "chapter-5-chaos-but-ours" ||
    chapter.id === "trial-distance" ||
    chapter.id === "final-mission-oath" ||
    chapter.id === "epilogue-after-oath";
  const epilogueMediaDeck = epilogueAfterOath ? [chapter.heroMedia, ...chapter.supportingMedia] : [];
  const finalMissionMediaSequence = finalMissionOath
    ? [chapter.heroMedia, ...chapter.supportingMedia].sort((a, b) => getFinalMissionOrder(a.src) - getFinalMissionOrder(b.src))
    : [];
  const finalMissionAutoScroll = finalMissionMediaSequence.length > 1;
  const chaosWinterMedia = chaosButOursWinter ? [chapter.heroMedia, ...chapter.supportingMedia] : [];
  const chaosWinterColumns = chaosButOursWinter
    ? Array.from({ length: 4 }, (_, columnIndex) => chaosWinterMedia.filter((_, mediaIndex) => mediaIndex % 4 === columnIndex))
    : [];
  const burningPage = (mission || rider || proposal) && !sideQuestAdventure;
  const arcanePulse = psy || rune || fae;

  const [proposalUnlocked, setProposalUnlocked] = useState(!proposal);
  const [finalMissionSlideIndex, setFinalMissionSlideIndex] = useState(0);
  const [epilogueDanceIndex, setEpilogueDanceIndex] = useState(0);
  const [epilogueDanceFinished, setEpilogueDanceFinished] = useState(false);
  const [epilogueIncendioOn, setEpilogueIncendioOn] = useState(false);
  const [dragonSweep, setDragonSweep] = useState(false);
  const [missionStampPulse, setMissionStampPulse] = useState(false);
  const [fateThreadActive, setFateThreadActive] = useState(false);
  const [rainBurstActive, setRainBurstActive] = useState(false);
  const [rainBurstId, setRainBurstId] = useState(0);
  const [psyNetBoost, setPsyNetBoost] = useState(false);
  const [psyDebugBoost, setPsyDebugBoost] = useState(false);
  const [psyHandshakeFlash, setPsyHandshakeFlash] = useState(false);
  const [psyPackBlendActive, setPsyPackBlendActive] = useState(false);
  const [bondPulseTick, setBondPulseTick] = useState(0);
  const [bondPulseFast, setBondPulseFast] = useState(false);
  const [mindWebPulseTick, setMindWebPulseTick] = useState(0);
  const [mindWebBrighten, setMindWebBrighten] = useState(false);
  const [worldOfHerDragonFireActive, setWorldOfHerDragonFireActive] = useState(false);
  const [worldOfHerDragonFireTick, setWorldOfHerDragonFireTick] = useState(0);
  const [cityWalkOrbitActive, setCityWalkOrbitActive] = useState(false);
  const [sideQuestHover, setSideQuestHover] = useState(false);
  const [sideQuestBladeTick, setSideQuestBladeTick] = useState(0);
  const [sideQuestTabOpen, setSideQuestTabOpen] = useState(false);
  const [sideQuestInkWriteTick, setSideQuestInkWriteTick] = useState(0);
  const [sideQuestDaggerHover, setSideQuestDaggerHover] = useState(false);
  const [sideQuestPawPulseTick, setSideQuestPawPulseTick] = useState(0);
  const [sideQuestTigerEyeGlint, setSideQuestTigerEyeGlint] = useState(false);
  const [candleRevelioUnlocked, setCandleRevelioUnlocked] = useState(false);
  const [candleInkSequenceTick, setCandleInkSequenceTick] = useState(0);
  const [candleInkDustActive, setCandleInkDustActive] = useState(false);
  const [candleTailDustActive, setCandleTailDustActive] = useState(false);
  const [candleDustTick, setCandleDustTick] = useState(0);
  const [candleFireflyStage, setCandleFireflyStage] = useState<"idle" | "swirl" | "form" | "disperse" | "reduced">("idle");
  const [candleFireflyTick, setCandleFireflyTick] = useState(0);
  const [candleShortFirefly, setCandleShortFirefly] = useState(false);
  const [entryTick, setEntryTick] = useState(0);
  const rainBurstTimeoutRef = useRef<number | null>(null);
  const psyNetBoostTimeoutRef = useRef<number | null>(null);
  const psyHandshakeTimeoutRef = useRef<number | null>(null);
  const psyPackBlendTimeoutRef = useRef<number | null>(null);
  const mindWebBrightenTimeoutRef = useRef<number | null>(null);
  const worldOfHerDragonTimeoutRef = useRef<number | null>(null);
  const sideQuestTigerGlintTimeoutRef = useRef<number | null>(null);
  const candleSequencePlayedRef = useRef(false);
  const candleQuoteInkDoneForTickRef = useRef<number>(-1);
  const candleTimersRef = useRef<number[]>([]);
  const wasActive = useRef(false);
  const psyIntensity = psyDebugBoost ? 1.35 : 1;
  const candleRevealLocked = candlelightCollage && !candleRevelioUnlocked;

  useEffect(() => {
    if (active && !wasActive.current) {
      setEntryTick((prev) => prev + 1);
      if (proposal) setDragonSweep(true);
      if (mission) setMissionStampPulse(true);
      if (reservationLiePsy) {
        setPsyHandshakeFlash(true);
        setBondPulseFast(false);
        setBondPulseTick((prev) => prev + 1);
        if (psyHandshakeTimeoutRef.current) {
          window.clearTimeout(psyHandshakeTimeoutRef.current);
        }
        psyHandshakeTimeoutRef.current = window.setTimeout(() => setPsyHandshakeFlash(false), 400);
      }
      const t1 = window.setTimeout(() => setDragonSweep(false), 2400);
      const t2 = window.setTimeout(() => setMissionStampPulse(false), 1100);
      wasActive.current = true;
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        if (psyHandshakeTimeoutRef.current) {
          window.clearTimeout(psyHandshakeTimeoutRef.current);
        }
      };
    }
    if (!active) {
      wasActive.current = false;
    }
  }, [active, mission, proposal, reservationLiePsy]);

  useEffect(() => {
    if (!active) {
      setFateThreadActive(false);
      setSideQuestHover(false);
      setSideQuestDaggerHover(false);
      setSideQuestTabOpen(false);
      setSideQuestTigerEyeGlint(false);
    }
  }, [active]);

  useEffect(() => {
    if (!finalMissionOath) return;
    if (finalMissionMediaSequence.length === 0) {
      setFinalMissionSlideIndex(0);
      return;
    }
    setFinalMissionSlideIndex((prev) => Math.min(prev, finalMissionMediaSequence.length - 1));
  }, [finalMissionMediaSequence.length, finalMissionOath]);

  useEffect(() => {
    if (!finalMissionOath || !active || !finalMissionAutoScroll) return;
    const interval = window.setInterval(() => {
      setFinalMissionSlideIndex((prev) => (prev + 1) % finalMissionMediaSequence.length);
    }, reduceMotion ? 4200 : 3200);
    return () => window.clearInterval(interval);
  }, [active, finalMissionAutoScroll, finalMissionMediaSequence.length, finalMissionOath, reduceMotion]);

  useEffect(() => {
    if (!epilogueAfterOath) return;
    if (epilogueMediaDeck.length === 0) {
      setEpilogueDanceIndex(0);
      setEpilogueDanceFinished(false);
      return;
    }
    setEpilogueDanceIndex((prev) => Math.min(prev, epilogueMediaDeck.length - 1));
  }, [epilogueAfterOath, epilogueMediaDeck.length]);

  useEffect(() => {
    if (!epilogueAfterOath) return;
    if (!active) {
      setEpilogueIncendioOn(false);
      return;
    }
    setEpilogueDanceFinished(false);
  }, [active, epilogueAfterOath, epilogueDanceIndex]);

  useEffect(() => {
    if (!reservationLiePsy || !active || !missionStampPulse) return;
    setBondPulseFast(false);
    setBondPulseTick((prev) => prev + 1);
    triggerMindWebPulse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, missionStampPulse, reservationLiePsy]);

  useEffect(() => {
    if (!reservationLiePsy) return;
    const params = new URLSearchParams(window.location.search);
    setPsyDebugBoost(params.get("psy") === "1");
  }, [reservationLiePsy]);

  useEffect(() => {
    return () => {
      if (rainBurstTimeoutRef.current) {
        window.clearTimeout(rainBurstTimeoutRef.current);
      }
      if (psyNetBoostTimeoutRef.current) {
        window.clearTimeout(psyNetBoostTimeoutRef.current);
      }
      if (psyHandshakeTimeoutRef.current) {
        window.clearTimeout(psyHandshakeTimeoutRef.current);
      }
      if (psyPackBlendTimeoutRef.current) {
        window.clearTimeout(psyPackBlendTimeoutRef.current);
      }
      if (mindWebBrightenTimeoutRef.current) {
        window.clearTimeout(mindWebBrightenTimeoutRef.current);
      }
      if (worldOfHerDragonTimeoutRef.current) {
        window.clearTimeout(worldOfHerDragonTimeoutRef.current);
      }
      if (sideQuestTigerGlintTimeoutRef.current) {
        window.clearTimeout(sideQuestTigerGlintTimeoutRef.current);
      }
      candleTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      candleTimersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!candlelightCollage) return;
    if (active && !candleSequencePlayedRef.current) {
      candleSequencePlayedRef.current = true;
      candleQuoteInkDoneForTickRef.current = -1;
      setCandleRevelioUnlocked(false);
      setCandleInkDustActive(false);
      setCandleTailDustActive(false);
      setCandleFireflyStage("idle");
      setCandleShortFirefly(false);
    }
    if (!active) {
      candleSequencePlayedRef.current = false;
      candleQuoteInkDoneForTickRef.current = -1;
      candleTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      candleTimersRef.current = [];
      setCandleRevelioUnlocked(false);
      setCandleInkDustActive(false);
      setCandleTailDustActive(false);
      setCandleFireflyStage("idle");
      setCandleShortFirefly(false);
    }
  }, [active, candlelightCollage]);

  useEffect(() => {
    if (!cityWalkOrbit) return;
    if (active) {
      setCityWalkOrbitActive(true);
    }
  }, [active, cityWalkOrbit]);

  const triggerRainBurst = () => {
    if (!firstEncounterCinema) return;
    if (rainBurstTimeoutRef.current) {
      window.clearTimeout(rainBurstTimeoutRef.current);
    }
    setRainBurstId((prev) => prev + 1);
    setRainBurstActive(true);
    rainBurstTimeoutRef.current = window.setTimeout(() => {
      setRainBurstActive(false);
    }, 2300);
  };

  const triggerMindWebPulse = () => {
    if (!reservationLiePsy) return;
    if (mindWebBrightenTimeoutRef.current) {
      window.clearTimeout(mindWebBrightenTimeoutRef.current);
    }
    setMindWebPulseTick((prev) => prev + 1);
    setMindWebBrighten(true);
    mindWebBrightenTimeoutRef.current = window.setTimeout(() => setMindWebBrighten(false), 300);
  };

  const triggerWorldOfHerDragonFire = () => {
    if (!worldOfHerCollage) return;
    if (worldOfHerDragonTimeoutRef.current) {
      window.clearTimeout(worldOfHerDragonTimeoutRef.current);
    }
    dispatchCodexAudio({ action: "sfx", src: dragonRoarEffectSrc, intensity: 1 });
    setWorldOfHerDragonFireTick((prev) => prev + 1);
    setWorldOfHerDragonFireActive(true);
    worldOfHerDragonTimeoutRef.current = window.setTimeout(() => setWorldOfHerDragonFireActive(false), 7600);
  };

  const triggerPsyNetBoost = () => {
    if (!reservationLiePsy) return;
    if (psyNetBoostTimeoutRef.current) {
      window.clearTimeout(psyNetBoostTimeoutRef.current);
    }
    setBondPulseFast(true);
    setBondPulseTick((prev) => prev + 1);
    triggerMindWebPulse();
    setPsyNetBoost(true);
    psyNetBoostTimeoutRef.current = window.setTimeout(() => setPsyNetBoost(false), 300);
  };

  const triggerPsyPackBlend = () => {
    if (!reservationLiePsy) return;
    if (psyPackBlendTimeoutRef.current) {
      window.clearTimeout(psyPackBlendTimeoutRef.current);
    }
    setPsyPackBlendActive(true);
    psyPackBlendTimeoutRef.current = window.setTimeout(() => setPsyPackBlendActive(false), 1000);
  };

  const clearCandleTimers = () => {
    candleTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    candleTimersRef.current = [];
  };

  const goToFinalMissionSlide = (target: number) => {
    if (finalMissionMediaSequence.length === 0) return;
    const normalized = ((target % finalMissionMediaSequence.length) + finalMissionMediaSequence.length) % finalMissionMediaSequence.length;
    setFinalMissionSlideIndex(normalized);
  };

  const goToNextFinalMissionSlide = () => {
    goToFinalMissionSlide(finalMissionSlideIndex + 1);
  };

  const goToPrevFinalMissionSlide = () => {
    goToFinalMissionSlide(finalMissionSlideIndex - 1);
  };

  const goToEpilogueDance = (target: number) => {
    if (epilogueMediaDeck.length === 0) return;
    const normalized = ((target % epilogueMediaDeck.length) + epilogueMediaDeck.length) % epilogueMediaDeck.length;
    setEpilogueDanceIndex(normalized);
    setEpilogueDanceFinished(false);
  };

  const goToNextEpilogueDance = () => {
    goToEpilogueDance(epilogueDanceIndex + 1);
  };

  const triggerCandleRevelio = () => {
    if (!candlelightCollage) return;
    dispatchCodexAudio({ action: "track", src: publicTrackSrc, label: "PUBLIC", intensity: 0.64 });
    clearCandleTimers();
    candleQuoteInkDoneForTickRef.current = -1;
    setCandleRevelioUnlocked(true);
    setCandleInkDustActive(false);
    setCandleTailDustActive(false);
    setCandleFireflyStage("idle");
    setCandleShortFirefly(false);
    setCandleInkSequenceTick((prev) => prev + 1);
  };

  const triggerCandleFireflyBurst = (shortVersion = false) => {
    if (!candlelightCollage) return;
    clearCandleTimers();
    setCandleShortFirefly(shortVersion);
    setCandleFireflyTick((prev) => prev + 1);

    if (reduceMotion) {
      setCandleInkDustActive(true);
      setCandleTailDustActive(false);
      setCandleFireflyStage("reduced");
      candleTimersRef.current.push(
        window.setTimeout(() => setCandleInkDustActive(false), 200),
        window.setTimeout(() => setCandleFireflyStage("idle"), 420)
      );
      return;
    }

    if (!shortVersion) {
      setCandleTailDustActive(true);
      setCandleDustTick((prev) => prev + 1);
      setCandleInkDustActive(true);
      candleTimersRef.current.push(
        window.setTimeout(() => {
          setCandleInkDustActive(false);
          setCandleTailDustActive(false);
          setCandleFireflyStage("swirl");
        }, 980),
        window.setTimeout(() => setCandleFireflyStage("form"), 1680),
        window.setTimeout(() => setCandleFireflyStage("disperse"), 2480),
        window.setTimeout(() => setCandleFireflyStage("idle"), 3400)
      );
      return;
    }

    setCandleFireflyStage("swirl");
    candleTimersRef.current.push(
      window.setTimeout(() => setCandleFireflyStage("form"), 380),
      window.setTimeout(() => setCandleFireflyStage("disperse"), 940),
      window.setTimeout(() => setCandleFireflyStage("idle"), 1520)
    );
  };

  const handleCandleQuoteInkDone = () => {
    if (!candlelightCollage || !active || !candleRevelioUnlocked) return;
    if (candleQuoteInkDoneForTickRef.current === candleInkSequenceTick) return;
    candleQuoteInkDoneForTickRef.current = candleInkSequenceTick;
    triggerCandleFireflyBurst(false);
  };

  const triggerSideQuestTigerMarker = () => {
    if (!sideQuestAdventure) return;
    if (sideQuestTigerGlintTimeoutRef.current) {
      window.clearTimeout(sideQuestTigerGlintTimeoutRef.current);
    }
    setSideQuestPawPulseTick((prev) => prev + 1);
    setSideQuestTigerEyeGlint(true);
    sideQuestTigerGlintTimeoutRef.current = window.setTimeout(() => setSideQuestTigerEyeGlint(false), 300);
  };

  const toggleSideQuestDaggerTab = () => {
    if (!sideQuestAdventure) return;
    setSideQuestBladeTick((prev) => prev + 1);
    if (!sideQuestTabOpen) {
      setSideQuestInkWriteTick((prev) => prev + 1);
    }
    setSideQuestTabOpen((prev) => !prev);
  };

  const triggerChapterFourRevealTrack = () => {
    if (!proofChemistryLab) return;
    dispatchCodexAudio({ action: "track", src: elvisTrackSrc, label: "Elvis Presley", intensity: 0.62 });
  };

  const lockProposalOath = () => {
    dispatchCodexAudio({ action: "track", src: taioTrackSrc, label: "Taio Cruz", intensity: 0.7 });
    setProposalUnlocked(true);
  };

  const triggerEpilogueIncendio = () => {
    if (!epilogueAfterOath) return;
    dispatchCodexAudio({ action: "track", src: alexWarrenTrackSrc, label: "Alex Warren", intensity: 0.72 });
    setEpilogueIncendioOn(true);
  };

  const quoteWords = chapter.quoteLine.split(" ");
  const candleTailWordCount = Math.max(4, Math.min(8, 6));
  const candleQuoteLead = candlelightCollage ? quoteWords.slice(0, Math.max(0, quoteWords.length - candleTailWordCount)).join(" ") : chapter.quoteLine;
  const candleQuoteTail = candlelightCollage ? quoteWords.slice(Math.max(0, quoteWords.length - candleTailWordCount)).join(" ") : "";

  return (
    <section id={chapter.id} ref={sectionRef} className="relative flex min-h-screen items-center px-4 py-20 sm:px-8 lg:px-14">
      {dragonSweep ? <div className="pointer-events-none absolute inset-y-0 left-[-20%] z-[2] h-40 w-[70%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.45),transparent_68%)] blur-md animate-dragonSweep" /> : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35" />
      {sideQuestAdventure ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_25%_35%,rgba(128,189,255,0.14)_0_26px,rgba(128,189,255,0.02)_26px_52px,transparent_52px_82px)] mix-blend-screen"
            animate={reduceMotion ? undefined : { x: ["-2%", "2%", "-2%"], y: ["0%", "1.5%", "0%"], opacity: [0.12, 0.2, 0.12] }}
            transition={reduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 bg-[linear-gradient(115deg,rgba(56,93,148,0.12),transparent_40%,rgba(253,211,132,0.08)_72%,transparent)]"
            animate={reduceMotion ? undefined : { x: ["-3%", "3%", "-3%"], opacity: [0.18, 0.3, 0.18] }}
            transition={reduceMotion ? undefined : { duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {Array.from({ length: sideQuestSaltSprayCount }).map((_, i) => (
            <motion.span
              key={`sidequest-salt-spray-${i}`}
              className="absolute h-[3px] w-[3px] rounded-full bg-sky-100/80"
              style={{ left: `${8 + i * 8.6}%`, bottom: `${4 + (i % 4) * 3}%` }}
              animate={reduceMotion ? { opacity: [0, 0.35, 0] } : { y: [0, -44 - (i % 4) * 14], x: [0, 6 - (i % 3) * 4], opacity: [0, 0.45, 0] }}
              transition={{ duration: reduceMotion ? 0.2 : 3.8 + (i % 4) * 0.5, repeat: reduceMotion ? 0 : Infinity, delay: i * 0.45, ease: "easeOut" }}
            />
          ))}
        </div>
      ) : null}
      {reservationLiePsy ? (
        <>
          <motion.div
            key={`psy-dim-${entryTick}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: psyHandshakeFlash ? [0, 0.1, 0] : 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.4, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 z-[1] bg-black"
          />
          <div className="pointer-events-none absolute inset-0 z-[2] mix-blend-screen">
            <motion.svg viewBox="0 0 1200 820" className="h-full w-full [filter:drop-shadow(0_0_10px_rgba(132,209,255,0.26))]" fill="none">
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? (psyNetBoost ? 0.92 : 0.74 * psyIntensity) : 0.18 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.25, ease: "easeOut" }}
              >
                <motion.g
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: active ? 1 : 0.35,
                    opacity: active ? (psyNetBoost ? 1 : 0.86 * psyIntensity) : 0.2
                  }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.6, delay: reduceMotion ? 0 : 0.22, ease: "easeInOut" }}
                  stroke={`rgba(156,214,255,${0.12 * psyIntensity})`}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                >
                  <path d="M104 112 L236 152 L340 102 L486 170 L646 124 L812 188 L962 146 L1090 214" />
                  <path d="M130 318 L258 272 L398 338 L560 286 L716 332 L900 286 L1048 348" />
                  <path d="M236 152 L258 272 L398 338 L486 170 L560 286 L646 124 L716 332 L812 188 L900 286 L962 146" />
                </motion.g>

                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: active ? (psyNetBoost ? 1 : 0.9 * psyIntensity) : 0.2 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.25, delay: reduceMotion ? 0 : 0.05, ease: "easeOut" }}
                  fill={`rgba(188,231,255,${0.16 * psyIntensity})`}
                >
                  <circle cx="104" cy="112" r="2.6" />
                  <circle cx="236" cy="152" r="3" />
                  <circle cx="340" cy="102" r="2.8" />
                  <circle cx="486" cy="170" r="3.4" />
                  <circle cx="646" cy="124" r="3.1" />
                  <circle cx="812" cy="188" r="3.2" />
                  <circle cx="962" cy="146" r="2.9" />
                  <circle cx="1090" cy="214" r="2.8" />
                  <circle cx="130" cy="318" r="2.8" />
                  <circle cx="258" cy="272" r="3.1" />
                  <circle cx="398" cy="338" r="3.3" />
                  <circle cx="560" cy="286" r="3.6" />
                  <circle cx="716" cy="332" r="3.3" />
                  <circle cx="900" cy="286" r="3.1" />
                  <circle cx="1048" cy="348" r="2.9" />
                </motion.g>
              </motion.g>

              {active && !reduceMotion ? (
                <motion.circle
                  key={`psynet-handshake-ripple-${entryTick}`}
                  cx="600"
                  cy="250"
                  r="18"
                  stroke="rgba(163,220,255,0.72)"
                  strokeWidth="1.4"
                  initial={{ r: 18, opacity: 0.8 }}
                  animate={{ r: 220, opacity: 0 }}
                  transition={{ duration: 1.2, delay: 0.25, ease: "easeOut" }}
                />
              ) : null}

              <motion.path
                d="M534 146 C590 126, 654 144, 708 176"
                stroke="rgba(255,183,138,0.9)"
                strokeWidth="1.4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  active
                    ? {
                        pathLength: missionStampPulse ? [0, 1, 1] : 1,
                        opacity: missionStampPulse ? [0, 0.95, 0.28] : 0.24
                      }
                    : { pathLength: 0.2, opacity: 0.1 }
                }
                transition={{ duration: reduceMotion ? 0.01 : 0.7, ease: "easeInOut" }}
              />
              <motion.circle
                cx="534"
                cy="146"
                r="5.2"
                fill="rgba(148,228,255,0.96)"
                animate={{ opacity: active ? [0.45, 0.95, 0.45] : 0.2 }}
                transition={{ duration: reduceMotion ? 0.01 : 1.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
              />
              <motion.circle
                cx="708"
                cy="176"
                r="5.2"
                fill="rgba(255,198,148,0.96)"
                animate={{ opacity: active ? [0.45, 0.95, 0.45] : 0.2 }}
                transition={{ duration: reduceMotion ? 0.01 : 1.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut", delay: 0.22 }}
              />
              {!reduceMotion ? (
                <motion.circle
                  key={`bond-pulse-${bondPulseTick}`}
                  r={bondPulseFast ? 4.2 : 3.5}
                  fill="rgba(255,228,187,0.96)"
                  initial={{ cx: 534, cy: 146, opacity: 0 }}
                  animate={{ cx: [534, 594, 654, 708], cy: [146, 138, 154, 176], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: bondPulseFast ? 0.45 : 0.9, delay: 0.05, ease: "easeInOut" }}
                />
              ) : null}
            </motion.svg>
            {psyNetBoost ? <div className="absolute inset-0 bg-cyan-200/10 [filter:blur(1px)]" /> : null}
            {psyDebugBoost ? (
              <div className="absolute inset-[8%] border border-cyan-300/45 bg-cyan-100/[0.02]">
                <span className="absolute left-2 top-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/80">psy overlay bounds</span>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
      {firstEncounterCinema ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,182,93,0.16),transparent_36%),radial-gradient(circle_at_84%_14%,rgba(108,182,255,0.14),transparent_32%)]" />
          <motion.div
            animate={{ x: ["-38%", "48%", "-38%"], opacity: [0.08, 0.28, 0.08] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-40 top-[12%] h-[62%] w-[86%] bg-[linear-gradient(74deg,rgba(255,245,215,0.32),rgba(255,245,215,0.02)_60%,transparent)] blur-2xl"
          />
          <div className="absolute inset-0 opacity-35 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)] [background-size:100%_4px]" />
        </div>
      ) : null}

      {psy ? (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(90deg,rgba(89,173,255,0.18)_1px,transparent_1px),linear-gradient(0deg,rgba(89,173,255,0.18)_1px,transparent_1px)] [background-size:38px_38px]" />
          <motion.div
            key={`psy-${entryTick}`}
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x: "120%", opacity: [0, 0.45, 0] }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-100/22 to-transparent"
          />
          <motion.div
            key={`bond-mark-${entryTick}`}
            initial={{ scale: 0.7, opacity: 0.2 }}
            animate={{ scale: [0.7, 1.15, 1], opacity: [0.15, 0.55, 0.28] }}
            transition={{ duration: 1.3, ease: "easeOut" }}
            className="pointer-events-none absolute left-[12%] top-[22%] h-16 w-16 rounded-full border border-orange-200/40 bg-[radial-gradient(circle,rgba(255,173,130,0.4),rgba(255,173,130,0)_70%)]"
          />
          <motion.div
            key={`pack-shadows-${entryTick}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0.05, 0.18, 0] }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="pointer-events-none absolute right-[8%] top-[25%] h-24 w-44 rounded-[100%] bg-black/40 blur-lg"
          />
        </>
      ) : null}

      {fae ? (
        <>
          <motion.div
            key={`portal-${entryTick}`}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: [0, 0.35, 0.16], scale: [0.88, 1.06, 1] }}
            transition={{ duration: 2 }}
            className="pointer-events-none absolute right-[8%] top-[18%] h-56 w-56 rounded-full border border-cyan-200/35 bg-[radial-gradient(circle,rgba(88,244,255,0.3),rgba(22,31,52,0)_68%)]"
          />
          <div className="pointer-events-none absolute inset-0 animate-realmShift bg-[linear-gradient(120deg,rgba(255,176,137,0.06),transparent_45%,rgba(132,177,255,0.1))]" />
        </>
      ) : null}

      {legacy ? (
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <SigilSet.GlyphSigil className="absolute left-[6%] top-[64%] h-20 w-20 text-cyan-100/10 animate-glyphRotate" />
          <SigilSet.GlyphSigil className="absolute right-[8%] top-[22%] h-16 w-16 text-cyan-100/10 animate-glyphRotate [animation-direction:reverse]" />
        </div>
      ) : null}

      {isPrologue ? (
        <motion.svg viewBox="0 0 1200 500" className="pointer-events-none absolute inset-0 z-[2] hidden h-full w-full lg:block" fill="none">
          <motion.path
            d="M1060 170 C920 140, 780 140, 660 188 C560 225, 450 220, 340 190 C270 170, 210 168, 145 195"
            stroke="url(#fate-thread)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: fateThreadActive ? 1 : 0, opacity: fateThreadActive ? 0.85 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="fate-thread" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(138,210,255,0.9)" />
              <stop offset="52%" stopColor="rgba(255,201,126,0.95)" />
              <stop offset="100%" stopColor="rgba(138,210,255,0.9)" />
            </linearGradient>
          </defs>
        </motion.svg>
      ) : null}

      <div className="relative z-[3] mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-2">
        {reservationLiePsy ? (
          <div className="pointer-events-none absolute inset-0 z-[8]">
            <motion.svg
              viewBox="0 0 1200 760"
              className="h-full w-full [mix-blend-mode:screen] [filter:drop-shadow(0_0_8px_rgba(145,218,255,0.45))]"
              fill="none"
            >
              <motion.g
                animate={{ opacity: active ? (mindWebBrighten ? 1 : 0.86) : 0.7 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.3, ease: "easeOut" }}
              >
                <motion.g
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                  animate={
                    reduceMotion
                      ? { pathLength: 1, opacity: 1 }
                      : { pathLength: active ? 1 : 0.45, opacity: active ? 1 : 0.35 }
                  }
                  transition={{ duration: reduceMotion ? 0.01 : 0.82, ease: "easeInOut" }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.2}
                  stroke="rgba(166,221,255,0.14)"
                >
                  <path d="M210 126 L320 178 L436 132 L562 184 L690 148 L820 188 L930 126" />
                  <path d="M180 286 L302 238 L458 286 L618 242 L782 292 L944 246" />
                  <path d="M320 178 L302 238 L458 286 L562 184 L618 242 L690 148 L782 292 L820 188 L944 246" />
                </motion.g>

                <motion.g
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: active ? 1 : 0.45 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.25, ease: "easeOut" }}
                  fill="rgba(192,232,255,0.18)"
                >
                  <circle cx="180" cy="286" r="2.6" />
                  <circle cx="302" cy="238" r="2.8" />
                  <circle cx="320" cy="178" r="2.7" />
                  <circle cx="436" cy="132" r="2.8" />
                  <circle cx="458" cy="286" r="2.9" />
                  <circle cx="562" cy="184" r="3.1" />
                  <circle cx="618" cy="242" r="3" />
                  <circle cx="690" cy="148" r="3.1" />
                  <circle cx="782" cy="292" r="2.9" />
                  <circle cx="820" cy="188" r="2.9" />
                  <circle cx="944" cy="246" r="2.8" />
                </motion.g>

                <motion.circle
                  cx="210"
                  cy="126"
                  r="4"
                  fill="rgba(160,229,255,0.24)"
                  animate={{ opacity: active ? [0.7, 1, 0.7] : 0.35 }}
                  transition={{ duration: reduceMotion ? 0.01 : 1.6, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="930"
                  cy="126"
                  r="4"
                  fill="rgba(255,200,152,0.24)"
                  animate={{ opacity: active ? [0.7, 1, 0.7] : 0.35 }}
                  transition={{ duration: reduceMotion ? 0.01 : 1.6, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut", delay: 0.25 }}
                />

                {!reduceMotion && active ? (
                  <motion.circle
                    key={`mind-web-enter-ripple-${entryTick}`}
                    cx="570"
                    cy="190"
                    r="24"
                    stroke="rgba(177,228,255,0.55)"
                    strokeWidth="1.2"
                    initial={{ r: 24, opacity: 0.8 }}
                    animate={{ r: 230, opacity: 0 }}
                    transition={{ duration: 1.2, delay: 0.18, ease: "easeOut" }}
                  />
                ) : null}

                {!reduceMotion ? (
                  <motion.circle
                    key={`mind-web-line-pulse-${mindWebPulseTick}`}
                    r="3.6"
                    fill="rgba(255,234,192,0.95)"
                    initial={{ cx: 210, cy: 126, opacity: 0 }}
                    animate={{ cx: [210, 320, 436, 562, 690, 820, 930], cy: [126, 178, 132, 184, 148, 188, 126], opacity: [0, 1, 1, 1, 1, 1, 0] }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                ) : null}
              </motion.g>
            </motion.svg>
            {psyDebugBoost ? (
              <div className="absolute inset-0 border border-cyan-300/50">
                <span className="absolute left-2 top-1 rounded bg-cyan-950/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/80">
                  psy mind web
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
        {candlelightCollage ? (
          <div className="pointer-events-none absolute inset-0 z-[16] overflow-hidden">
            {candleInkDustActive
              ? Array.from({ length: candleShortFirefly ? 24 : candleDustParticleCount }).map((_, i) => {
                  const startX = 20 + (i % 12) * 1.5 + ((i * 7) % 5) * 0.35;
                  const startY = 56 + (i % 6) * 0.9 + ((i * 5) % 3) * 0.28;
                  const midX = 49 + (i % 7) * 0.9;
                  const midY = 40 + ((i * 3) % 8) * 0.55;
                  const targetX = candleCollageAnchor.x + ((i % 10) - 5) * 0.34;
                  const targetY = candleCollageAnchor.y + ((i % 8) - 4) * 0.3;
                  return (
                    <motion.span
                      key={`candle-ink-dust-${candleDustTick}-${i}`}
                      className="absolute h-[4px] w-[4px] rounded-full bg-amber-100 [filter:drop-shadow(0_0_10px_rgba(255,214,150,0.85))]"
                      style={{ left: `${startX}%`, top: `${startY}%` }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={
                        reduceMotion
                          ? { opacity: [0, 0.38, 0], scale: [0.7, 1, 0.5] }
                          : {
                              left: [`${startX}%`, `${midX}%`, `${targetX}%`],
                              top: [`${startY}%`, `${midY}%`, `${targetY}%`],
                              opacity: [0, 0.45, 0],
                              scale: [0.55, 1.1, 0.45]
                            }
                      }
                      transition={{ duration: reduceMotion ? 0.2 : 1.05, delay: i * 0.012, ease: "easeInOut" }}
                    />
                  );
                })
              : null}

            {candleFireflyStage !== "idle"
              ? Array.from({ length: candleFireflyCount }).map((_, i) => {
                  const heart = candleHeartOffsets[i];
                  const edge = candleEdgeOffsets[i % candleEdgeOffsets.length];
                  const swirlX = Math.sin(i * 0.72) * (34 + (i % 5) * 3);
                  const swirlY = Math.cos(i * 0.58) * (26 + (i % 4) * 4);
                  const scatterX = ((i * 17) % 58) - 29;
                  const scatterY = ((i * 11) % 46) - 23;
                  return (
                    <motion.span
                      key={`candle-firefly-${candleFireflyTick}-${i}`}
                      className="absolute h-[5px] w-[5px] rounded-full bg-amber-100 [filter:drop-shadow(0_0_8px_rgba(255,218,145,0.95))]"
                      style={{ left: `${candleCollageAnchor.x}%`, top: `${candleCollageAnchor.y}%` }}
                      initial={{ x: scatterX, y: scatterY, opacity: 0, scale: 0.55 }}
                      animate={
                        candleFireflyStage === "reduced"
                          ? { x: heart.x, y: heart.y, opacity: [0, 0.72, 0], scale: [0.72, 0.98, 0.6] }
                          : candleFireflyStage === "swirl"
                            ? {
                                x: [scatterX, swirlX, heart.x],
                                y: [scatterY, swirlY, heart.y],
                                opacity: [0, 0.92, 0.88],
                                scale: [0.55, 1.1, 0.95]
                              }
                            : candleFireflyStage === "form"
                              ? {
                                  x: heart.x,
                                  y: heart.y,
                                  opacity: [0.82, 1, 0.82],
                                  scale: [0.95, 1.18, 0.95]
                                }
                              : {
                                  x: [heart.x, edge.x + ((i % 3) - 1) * 10],
                                  y: [heart.y, edge.y + ((i % 4) - 1.5) * 8],
                                  opacity: [0.9, 0],
                                  scale: [1, 0.35]
                                }
                      }
                      transition={{
                        duration:
                          candleFireflyStage === "reduced"
                            ? 0.35
                            : candleFireflyStage === "swirl"
                              ? (candleShortFirefly ? 0.38 : 0.72)
                              : candleFireflyStage === "form"
                                ? (candleShortFirefly ? 0.5 : 0.8)
                                : (candleShortFirefly ? 0.58 : 0.95),
                        delay: candleFireflyStage === "form" ? i * 0.008 : i * 0.01,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })
              : null}

            {candleFireflyStage === "form" ? (
              <motion.div
                key={`candle-heart-glow-${candleFireflyTick}`}
                className="absolute h-40 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,224,164,0.22),rgba(255,224,164,0)_72%)]"
                style={{ left: `${candleCollageAnchor.x}%`, top: `${candleCollageAnchor.y}%` }}
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: [0, 0.95, 0.42], scale: [0.82, 1.1, 0.94] }}
                transition={{ duration: reduceMotion ? 0.2 : 0.8, ease: "easeInOut" }}
              />
            ) : null}
          </div>
        ) : null}
        <article
          className={cn(
            "relative overflow-hidden rounded-2xl border border-gold/25 bg-[linear-gradient(155deg,rgba(246,233,204,0.97),rgba(225,205,171,0.95))] p-6 text-ink shadow-[0_24px_60px_rgba(0,0,0,0.35)]",
            active && "animate-pageBreath",
            isPrologue && "lg:min-h-[66vh] lg:p-8",
            firstEncounterCinema && "border-amber-800/40 bg-[linear-gradient(160deg,rgba(246,231,199,0.97),rgba(232,202,154,0.92))] pt-20",
            reservationLiePsy && "border-cyan-300/25 bg-[linear-gradient(155deg,rgba(246,233,204,0.93),rgba(225,205,171,0.9))]",
            sideQuestAdventure && "border-[#9c8a68]/55 pt-7 text-[#20170f] shadow-[0_28px_70px_rgba(0,0,0,0.42)]"
          )}
          onMouseEnter={sideQuestAdventure ? () => setSideQuestHover(true) : undefined}
          onMouseLeave={sideQuestAdventure ? () => setSideQuestHover(false) : undefined}
          style={
            sideQuestAdventure
              ? {
                  backgroundImage: `url("${withBasePath("/ui/scroll-paper.png")}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat"
                }
              : undefined
          }
        >
          <div className={cn("pointer-events-none absolute inset-0", sideQuestAdventure ? "opacity-15" : "opacity-35")} style={{ backgroundImage: getTagWatermark(chapter.tags[0]) }} />
          <div className="pointer-events-none absolute bottom-5 right-4 hidden text-ink/[0.07] sm:block">{tagIcon(chapter.tags[0], "h-32 w-32")}</div>
          {sideQuestAdventure ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,30,46,0.08),transparent_35%,rgba(21,33,51,0.07)_70%,rgba(17,24,38,0.12))]" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(25,48,78,0.08)_0_1px,transparent_1px_28px),repeating-linear-gradient(90deg,rgba(25,48,78,0.06)_0_1px,transparent_1px_34px)]" />
              <motion.svg viewBox="0 0 1000 1200" className="absolute inset-0 h-full w-full text-[#1d4167]/40" fill="none">
                <path d="M52 206 C180 162, 272 236, 408 194 C536 158, 664 208, 760 190 C840 176, 912 144, 960 148" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M84 544 C214 492, 292 560, 420 528 C540 496, 646 556, 776 516 C860 490, 922 474, 968 482" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
                <path d="M72 890 C182 840, 300 920, 410 872 C530 820, 662 906, 794 860 C878 832, 946 838, 980 856" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M118 306 C146 292, 174 288, 208 300 C178 318, 154 326, 124 320" stroke="currentColor" strokeWidth="0.95" />
                <path d="M226 654 C254 640, 282 636, 316 648 C286 666, 262 674, 232 668" stroke="currentColor" strokeWidth="0.95" />
                <path d="M360 964 C388 950, 418 946, 450 958 C422 978, 394 984, 366 978" stroke="currentColor" strokeWidth="0.95" />
              </motion.svg>

              <motion.svg viewBox="0 0 1000 1200" className="absolute inset-0 h-full w-full" fill="none">
                <motion.path
                  key={`sidequest-route-${entryTick}`}
                  d="M120 926 C168 886, 216 852, 268 820 C332 782, 386 742, 442 694 C506 642, 556 596, 618 558 C682 516, 734 474, 786 432 C826 400, 858 376, 882 360"
                  stroke="rgba(30,66,102,0.58)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="7 9"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: active ? 1 : 0.2, opacity: active ? 0.95 : 0.42 }}
                  transition={{ duration: reduceMotion ? 0.01 : 3.6, ease: "easeInOut" }}
                />
                <motion.path
                  d="M120 926 C168 886, 216 852, 268 820 C332 782, 386 742, 442 694 C506 642, 556 596, 618 558 C682 516, 734 474, 786 432 C826 400, 858 376, 882 360"
                  stroke="rgba(243,196,120,0.52)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeDasharray="7 9"
                  className="[filter:drop-shadow(0_0_4px_rgba(243,196,120,0.55))]"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: active ? 1 : 0.25, opacity: active ? 0.84 : 0.26 }}
                  transition={{ duration: reduceMotion ? 0.01 : 3.8, ease: "easeInOut" }}
                />
                <text x="108" y="972" fill="rgba(26,62,97,0.8)" fontSize="15" fontFamily="var(--font-space), monospace" letterSpacing="1.7">KAYAK LAUNCH</text>
                <text x="734" y="336" fill="rgba(26,62,97,0.88)" fontSize="15" fontFamily="var(--font-space), monospace" letterSpacing="1.7">TIGER PARK</text>
                <g transform="translate(882 360)">
                  <motion.path
                    d="M0 0 c12 -12 30 -12 42 0 c-5 12 -17 22 -21 22 c-4 0 -16 -10 -21 -22z"
                    fill="rgba(243,196,120,0.9)"
                    initial={{ opacity: 0.45, scale: 0.86 }}
                    animate={{ opacity: sideQuestPawPulseTick ? [0.5, 1, 0.72] : [0.42, 0.68, 0.42], scale: sideQuestPawPulseTick ? [0.86, 1.16, 1] : [0.92, 1.02, 0.92] }}
                    transition={{ duration: sideQuestPawPulseTick ? 0.4 : 2.4, repeat: sideQuestPawPulseTick ? 0 : Infinity, ease: "easeInOut" }}
                  />
                  <circle cx="6" cy="-5" r="5" fill="rgba(243,196,120,0.86)" />
                  <circle cx="16" cy="-11" r="5" fill="rgba(243,196,120,0.86)" />
                  <circle cx="28" cy="-11" r="5" fill="rgba(243,196,120,0.86)" />
                  <circle cx="38" cy="-5" r="5" fill="rgba(243,196,120,0.86)" />
                </g>
              </motion.svg>

              {sideQuestTigerEyeGlint ? (
                <motion.span
                  key={`sidequest-tiger-eye-glint-${sideQuestPawPulseTick}`}
                  className="absolute right-[7.8rem] top-[18.4rem] h-[2px] w-16 bg-[linear-gradient(90deg,rgba(255,228,171,0),rgba(255,228,171,0.96),rgba(255,228,171,0))]"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: [0, 1, 0], x: [-8, 14, 26] }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.3, ease: "easeOut" }}
                />
              ) : null}

              {Array.from({ length: sideQuestInkFleckCount }).map((_, i) => (
                <motion.span
                  key={`sidequest-route-fleck-${entryTick}-${i}`}
                  className="absolute h-[3px] w-[3px] rounded-full bg-[#244d7a]/70"
                  style={{ left: `${24 + i * 6.3}%`, top: `${74 - i * 4.2}%` }}
                  animate={reduceMotion ? { opacity: [0.25, 0.45, 0.25] } : { y: [0, -8 - (i % 3) * 4, 0], x: [0, 4 - (i % 3) * 2, 0], opacity: [0.2, 0.68, 0.22] }}
                  transition={{ duration: reduceMotion ? 0.2 : 2.2 + (i % 3) * 0.34, repeat: reduceMotion ? 0 : Infinity, delay: 0.35 + i * 0.11, ease: "easeInOut" }}
                />
              ))}

              <motion.div
                className="absolute right-12 top-20 h-24 w-24 rounded-full border border-[#23426b]/35 bg-[radial-gradient(circle,rgba(31,66,104,0.06),rgba(31,66,104,0)_70%)]"
                animate={{ opacity: active ? [0.45, 0.75, 0.45] : 0.35 }}
                transition={{ duration: reduceMotion ? 0.01 : 3.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
              >
                <svg viewBox="0 0 120 120" className="h-full w-full text-[#203e63]/45" fill="none">
                  <circle cx="60" cy="60" r="47" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M60 14v18M60 88v18M14 60h18M88 60h18M30 30l12 12M78 78l12 12M90 30L78 42M42 78L30 90" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
                <motion.span
                  className="absolute left-1/2 top-1/2 h-[2px] w-16 origin-left bg-[linear-gradient(90deg,rgba(243,196,120,0.92),rgba(243,196,120,0.25))]"
                  style={{ transformOrigin: "0% 50%" }}
                  animate={{ rotate: active ? (sideQuestHover ? [26, 58, 34] : [-16, 46, 22, 30]) : -18 }}
                  transition={{ duration: reduceMotion ? 0.01 : sideQuestHover ? 0.75 : 3.6, ease: "easeInOut" }}
                />
              </motion.div>

              <div className="absolute left-16 top-16 h-20 w-20 rounded-tl-2xl border-l-2 border-t-2 border-[#876c42]/45" />
              <div className="absolute right-16 top-16 h-20 w-20 rounded-tr-2xl border-r-2 border-t-2 border-[#876c42]/45" />
              <svg viewBox="0 0 240 90" className="absolute left-10 top-14 h-10 w-44 text-[#7c6240]/45" fill="none">
                <path d="M10 70 C44 18, 78 18, 112 70 C146 18, 180 18, 214 70" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>

              <svg viewBox="0 0 360 220" className="absolute left-8 top-16 h-28 w-44 text-[#4e2b1f]/15" fill="none">
                <path d="M84 28 L180 156 M180 28 L84 156" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
                <path d="M86 160 L58 196 M178 160 L206 196" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
              </svg>

              <svg viewBox="0 0 140 120" className="absolute right-36 top-8 h-10 w-10 text-[#7b1f1f]/50" fill="none">
                <path d="M70 14 L82 34 L104 36 L88 52 L92 74 L70 62 L48 74 L52 52 L36 36 L58 34 Z" fill="currentColor" />
              </svg>

              <motion.svg viewBox="0 0 300 120" className="absolute bottom-10 left-14 h-10 w-44 text-[#1f3f63]/55" fill="none" animate={reduceMotion ? undefined : { x: [0, 24, 0] }} transition={reduceMotion ? undefined : { duration: 7.2, repeat: Infinity, ease: "easeInOut" }}>
                <path d="M18 78 H280 L236 106 H72 Z" fill="currentColor" fillOpacity="0.28" />
                <path d="M118 30 L118 78 M118 30 L188 56 L118 56 Z" fill="currentColor" fillOpacity="0.38" />
              </motion.svg>

              {sideQuestBladeTick > 0 ? (
                <motion.div
                  key={`sidequest-blade-glint-${sideQuestBladeTick}`}
                  className="absolute -left-[10%] top-[66%] h-7 w-[72%] -rotate-[14deg] bg-[linear-gradient(90deg,rgba(214,236,255,0),rgba(214,236,255,0.95),rgba(242,199,122,0.68),rgba(214,236,255,0))] mix-blend-screen"
                  initial={{ x: "-40%", opacity: 0 }}
                  animate={{ x: "240%", opacity: [0, 1, 0.15, 0] }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.42, ease: "easeOut" }}
                />
              ) : null}
              <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(73,57,34,0.26),inset_0_0_52px_rgba(20,14,9,0.14)]" />
            </div>
          ) : null}
          {worldOfHerCollage && worldOfHerDragonFireActive ? (
            <div className="pointer-events-none absolute inset-0 z-[24] overflow-hidden rounded-2xl">
              <motion.div
                key={`paper-burn-blackout-${worldOfHerDragonFireTick}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0.74, 0.68, 0.52, 0.3, 0.08, 0] }}
                transition={{ duration: reduceMotion ? 0.01 : 7.2, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_86%_40%,rgba(255,114,54,0.98),transparent_34%),radial-gradient(circle_at_74%_24%,rgba(255,204,136,0.82),transparent_28%),radial-gradient(circle_at_24%_82%,rgba(255,138,72,0.6),transparent_54%),linear-gradient(180deg,rgba(26,10,6,0.35),rgba(20,8,5,0.56)_46%,rgba(11,4,3,0.72))]"
              />
              <motion.div
                key={`paper-burn-sweep-${worldOfHerDragonFireTick}`}
                initial={{ x: "102%", opacity: 0 }}
                animate={{ x: ["102%", "-48%"], opacity: [0, 1, 0.92, 0.64, 0.25, 0] }}
                transition={{ duration: reduceMotion ? 0.01 : 2.2, ease: "easeInOut" }}
                className="absolute top-[20%] h-[56%] w-[110%] rotate-[-7deg] bg-[linear-gradient(90deg,rgba(255,116,61,0),rgba(255,134,74,0.98),rgba(255,236,186,0.98),rgba(255,123,66,0.78),rgba(255,116,61,0))] blur-[1.6px]"
              />
              <motion.div
                key={`paper-burn-flare-${worldOfHerDragonFireTick}`}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: [0, 1, 0.9, 0.58, 0.2, 0], scale: [0.88, 1.14, 1.04, 1] }}
                transition={{ duration: reduceMotion ? 0.01 : 2.4, ease: "easeOut" }}
                className="absolute right-[-14%] top-[10%] h-[74%] w-[72%] rounded-full bg-[radial-gradient(circle,rgba(255,224,157,0.98),rgba(255,128,66,0.78),rgba(255,80,43,0.36),rgba(255,80,43,0))] mix-blend-screen"
              />
              <motion.div
                key={`paper-burn-heat-glow-${worldOfHerDragonFireTick}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.85, 0.5, 0.75, 0.25, 0] }}
                transition={{ duration: reduceMotion ? 0.01 : 4.4, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_72%_36%,rgba(255,241,200,0.34),transparent_44%),radial-gradient(circle_at_48%_62%,rgba(255,131,68,0.3),transparent_46%)] [filter:blur(10px)]"
              />
              <div className="absolute inset-y-0 right-0 w-10 bg-[linear-gradient(to_bottom,rgba(255,235,173,0.98),rgba(255,116,57,0.78),rgba(54,18,10,0.54),transparent)] animate-fireEdge" />
              <div className="absolute inset-y-0 left-0 w-8 bg-[linear-gradient(to_bottom,rgba(255,223,164,0.9),rgba(255,104,54,0.58),rgba(43,15,9,0.42),transparent)] animate-fireEdge [animation-delay:0.22s]" />
              <div className="absolute inset-x-0 top-0 h-8 bg-[linear-gradient(to_right,rgba(255,172,95,0.86),rgba(255,242,196,0.98),rgba(255,172,95,0.86))] animate-fireEdge" />
              <div className="absolute inset-x-0 bottom-0 h-7 bg-[linear-gradient(to_right,rgba(255,165,90,0.84),rgba(255,236,180,0.96),rgba(255,165,90,0.84))] animate-fireEdge [animation-delay:0.16s]" />
              <motion.div
                key={`paper-char-${worldOfHerDragonFireTick}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.46, 0.78, 0.7, 0.55, 0.26, 0] }}
                transition={{ duration: reduceMotion ? 0.01 : 6.9, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_80%_38%,rgba(35,11,7,0.72),transparent_54%),radial-gradient(circle_at_20%_78%,rgba(34,11,7,0.6),transparent_52%),linear-gradient(180deg,rgba(16,6,4,0.2),rgba(12,5,3,0.46))] mix-blend-multiply"
              />
              <motion.div
                key={`paper-crack-mask-${worldOfHerDragonFireTick}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.55, 0.85, 0.65, 0.2, 0] }}
                transition={{ duration: reduceMotion ? 0.01 : 5.8, ease: "easeInOut" }}
                className="absolute inset-[3%] bg-[repeating-linear-gradient(155deg,rgba(255,242,205,0.2)_0_2px,rgba(32,12,8,0)_2px_18px)] mix-blend-overlay [filter:blur(0.4px)]"
              />
              <div className="absolute inset-0 border-[8px] border-orange-200/45 [mask-image:linear-gradient(transparent_5%,black_14%,black_86%,transparent_95%)] [filter:blur(1.3px)]" />
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.span
                  key={`edge-flame-top-${worldOfHerDragonFireTick}-${i}`}
                  className="absolute top-[-10px] block w-6 origin-bottom rounded-b-full bg-[linear-gradient(to_bottom,rgba(255,247,207,0.98),rgba(255,168,92,0.96),rgba(255,88,46,0.84),rgba(255,88,46,0))]"
                  style={{ left: `${(i * 3.5) % 100}%`, height: `${32 + (i % 5) * 9}px` }}
                  animate={{ y: [0, -10 - (i % 4) * 2, 0], opacity: [0.62, 1, 0.62], scaleY: [1, 1.28, 1] }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.72 + (i % 4) * 0.1, repeat: reduceMotion ? 0 : Infinity, delay: i * 0.05, ease: "easeInOut" }}
                />
              ))}
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.span
                  key={`edge-flame-bottom-${worldOfHerDragonFireTick}-${i}`}
                  className="absolute bottom-[-10px] block w-6 origin-top rounded-t-full bg-[linear-gradient(to_top,rgba(255,247,207,0.98),rgba(255,168,92,0.96),rgba(255,88,46,0.84),rgba(255,88,46,0))]"
                  style={{ left: `${(i * 3.7) % 100}%`, height: `${28 + (i % 5) * 8}px` }}
                  animate={{ y: [0, 10 + (i % 4) * 2, 0], opacity: [0.55, 1, 0.55], scaleY: [1, 1.24, 1] }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.74 + (i % 4) * 0.1, repeat: reduceMotion ? 0 : Infinity, delay: i * 0.045, ease: "easeInOut" }}
                />
              ))}
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.span
                  key={`edge-flame-right-${worldOfHerDragonFireTick}-${i}`}
                  className="absolute right-[-10px] block h-6 origin-left rounded-l-full bg-[linear-gradient(to_left,rgba(255,247,207,0.98),rgba(255,168,92,0.96),rgba(255,88,46,0.84),rgba(255,88,46,0))]"
                  style={{ top: `${(i * 5.8) % 100}%`, width: `${34 + (i % 5) * 10}px` }}
                  animate={{ x: [0, 11 + (i % 4) * 2, 0], opacity: [0.62, 1, 0.62], scaleX: [1, 1.26, 1] }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.7 + (i % 4) * 0.12, repeat: reduceMotion ? 0 : Infinity, delay: i * 0.06, ease: "easeInOut" }}
                />
              ))}
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.span
                  key={`edge-flame-left-${worldOfHerDragonFireTick}-${i}`}
                  className="absolute left-[-10px] block h-5 origin-right rounded-r-full bg-[linear-gradient(to_right,rgba(255,240,196,0.94),rgba(255,154,86,0.88),rgba(255,84,45,0.74),rgba(255,84,45,0))]"
                  style={{ top: `${(i * 7.2) % 100}%`, width: `${24 + (i % 4) * 8}px` }}
                  animate={{ x: [0, -9 - (i % 3) * 2, 0], opacity: [0.48, 0.9, 0.48], scaleX: [1, 1.2, 1] }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.82 + (i % 3) * 0.12, repeat: reduceMotion ? 0 : Infinity, delay: i * 0.065, ease: "easeInOut" }}
                />
              ))}
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.span
                  key={`paper-burn-smoke-${worldOfHerDragonFireTick}-${i}`}
                  className="absolute rounded-full bg-black/35 [filter:blur(8px)]"
                  style={{ right: `${6 + (i * 6.2) % 66}%`, top: `${12 + (i * 6.8) % 72}%`, width: `${38 + (i % 4) * 22}px`, height: `${20 + (i % 4) * 14}px` }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.75 }}
                  animate={{ opacity: [0, 0.3, 0.2, 0], x: [0, -18 - (i % 4) * 6], y: [0, -26 - (i % 3) * 8], scale: [0.75, 1.08, 1.2] }}
                  transition={{ duration: reduceMotion ? 0.01 : 2.1 + (i % 4) * 0.28, delay: i * 0.08, ease: "easeOut" }}
                />
              ))}
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.span
                  key={`paper-burn-ember-${worldOfHerDragonFireTick}-${i}`}
                  className="absolute h-[4px] w-[4px] rounded-full bg-orange-200/95"
                  style={{ left: `${4 + (i * 5.1) % 94}%`, top: `${18 + (i * 4.3) % 70}%` }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, -64 - (i % 5) * 14], x: [0, 5 - (i % 3) * 3], opacity: [0, 1, 0] }}
                  transition={{ duration: reduceMotion ? 0.01 : 1.4 + (i % 5) * 0.16, delay: i * 0.04, ease: "easeOut" }}
                />
              ))}
              <motion.div
                key={`paper-burn-last-flash-${worldOfHerDragonFireTick}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.35, 0.12, 0] }}
                transition={{ duration: reduceMotion ? 0.01 : 1.25, delay: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_66%_38%,rgba(255,245,214,0.84),rgba(255,245,214,0)_58%)] mix-blend-screen"
              />
            </div>
          ) : null}
          {candleRevealLocked ? (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-[40] flex items-center justify-center rounded-2xl bg-[linear-gradient(155deg,rgba(246,233,204,0.995),rgba(225,205,171,0.995))]"
            >
              <div className="relative flex w-full max-w-md flex-col items-center gap-4 px-8 text-center">
                <motion.div
                  className="pointer-events-none absolute -top-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,225,168,0.42),rgba(255,225,168,0))]"
                  animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 2.2, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/45">sealed page</p>
                <button
                  type="button"
                  onClick={triggerCandleRevelio}
                  className="relative overflow-hidden rounded-lg border border-amber-900/35 bg-[linear-gradient(155deg,rgba(42,24,12,0.9),rgba(65,34,14,0.88))] px-6 py-2 font-mono text-[11px] uppercase tracking-[0.28em] text-amber-100 shadow-[0_0_24px_rgba(255,178,96,0.28)] transition hover:scale-[1.02]"
                >
                  <motion.span
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 rotate-[10deg] bg-gradient-to-r from-transparent via-amber-100/35 to-transparent"
                    animate={{ x: ["0%", "260%"] }}
                    transition={{ duration: 1.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                  />
                  revelio
                </button>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">tap to awaken enchanted ink</p>
              </div>
            </motion.div>
          ) : null}
          {reservationLiePsy ? (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-5 top-5 h-8 w-8 border-l border-t border-cyan-500/35" />
              <div className="absolute right-5 top-5 h-8 w-8 border-r border-t border-cyan-500/35" />
              <div className="absolute bottom-5 left-5 h-8 w-8 border-b border-l border-cyan-500/35" />
              <div className="absolute bottom-5 right-5 h-8 w-8 border-b border-r border-cyan-500/35" />
              <motion.span
                className="absolute right-8 top-[7.5rem] h-2.5 w-2.5 rounded-full bg-cyan-200/90 [filter:drop-shadow(0_0_10px_rgba(160,229,255,0.8))]"
                animate={{ opacity: active ? [0.45, 0.9, 0.45] : 0.2 }}
                transition={{ duration: reduceMotion ? 0.01 : 1.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
              />
            </div>
          ) : null}
          {firstEncounterCinema ? (
            <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
              {Array.from({ length: 28 }).map((_, i) => (
                <motion.span
                  key={`page-rain-light-${i}`}
                  initial={{ y: -540, opacity: 0 }}
                  animate={{ y: [-80, 1300], opacity: [0, 0.82, 0.12, 0] }}
                  transition={{ duration: 1 + (i % 3) * 0.18, repeat: Infinity, delay: i * 0.06, ease: "linear" }}
                  className="absolute top-[-24%] h-14 w-[1.8px] bg-[linear-gradient(to_bottom,rgba(130,180,245,0),rgba(130,180,245,0.92),rgba(130,180,245,0))]"
                  style={{ left: `${2 + i * 3.6}%`, transform: "rotate(8deg)" }}
                />
              ))}
              {Array.from({ length: 18 }).map((_, i) => (
                <motion.span
                  key={`page-rain-deep-${i}`}
                  initial={{ y: -680, opacity: 0 }}
                  animate={{ y: [-120, 1320], opacity: [0, 0.45, 0.1, 0] }}
                  transition={{ duration: 0.82 + (i % 2) * 0.16, repeat: Infinity, delay: i * 0.07, ease: "linear" }}
                  className="absolute top-[-28%] h-16 w-[2.2px] bg-[linear-gradient(to_bottom,rgba(176,221,255,0),rgba(176,221,255,0.75),rgba(176,221,255,0))]"
                  style={{ left: `${1 + i * 5.4}%`, transform: "rotate(10deg)" }}
                />
              ))}
              {rainBurstActive
                ? Array.from({ length: 120 }).map((_, i) => (
                    <motion.span
                      key={`page-rain-burst-${rainBurstId}-${i}`}
                      initial={{ y: -700, opacity: 0 }}
                      animate={{ y: [-80, 1300], opacity: [0, 0.95, 0.3, 0] }}
                      transition={{ duration: 0.62 + (i % 4) * 0.14, repeat: 2, delay: i * 0.012, ease: "linear" }}
                      className="absolute top-[-30%] h-20 w-[2.8px] bg-[linear-gradient(to_bottom,rgba(169,214,255,0),rgba(169,214,255,1),rgba(169,214,255,0))]"
                      style={{ left: `${(i * 0.87) % 100}%`, transform: `rotate(${6 + (i % 6)}deg)` }}
                    />
                  ))
                : null}
              {rainBurstActive
                ? Array.from({ length: 64 }).map((_, i) => (
                    <motion.span
                      key={`page-rain-splash-${rainBurstId}-${i}`}
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: [0.2, 1.25, 0.45], opacity: [0, 0.85, 0] }}
                      transition={{ duration: 0.6, repeat: 2, delay: 0.14 + i * 0.018, ease: "easeOut" }}
                      className="absolute bottom-6 h-2 w-2 rounded-full bg-sky-300/80"
                      style={{ left: `${(i * 1.55) % 100}%` }}
                    />
                  ))
                : null}
              {rainBurstActive ? <div className="absolute inset-0 bg-sky-300/10 [filter:blur(2px)]" /> : null}
            </div>
          ) : null}
          {firstEncounterCinema ? (
            <>
              <div className="pointer-events-none absolute inset-x-4 top-3 z-[2] overflow-hidden rounded-xl border border-amber-900/25 bg-[linear-gradient(90deg,rgba(31,22,18,0.94),rgba(46,34,22,0.9),rgba(20,15,13,0.95))]">
                <motion.div
                  animate={{ x: ["-120%", "140%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-amber-100/30 to-transparent"
                />
                <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-2">
                  <span className="rounded border border-amber-100/35 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.24em] text-amber-100/80">ticket</span>
                  <p className="truncate font-mono text-[9px] uppercase tracking-[0.28em] text-amber-100/80">now showing: nobody 2</p>
                  <span className="rounded border border-amber-100/35 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.24em] text-amber-100/75">rainy night</span>
                </div>
              </div>
              <motion.div
                animate={{ x: ["-18%", "14%", "-18%"], opacity: [0.04, 0.24, 0.04] }}
                transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -left-24 top-12 h-40 w-[76%] bg-[linear-gradient(72deg,rgba(255,246,219,0.5),rgba(255,246,219,0)_78%)] blur-xl"
              />
              <div className="pointer-events-none absolute right-[3.75rem] top-20 h-[calc(100%-7rem)] w-px bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(60,38,18,0.3),rgba(0,0,0,0))]" />
            </>
          ) : null}
          {burningPage ? (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-y-0 left-0 w-2 bg-[linear-gradient(to_bottom,rgba(255,196,120,0.5),rgba(255,124,66,0.14),transparent)] animate-fireEdge" />
              <div className="absolute inset-y-0 right-0 w-2 bg-[linear-gradient(to_bottom,rgba(255,196,120,0.5),rgba(255,124,66,0.14),transparent)] animate-fireEdge [animation-delay:0.5s]" />
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[linear-gradient(to_right,transparent,rgba(255,156,79,0.2),transparent)] animate-fireEdge [animation-delay:0.2s]" />
            </div>
          ) : null}
          {arcanePulse && active ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-100/16 to-transparent animate-spellSweep" />
          ) : null}
          {legacy ? <SigilSet.GlyphSigil className="pointer-events-none absolute right-4 top-4 h-12 w-12 text-ink/15" /> : null}
          {rune ? <SigilSet.GearSigil className="pointer-events-none absolute bottom-4 right-4 h-12 w-12 text-ink/20 animate-gearSpin" /> : null}

          <div className={cn("relative flex items-start justify-between gap-4", sideQuestAdventure && "mx-auto mt-3 w-[92%]")}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/55">{chapter.dateLabel}</p>
              <h2
                className={cn(
                  "mt-2 flex items-center gap-2 bg-[linear-gradient(to_right,rgba(200,169,109,0.32),rgba(200,169,109,0.08))] bg-[length:0%_100%] bg-no-repeat font-display leading-tight",
                  !candlelightCollage && "animate-inkReveal",
                  candlelightCollage && "[text-shadow:0_0_14px_rgba(255,214,149,0.24)]",
                  isPrologue ? "text-5xl sm:text-6xl" : "text-4xl"
                )}
              >
                <span className="text-ink/80">{tagIcon(chapter.tags[0], "h-6 w-6")}</span>
                {candlelightCollage ? (
                  <span className="relative inline-block overflow-hidden">
                    <motion.span
                      key={`candle-title-ink-${candleInkSequenceTick}`}
                      initial={reduceMotion ? { opacity: 0.86 } : { clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
                      animate={reduceMotion ? { opacity: [0.86, 1] } : { clipPath: "inset(0 0% 0 0)", opacity: [0.4, 1] }}
                      transition={{ duration: reduceMotion ? 0.2 : 1.55, ease: "easeOut" }}
                      className="relative"
                    >
                      {chapter.chapterTitle}
                    </motion.span>
                    <motion.span
                      key={`candle-title-glow-${candleInkSequenceTick}`}
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[linear-gradient(90deg,rgba(255,220,152,0),rgba(255,220,152,0.88),rgba(255,220,152,0))]"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: [0, 0.9, 0.28] }}
                      transition={{ duration: reduceMotion ? 0.2 : 1.6, ease: "easeOut" }}
                    />
                  </span>
                ) : (
                  chapter.chapterTitle
                )}
              </h2>
              {firstEncounterCinema ? (
                <p className="mt-2 inline-flex items-center rounded border border-ink/20 bg-black/5 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/65">
                  now showing: nobody 2, starring us
                </p>
              ) : null}
              {firstEncounterCinema ? (
                <button
                  type="button"
                  onClick={triggerRainBurst}
                  className="mt-2 inline-flex items-center rounded border border-sky-700/35 bg-sky-200/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-sky-900 transition hover:bg-sky-200/35"
                >
                  Meteolojinx
                </button>
              ) : null}
              {cityWalkOrbit ? (
                <button
                  type="button"
                  onClick={() => setCityWalkOrbitActive((prev) => !prev)}
                  className="mt-2 inline-flex items-center rounded border border-amber-900/35 bg-amber-100/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-950 transition hover:bg-amber-100/60"
                >
                  {cityWalkOrbitActive ? "pause orbit" : "start orbit"}
                </button>
              ) : null}
              {active && !(worldOfHerCollage || candlelightCollage || sideQuestAdventure || missionTwoFools) ? (
                <motion.svg viewBox="0 0 460 60" fill="none" className="pointer-events-none mt-2 h-5 w-[220px] text-amber-700/40">
                  <motion.path
                    d="M4 44 C74 16, 132 58, 204 28 C248 10, 292 30, 456 22"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0.1 }}
                    animate={{ pathLength: 1, opacity: [0.1, 0.45, 0.25] }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                  />
                </motion.svg>
              ) : null}
            </div>
            <span className="rounded border border-ink/20 bg-black/5 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/65">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          {active
            ? Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={`rune-mote-${i}-${entryTick}`}
                  className="pointer-events-none absolute left-8 top-20 h-1.5 w-1.5 rounded-full bg-amber-700/40 animate-runeFloat"
                  style={{ left: `${2 + i * 8}%`, animationDelay: `${i * 0.14}s` }}
                />
              ))
            : null}
          {firstEncounterCinema && active
            ? Array.from({ length: 8 }).map((_, i) => (
                <motion.span
                  key={`cinema-spark-${i}-${entryTick}`}
                  initial={{ y: 10, opacity: 0, scale: 0.8 }}
                  animate={{ y: [-2, -18 - (i % 3) * 5, -2], opacity: [0, 0.7, 0], scale: [0.8, 1, 0.82] }}
                  transition={{ duration: 2.6 + (i % 2) * 0.4, repeat: Infinity, delay: i * 0.2 }}
                  className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-amber-300/80"
                  style={{ left: `${14 + i * 8}%`, top: `${18 + (i % 2) * 4}%` }}
                />
              ))
            : null}

          {isPrologue ? (
            <div className="relative mt-5 rounded-xl border border-gold/20 bg-[linear-gradient(150deg,rgba(230,210,176,0.4),rgba(218,188,140,0.14))] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55">Recovered Opening Script</p>
              <div className="mt-2 space-y-1 text-lg text-ink/85">
                <p>It didn&apos;t start with fireworks.</p>
                <p>It started with a simple spell.</p>
                <p>A hey.</p>
              </div>
            </div>
          ) : null}

          {mission ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1/2 -translate-x-full bg-gradient-to-r from-transparent via-cyan-100/22 to-transparent animate-shimmer" />
              <motion.div
                key={`stamp-${entryTick}`}
                initial={{ rotate: -14, scale: 0.7, opacity: 0 }}
                animate={{
                  rotate: -8,
                  scale: missionStampPulse ? [0.9, 1.05, 1] : 1,
                  opacity: active ? 0.9 : 0,
                  x: missionStampPulse ? [0, -1.5, 1.5, 0] : 0
                }}
                transition={{ duration: 0.5 }}
                className="absolute right-6 top-8 rounded border-2 border-red-800/65 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-red-900/85"
              >
                mission accepted
              </motion.div>
            </motion.div>
          ) : null}

          {fae ? (
            <div className="pointer-events-none absolute inset-0">
              <motion.div className="absolute inset-2 rounded-xl border border-emerald-500/25" initial={{ opacity: 0.2 }} animate={{ opacity: active ? 0.8 : 0.2 }} />
              <motion.div className="absolute left-3 top-3 h-10 w-20 border-l border-t border-emerald-500/30" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: active ? [0.6, 1.1, 1] : 0.7, opacity: active ? 1 : 0.35 }} />
              <motion.div className="absolute bottom-3 right-3 h-10 w-20 border-b border-r border-emerald-500/30" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: active ? [0.6, 1.1, 1] : 0.7, opacity: active ? 1 : 0.35 }} />
            </div>
          ) : null}

          {rune ? (
            <motion.svg
              viewBox="0 0 200 200"
              className="pointer-events-none absolute right-6 top-14 h-20 w-20 text-amber-700/35"
              fill="none"
            >
              <motion.circle
                cx="100"
                cy="100"
                r="70"
                stroke="currentColor"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0.1 }}
                animate={{ pathLength: active ? 1 : 0.2, opacity: active ? 0.6 : 0.2 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
              <motion.path
                d="M65 100h70M100 65v70M76 76l48 48M124 76l-48 48"
                stroke="currentColor"
                strokeWidth="1.2"
                initial={{ pathLength: 0, opacity: 0.1 }}
                animate={{ pathLength: active ? 1 : 0.25, opacity: active ? 0.55 : 0.15 }}
                transition={{ duration: 1.4, delay: 0.2 }}
              />
            </motion.svg>
          ) : null}

          {candlelightCollage ? (
            <div className={cn("relative mt-3 space-y-3 text-ink/90", sideQuestAdventure && "mx-auto w-[92%]")}>
              {chapter.bodyText.map((line, i) => (
                <motion.div
                  key={`candle-line-wrap-${candleInkSequenceTick}-${i}`}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.35, delay: reduceMotion ? 0 : 0.16 + i * 0.08, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-lg border border-gold/20 bg-[linear-gradient(165deg,rgba(244,230,199,0.48),rgba(236,219,182,0.24))] px-3 py-2.5"
                >
                  <motion.p
                    key={`candle-line-${candleInkSequenceTick}-${i}`}
                    initial={reduceMotion ? { opacity: 0.9 } : { clipPath: "inset(0 100% 0 0)", opacity: 0.35 }}
                    animate={reduceMotion ? { opacity: [0.9, 1] } : { clipPath: "inset(0 0% 0 0)", opacity: [0.35, 1] }}
                    transition={{ duration: reduceMotion ? 0.2 : 1.05, delay: reduceMotion ? 0 : 0.25 + i * 0.14, ease: "easeOut" }}
                    className="relative text-[1.01rem] leading-[1.74] text-ink/88 [text-shadow:0_0_8px_rgba(255,218,156,0.16)]"
                  >
                    {line}
                  </motion.p>
                  <motion.span
                    key={`candle-line-glow-${candleInkSequenceTick}-${i}`}
                    className="pointer-events-none absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 bg-[linear-gradient(90deg,rgba(255,214,145,0),rgba(255,214,145,0.52),rgba(255,214,145,0))]"
                    initial={{ x: "-120%", opacity: 0 }}
                    animate={{ x: "120%", opacity: [0, 0.62, 0] }}
                    transition={{ duration: reduceMotion ? 0.2 : 1.05, delay: reduceMotion ? 0 : 0.35 + i * 0.16, ease: "easeInOut" }}
                  />
                </motion.div>
              ))}
            </div>
          ) : worldOfHerCollage ? (
            <div className={cn("relative mt-3 space-y-3 text-ink/90", sideQuestAdventure && "mx-auto w-[92%]")}>
              {chapter.bodyText.map((line, i) => (
                <motion.article
                  key={`${chapter.id}-world-ledger-line-${i}`}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.34, delay: reduceMotion ? 0 : 0.14 + i * 0.07, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-lg border border-gold/22 bg-[linear-gradient(165deg,rgba(244,230,199,0.45),rgba(237,220,185,0.22))] px-3 py-2.5"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">{`entry ${String(i + 1).padStart(2, "0")}`}</span>
                    <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(67,47,29,0.2),rgba(67,47,29,0))]" />
                  </div>
                  <p className="relative text-[1.01rem] leading-[1.74] text-ink/88">{line}</p>
                  <motion.span
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={reduceMotion ? undefined : { x: ["0%", "340%"], opacity: [0, 0.45, 0] }}
                    transition={reduceMotion ? undefined : { duration: 2.6, ease: "easeInOut", delay: i * 0.45, repeat: Infinity, repeatDelay: 2.4 }}
                  />
                </motion.article>
              ))}
            </div>
          ) : reservationLiePsy ? (
            <div className={cn("relative mt-5 space-y-2 text-xl leading-relaxed text-ink/90", sideQuestAdventure && "mx-auto w-[92%]")}>
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: "easeOut" }}
                className="font-mono text-[1.03rem] tracking-[0.11em] text-slate-700/95"
              >
                {chapter.bodyText[0]}
              </motion.p>
              <div className="relative h-7 overflow-hidden">
                <span className="absolute left-0 top-3 block h-px w-full bg-sky-700/22" />
                <motion.span
                  className="absolute left-0 top-[11px] block h-[2px] origin-left bg-[linear-gradient(90deg,rgba(130,181,228,0.82),rgba(255,168,102,0.8),rgba(255,124,102,0.08))]"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.55, delay: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
                />
                {active && !reduceMotion ? (
                  <>
                    <motion.svg
                      key={`silence-crack-${entryTick}`}
                      viewBox="0 0 560 60"
                      className="absolute inset-x-0 top-[1px] h-6 w-full text-cyan-700/45"
                      fill="none"
                    >
                      <motion.path
                        d="M8 28 L74 24 L112 30 L168 20 L246 34 L302 22 L362 29 L420 19 L552 27"
                        stroke="currentColor"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 0.85, 0.25] }}
                        transition={{ duration: 0.52, delay: 0.36, ease: "easeInOut" }}
                      />
                    </motion.svg>
                    <motion.span
                      key={`mental-slip-${entryTick}`}
                      className="absolute left-[40%] top-[8px] h-[8px] w-24 bg-[linear-gradient(90deg,rgba(145,220,255,0),rgba(145,220,255,0.72),rgba(255,171,120,0.1))] blur-[0.6px]"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: [0, 0.92, 0], x: [-16, 14, -4] }}
                      transition={{ duration: 0.38, delay: 0.44, ease: "easeInOut" }}
                    />
                  </>
                ) : null}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.42, delay: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
                className="relative overflow-hidden rounded-md"
              >
                <motion.span
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_50%,rgba(255,190,140,0.28),transparent_62%)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: active ? [0, 0.75, 0.24] : 0 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.85, delay: reduceMotion ? 0 : 0.48, ease: "easeOut" }}
                />
                <p className="relative text-[1.12rem] text-ink/88">{chapter.bodyText[1]}</p>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.42, delay: reduceMotion ? 0 : 0.72, ease: "easeOut" }}
              >
                {chapter.bodyText[2]}
              </motion.p>
            </div>
          ) : sideQuestAdventure || missionTwoFools ? (
            <div className={cn("relative mt-2 space-y-2.5 text-ink/90", sideQuestAdventure && "mx-auto w-[92%]")}>
              {chapter.bodyText.map((line, i) => (
                <motion.div
                  key={`${chapter.id}-styled-line-${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.3, delay: reduceMotion ? 0 : i * 0.06, ease: "easeOut" }}
                  className="relative px-1"
                >
                  <p
                    className={cn(
                      "whitespace-pre-line text-[0.98rem] leading-[1.64]",
                      sideQuestAdventure
                        ? "text-[#2a1e13]/90 [text-shadow:0_0_6px_rgba(82,56,28,0.12)]"
                        : "text-ink/88 [text-shadow:0_0_6px_rgba(82,56,28,0.08)]",
                      i === 0 && "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[1.9rem] first-letter:leading-[1] first-letter:text-[#6b4a2d]"
                    )}
                  >
                    {line}
                  </p>
                  {i < chapter.bodyText.length - 1 ? (
                    <span className="mt-1.5 block h-px w-full bg-[linear-gradient(90deg,rgba(82,56,29,0.18),rgba(82,56,29,0.04),rgba(82,56,29,0.18))]" />
                  ) : null}
                </motion.div>
              ))}
            </div>
          ) : manuscriptRomance ? (
            <div className="relative mt-3 space-y-2.5 text-ink/90">
              {chapter.bodyText.map((line, i) => (
                <motion.p
                  key={`${chapter.id}-manuscript-line-${i}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.3, delay: reduceMotion ? 0 : i * 0.07, ease: "easeOut" }}
                  className={cn(
                    "whitespace-pre-line text-[1rem] leading-[1.63] text-ink/88",
                    i === 0 && "first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-[1.9rem] first-letter:leading-[1] first-letter:text-[#6a4729]"
                  )}
                >
                  {line}
                </motion.p>
              ))}
            </div>
          ) : (
            <div className={cn("relative mt-5 space-y-2 text-xl leading-relaxed text-ink/90", sideQuestAdventure && "mx-auto w-[92%]")}>
              {chapter.bodyText.map((line, i) => (
                <div key={line}>
                  <p>{line}</p>
                  {psy && i === 0 ? <span className="mt-2 block h-px w-24 bg-[linear-gradient(90deg,rgba(0,0,0,0),rgba(42,26,16,0.45),rgba(0,0,0,0))] animate-scratchFlicker" /> : null}
                </div>
              ))}
            </div>
          )}
          {firstEncounterCinema ? (
            <div className="relative mt-4 overflow-hidden rounded-xl border border-amber-900/20 bg-[linear-gradient(170deg,rgba(255,247,230,0.6),rgba(255,238,204,0.25))] p-3">
              <div className="pointer-events-none absolute inset-0 opacity-30 bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.03)_50%,transparent_100%)] [background-size:100%_6px]" />
              <div className="grid gap-2 sm:grid-cols-3">
                {firstEncounterScenes.map((scene, i) => (
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="relative overflow-hidden rounded-lg border border-amber-900/20 bg-black/[0.02] px-3 py-2"
                  >
                    <motion.div
                      animate={{ x: ["-110%", "120%"] }}
                      transition={{ duration: 2.3, repeat: Infinity, delay: i * 0.24, ease: "easeInOut" }}
                      className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-200/25 to-transparent"
                    />
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/60">{scene.label}</p>
                    <p className="mt-1 text-sm leading-snug text-ink/85">{scene.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : null}

          <blockquote
            className={cn(
              "relative mt-4 border-l-2 border-gold/45 pl-3 font-display italic text-ink/85",
              worldOfHerCollage || candlelightCollage
                ? "text-[1.45rem] leading-[1.3]"
                : sideQuestAdventure || missionTwoFools
                  ? "text-[1.85rem] leading-[1.22]"
                  : manuscriptRomance
                    ? "whitespace-pre-line text-[1.72rem] leading-[1.2]"
                    : "text-2xl",
              sideQuestAdventure && "mx-auto w-[92%]"
            )}
          >
            {candlelightCollage ? (
              <span className="relative inline-block overflow-hidden">
                <motion.span
                  key={`candle-quote-ink-${candleInkSequenceTick}`}
                  initial={reduceMotion ? { opacity: 0.88 } : { clipPath: "inset(0 100% 0 0)", opacity: 0.34 }}
                  animate={reduceMotion ? { opacity: [0.88, 1] } : { clipPath: "inset(0 0% 0 0)", opacity: [0.34, 1] }}
                  transition={{ duration: reduceMotion ? 0.2 : 1.75, delay: reduceMotion ? 0 : 3.45, ease: "easeOut" }}
                  onAnimationComplete={handleCandleQuoteInkDone}
                  className="relative [text-shadow:0_0_14px_rgba(255,214,149,0.25)]"
                >
                  {candleQuoteLead ? `${candleQuoteLead} ` : ""}
                  <motion.span
                    animate={
                      candleTailDustActive
                        ? { opacity: [1, 0.22, 0.95], textShadow: ["0 0 0 rgba(255,214,149,0)", "0 0 18px rgba(255,214,149,0.92)", "0 0 0 rgba(255,214,149,0)"] }
                        : { opacity: 1, textShadow: "0 0 0 rgba(255,214,149,0)" }
                    }
                    transition={{ duration: reduceMotion ? 0.2 : 0.92, ease: "easeInOut" }}
                  >
                    {candleQuoteTail}
                  </motion.span>
                </motion.span>
                <motion.span
                  key={`candle-quote-ink-glow-${candleInkSequenceTick}`}
                  className="pointer-events-none absolute left-0 right-0 top-1/2 h-12 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,222,166,0.28),rgba(255,222,166,0)_70%)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.86, 0.22] }}
                  transition={{ duration: reduceMotion ? 0.2 : 1.85, delay: reduceMotion ? 0 : 3.52, ease: "easeOut" }}
                />
              </span>
            ) : (
              chapter.quoteLine
            )}
            {ocean && !sideQuestAdventure ? <span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(111,187,255,0.2),transparent_72%)]" /> : null}
          </blockquote>
          <p className={cn("mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50", sideQuestAdventure && "mx-auto w-[92%]")}>{chapter.footnote}</p>
          {epilogueAfterOath ? (
            <button
              type="button"
              onClick={triggerEpilogueIncendio}
              className={cn(
                "mt-3 rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition",
                epilogueIncendioOn
                  ? "border-amber-700/55 bg-amber-200/25 text-amber-900"
                  : "border-ink/30 bg-black/10 text-ink/75 hover:bg-black/15"
              )}
            >
              Incendio
            </button>
          ) : null}

          {ocean && !sideQuestAdventure ? (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-[radial-gradient(ellipse_at_bottom,rgba(111,187,255,0.25),rgba(111,187,255,0)_70%)]" />
              <div className="pointer-events-none absolute inset-0 animate-lightningFlash bg-[radial-gradient(circle_at_30%_18%,rgba(214,244,255,0.32),transparent_32%)]" />
            </>
          ) : null}

          {assassin ? (
            <motion.svg viewBox="0 0 340 80" className="pointer-events-none mt-3 h-8 w-[220px] text-ink/45" fill="none">
              <motion.path
                d="M8 56 C68 10, 118 72, 198 30 C230 16, 268 30, 332 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{ pathLength: active ? 1 : 0.1, opacity: active ? 0.8 : 0.2 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </motion.svg>
          ) : null}

          {trial ? <CrackedLineReveal text="I stayed coz u were always worth the hard nights." className="mt-4" /> : null}
          {sideQuestAdventure && chapter.redactedLine ? (
            <div className="relative mx-auto mt-5 h-24 w-[92%]">
              <motion.div
                className="absolute right-4 top-1/2 h-[74px] w-[78%] -translate-y-1/2 origin-right overflow-hidden rounded-l-md rounded-r-lg border border-[#8b7249]/45 bg-[linear-gradient(160deg,rgba(235,220,185,0.95),rgba(220,197,156,0.92))] shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
                animate={sideQuestTabOpen ? { x: 0, opacity: 1, scaleX: 1 } : { x: 22, opacity: 0, scaleX: 0.05 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.42, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(175deg,rgba(112,89,56,0.14)_0_1px,transparent_1px_10px)]" />
                <div className="absolute left-0 top-0 h-[3px] w-full bg-[linear-gradient(90deg,transparent,rgba(140,109,67,0.7),transparent)]" />
                <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[linear-gradient(90deg,transparent,rgba(140,109,67,0.7),transparent)]" />
                <div className="relative px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#5a4228]/75">classified memo</p>
                  <motion.p
                    key={`sidequest-strip-ink-${sideQuestInkWriteTick}`}
                    initial={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 100% 0 0)", opacity: 0.35 }}
                    animate={sideQuestTabOpen ? (reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)", opacity: [0.35, 1] }) : { opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0.01 : 1.02, ease: "easeOut" }}
                    className="mt-1 font-mono text-[1rem] text-[#2d2115]"
                  >
                    {chapter.redactedLine}
                  </motion.p>
                </div>
              </motion.div>

              <div className="pointer-events-none absolute inset-y-[19px] right-0 w-4 rounded-l-lg bg-[linear-gradient(180deg,rgba(61,42,26,0.2),rgba(61,42,26,0.06),rgba(61,42,26,0.2))]" />
              <motion.button
                type="button"
                onClick={toggleSideQuestDaggerTab}
                onMouseEnter={() => setSideQuestDaggerHover(true)}
                onMouseLeave={() => setSideQuestDaggerHover(false)}
                className="absolute right-[-2px] top-1/2 z-[8] -translate-y-1/2 rounded-l-md border-0 bg-transparent p-1 shadow-none outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0"
                animate={{ x: sideQuestTabOpen ? 22 : 0 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: "easeInOut" }}
                aria-label={sideQuestTabOpen ? "Push dagger back" : "Pull dagger to reveal note"}
              >
                <motion.div
                  className="relative"
                  animate={reduceMotion ? undefined : (sideQuestDaggerHover ? { x: [0, 2, -2, 1, 0] } : undefined)}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <svg viewBox="0 0 120 60" className="h-11 w-16 text-[#7a838f]" fill="none">
                    <path d="M14 30 C24 16, 48 16, 58 30 C48 44, 24 44, 14 30 Z" fill="rgba(70,50,36,0.95)" />
                    <path d="M56 18 H88 C96 18 102 24 102 30 C102 36 96 42 88 42 H56" fill="rgba(116,124,135,0.95)" />
                    <path d="M64 24 H90 M64 36 H90" stroke="rgba(216,224,236,0.55)" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M14 30 H6" stroke="rgba(43,31,21,0.85)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {sideQuestDaggerHover ? (
                    <motion.span
                      key={`sidequest-dagger-glint-${sideQuestInkWriteTick}-${sideQuestTabOpen ? "open" : "closed"}`}
                      className="pointer-events-none absolute left-7 top-2 h-[2px] w-8 bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.95),rgba(255,255,255,0))]"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: [0, 1, 0], x: [-6, 8, 14] }}
                      transition={{ duration: reduceMotion ? 0.01 : 0.26, ease: "easeOut" }}
                    />
                  ) : null}
                </motion.div>
              </motion.button>
            </div>
          ) : chapter.redactedLine
            ? reservationLiePsy
              ? <PsyRevealLine className="mt-4" text={chapter.redactedLine} onReveal={triggerPsyNetBoost} />
              : candlelightCollage
                ? (
                    <div onClickCapture={() => (candleRevelioUnlocked ? triggerCandleFireflyBurst(true) : undefined)}>
                      <RedactionReveal className="mt-4" text={chapter.redactedLine} />
                    </div>
                  )
                : proofChemistryLab
                  ? <RedactionReveal className="mt-4" text={chapter.redactedLine} onReveal={triggerChapterFourRevealTrack} />
                : <RedactionReveal className="mt-4" text={chapter.redactedLine} />
            : null}
        </article>

        <aside
          className={cn(
            "relative overflow-hidden rounded-2xl border border-gold/25 bg-black/40 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.42)]",
            isPrologue && "lg:min-h-[66vh]",
            (worldOfHerCollage || candlelightCollage) && "self-start",
            firstEncounterCinema && "border-amber-200/35 bg-[linear-gradient(160deg,rgba(19,17,22,0.9),rgba(11,9,14,0.96))] p-5",
            reservationLiePsy && "border-cyan-200/28 bg-[linear-gradient(160deg,rgba(10,16,24,0.88),rgba(9,12,20,0.9))]"
          )}
        >
          {firstEncounterCinema ? (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute left-3 top-8 h-10 w-10 rounded-full border border-amber-100/35" />
              <span className="absolute left-3 top-8 h-10 w-10 rounded-full border border-amber-100/20 [mask-image:radial-gradient(circle,transparent_42%,black_44%)] animate-gearSpin" />
              <span className="absolute right-3 bottom-8 h-12 w-12 rounded-full border border-amber-100/35" />
              <span className="absolute right-3 bottom-8 h-12 w-12 rounded-full border border-amber-100/20 [mask-image:radial-gradient(circle,transparent_42%,black_44%)] animate-gearSpin [animation-direction:reverse]" />
              <div className="absolute inset-x-4 top-3 flex items-center justify-between">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={`cinema-bulb-top-${i}`} className="h-1.5 w-1.5 rounded-full bg-amber-200/85 animate-twinkle" style={{ animationDelay: `${i * 0.12}s` }} />
                ))}
              </div>
              <div className="absolute inset-x-4 bottom-3 flex items-center justify-between">
                {Array.from({ length: 14 }).map((_, i) => (
                  <span key={`cinema-bulb-bottom-${i}`} className="h-1.5 w-1.5 rounded-full bg-amber-200/75 animate-twinkle" style={{ animationDelay: `${0.7 + i * 0.12}s` }} />
                ))}
              </div>
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={`cinema-dust-${i}-${entryTick}`}
                  className="absolute bottom-[-1rem] h-[3px] w-[3px] rounded-full bg-orange-200/75 animate-dust"
                  style={{ left: `${8 + i * 10}%`, animationDelay: `${i * 0.16}s`, animationDuration: `${2.4 + (i % 3)}s` }}
                />
              ))}
            </div>
          ) : null}

          {proposal && !proposalUnlocked ? (
            <div className="absolute inset-0 z-20 grid place-items-center bg-black/65 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={lockProposalOath}
                className="rounded-xl border border-red-200/20 bg-red-950/50 px-6 py-5 text-center"
              >
                <WaxSeal label="Press to lock the oath" />
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-red-200/90">seal required</p>
              </button>
            </div>
          ) : null}

          <div className={proposal && !proposalUnlocked ? "blur-sm" : ""}>
            {isPrologue ? (
              <RecoveredDmArtifact
                active={active}
                avatarMedia={chapter.heroMedia}
                onFirstSignal={() => setFateThreadActive(true)}
              />
            ) : (
              <>
                {firstEncounterCinema ? (
                  <div className="relative">
                    <div className="mb-3 flex items-center justify-between rounded-lg border border-amber-200/35 bg-black/35 px-3 py-2">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/80">first date feature</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/65">nobody 2</p>
                    </div>
                    <MagicalMediaFrame
                      media={chapter.heroMedia}
                      className="h-[62vh] min-h-[22rem] rounded-[1.25rem] border-2 border-amber-200/45 ring-1 ring-amber-100/20"
                      priority={index < 2}
                    />
                  </div>
                ) : reservationLiePsy ? (
                  <div className="group/psy-pack relative" onMouseEnter={triggerPsyPackBlend}>
                    <MagicalMediaFrame media={chapter.heroMedia} className="h-[56vh] min-h-64" priority={index < 2} onVideoPlay={triggerPsyPackBlend} />
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                      <motion.div
                        className="absolute -inset-[1px] rounded-xl bg-[radial-gradient(circle_at_18%_22%,rgba(255,175,129,0.36),transparent_38%),radial-gradient(circle_at_82%_74%,rgba(145,214,255,0.34),transparent_37%)]"
                        animate={{ opacity: psyPackBlendActive ? [0.45, 0.92, 0.55] : [0.42, 0.62, 0.42] }}
                        transition={{ duration: reduceMotion ? 0.01 : 1.3, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-[repeating-linear-gradient(180deg,rgba(145,214,255,0.18)_0_2px,transparent_2px_12px)]"
                        animate={
                          psyPackBlendActive
                            ? { opacity: [0.25, 0.65, 0.3], backgroundSize: ["100% 12px", "100% 7px", "100% 12px"] }
                            : { opacity: 0.2, backgroundSize: "100% 12px" }
                        }
                        transition={{ duration: reduceMotion ? 0.01 : 1, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute inset-y-0 -left-1/3 w-1/3 rotate-[10deg] bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent"
                        animate={psyPackBlendActive ? { x: ["0%", "250%"], opacity: [0, 0.9, 0] } : { x: "-20%", opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0.01 : 1, ease: "easeInOut" }}
                      />
                      <motion.div className="absolute left-3 top-3 h-8 w-8 border-l border-t border-cyan-200/62" animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }} transition={{ duration: reduceMotion ? 0.01 : 2.2, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }} />
                      <motion.div className="absolute right-3 top-3 h-8 w-8 border-r border-t border-cyan-200/62" animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }} transition={{ duration: reduceMotion ? 0.01 : 2.2, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut", delay: 0.2 }} />
                      <motion.div className="absolute bottom-3 left-3 h-8 w-8 border-b border-l border-cyan-200/62" animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }} transition={{ duration: reduceMotion ? 0.01 : 2.2, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut", delay: 0.35 }} />
                      <motion.div className="absolute bottom-3 right-3 h-8 w-8 border-b border-r border-cyan-200/62" animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }} transition={{ duration: reduceMotion ? 0.01 : 2.2, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut", delay: 0.5 }} />
                      <motion.span
                        className="absolute left-8 top-14 h-2.5 w-2.5 rounded-full bg-amber-200/90 [filter:drop-shadow(0_0_10px_rgba(255,204,160,0.8))]"
                        animate={{ opacity: active ? [0.45, 0.95, 0.45] : 0.2 }}
                        transition={{ duration: reduceMotion ? 0.01 : 1.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                      />
                      <div
                        className={cn(
                          "absolute inset-0 rounded-xl bg-[linear-gradient(120deg,rgba(123,208,255,0.32),transparent_35%,rgba(255,164,116,0.34))] opacity-0 transition duration-300",
                          "group-hover/psy-pack:opacity-100",
                          psyPackBlendActive && "opacity-100"
                        )}
                      />
                    </div>
                  </div>
                ) : worldOfHerCollage ? (
                  <div className="relative rounded-xl border border-zinc-100/15 bg-black/20 p-2">
                    <div className="grid gap-2">
                      <div className="grid h-[52vh] min-h-[22rem] grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                        <div className="grid h-full grid-rows-[0.5fr_0.5fr] gap-2">
                          <button
                            type="button"
                            onClick={triggerWorldOfHerDragonFire}
                            className="group relative overflow-hidden rounded-xl border border-rose-200/25 bg-[linear-gradient(165deg,rgba(16,18,29,0.92),rgba(8,10,18,0.96))] p-2 text-left"
                          >
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_82%,rgba(255,153,97,0.16),transparent_55%),radial-gradient(circle_at_78%_24%,rgba(122,195,255,0.14),transparent_45%)]" />
                            <motion.div
                              animate={{ y: [0, -4, 0], rotate: [-0.6, 0.8, -0.6] }}
                              transition={{ duration: reduceMotion ? 0.01 : 3, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" }}
                              className="relative h-full w-full"
                            >
                              <MagicalMediaFrame media={worldOfHerDragonMedia} className="h-full w-full" fit="contain" />
                            </motion.div>
                            <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-rose-100/80">tiny dragon mode</p>
                            <span className="pointer-events-none absolute right-3 top-3 rounded border border-rose-200/35 bg-rose-950/40 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-rose-100/85 transition group-hover:bg-rose-900/50">
                              click dragon
                            </span>
                          </button>
                          <div className="relative overflow-hidden rounded-xl border border-zinc-100/12 bg-[linear-gradient(165deg,rgba(13,16,25,0.86),rgba(7,10,18,0.95))]">
                            <MagicalMediaFrame media={worldOfHerBaklavaMedia} className="h-full w-full" />
                            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_86%,rgba(255,147,84,0.18),transparent_56%),radial-gradient(circle_at_86%_18%,rgba(120,194,255,0.14),transparent_48%)]" />
                            <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/80">
                              our first baklava
                            </p>
                          </div>
                        </div>
                        <MagicalMediaFrame media={chapter.heroMedia} className="h-full" priority={index < 2} />
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {chapter.supportingMedia[0] ? (
                          <MagicalMediaFrame media={chapter.supportingMedia[0]} className="h-52 min-h-44" />
                        ) : null}
                        {chapter.supportingMedia[1] ? (
                          <MagicalMediaFrame media={chapter.supportingMedia[1]} className="h-52 min-h-44" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : candlelightCollage ? (
                  <div className="relative rounded-xl border border-zinc-100/20 bg-[linear-gradient(160deg,rgba(14,18,30,0.9),rgba(8,11,21,0.96))] p-2.5">
                    <div
                      className={cn(
                        "transition duration-700",
                        candleRevealLocked && "blur-[7px] saturate-0 brightness-[0.22] contrast-125"
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between rounded-lg border border-amber-100/20 bg-black/30 px-3 py-1.5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/75">candlelight collage</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/60">4 frames</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[chapter.heroMedia, ...chapter.supportingMedia].slice(0, 4).map((item, mediaIndex) => (
                          <div key={`${chapter.id}-candlelight-${item.src}`} className="aspect-square">
                            <MagicalMediaFrame
                              media={item}
                              className="h-full w-full"
                              priority={index < 2 && mediaIndex === 0}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {candleRevealLocked ? (
                      <div className="pointer-events-none absolute inset-2 z-[10] rounded-lg border border-amber-100/18 bg-[radial-gradient(circle_at_50%_35%,rgba(255,220,152,0.16),rgba(8,12,22,0.92)_60%)]">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,226,166,0.08)_0_1px,transparent_1px_18px)]" />
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
                          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-amber-100/75">memories veiled</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : cityWalkOrbit ? (
                  <div className="relative h-[72vh] min-h-[33rem] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_42%,rgba(95,152,232,0.2),rgba(8,12,22,0.95)_68%)]">
                    <div className="pointer-events-none absolute inset-0 bg-[repeating-radial-gradient(circle_at_50%_50%,rgba(156,202,255,0.1)_0_2px,transparent_2px_22px)]" />
                    <p className="pointer-events-none absolute left-1/2 top-3 z-[30] -translate-x-1/2 rounded border border-amber-100/20 bg-black/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/80">
                      city walk orbit
                    </p>

                    <motion.div
                      className="absolute inset-0 z-[20]"
                      animate={cityWalkOrbitActive && !reduceMotion ? { rotate: 360 } : { rotate: 0 }}
                      transition={cityWalkOrbitActive && !reduceMotion ? { duration: 22, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
                    >
                      {chapter.supportingMedia.slice(0, 5).map((item, orbitIndex) => {
                        const angle = ((orbitIndex * 72 - 90) * Math.PI) / 180;
                        const x = 50 + 33 * Math.cos(angle);
                        const y = 50 + 33 * Math.sin(angle);
                        return (
                          <div
                            key={`${chapter.id}-orbit-${item.src}`}
                            className="absolute z-[22] w-20 sm:w-24 md:w-28"
                            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                          >
                            <motion.div
                              animate={cityWalkOrbitActive && !reduceMotion ? { rotate: -360 } : { rotate: 0 }}
                              transition={cityWalkOrbitActive && !reduceMotion ? { duration: 22, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
                            >
                              <MagicalMediaFrame media={item} className="h-24 sm:h-28 md:h-32" />
                            </motion.div>
                          </div>
                        );
                      })}
                    </motion.div>

                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-[12] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/16" />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-[12] h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/20" />

                    <div className="absolute left-1/2 top-1/2 z-[14] h-[62%] w-[42%] min-h-[16rem] min-w-[12rem] max-w-[18rem] -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        className="h-full w-full"
                        animate={cityWalkOrbitActive ? { scale: [1, 1.015, 1], boxShadow: ["0 0 0 rgba(251,191,36,0.0)", "0 0 22px rgba(251,191,36,0.2)", "0 0 0 rgba(251,191,36,0.0)"] } : undefined}
                        transition={cityWalkOrbitActive && !reduceMotion ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" } : undefined}
                      >
                        <MagicalMediaFrame media={chapter.heroMedia} className="h-full rounded-[1.1rem] border border-amber-100/25" priority={index < 2} />
                      </motion.div>
                    </div>

                    {cityWalkOrbitActive ? (
                      <motion.span
                        className="pointer-events-none absolute left-1/2 top-16 z-[30] -translate-x-1/2 rounded border border-amber-100/20 bg-black/35 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-amber-100/75"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: [0, 0.85, 0], y: [4, 0, -3] }}
                        transition={{ duration: reduceMotion ? 0.01 : 1.6, ease: "easeOut" }}
                      >
                        orbit online
                      </motion.span>
                    ) : null}
                  </div>
                ) : proofChemistryLab ? (
                  <div className="relative rounded-xl border border-emerald-100/20 bg-[linear-gradient(155deg,rgba(8,16,28,0.92),rgba(8,18,22,0.95))] p-3">
                    <div className="mb-2 flex items-center justify-between rounded-lg border border-emerald-100/20 bg-black/30 px-3 py-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-100/80">chemistry reactor</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/65">proof mode</p>
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-emerald-100/15 bg-[radial-gradient(circle_at_28%_20%,rgba(111,255,197,0.16),transparent_38%),radial-gradient(circle_at_80%_74%,rgba(130,188,255,0.12),transparent_34%),linear-gradient(160deg,rgba(6,14,24,0.96),rgba(9,17,24,0.95))] p-2.5">
                      <div className="grid gap-2 md:grid-cols-[1.3fr_0.9fr]">
                        <div className="relative">
                          <motion.span
                            className="pointer-events-none absolute left-4 top-4 z-[10] h-2.5 w-2.5 rounded-full bg-emerald-200/95 [filter:drop-shadow(0_0_10px_rgba(111,255,197,0.8))]"
                            animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45], scale: [0.95, 1.2, 0.95] }}
                            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <motion.div
                            className="pointer-events-none absolute left-8 top-5 z-[9] h-[2px] w-[calc(100%-3rem)] bg-[linear-gradient(90deg,rgba(111,255,197,0.75),rgba(130,188,255,0.45),rgba(111,255,197,0.08))]"
                            animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5], scaleX: [0.94, 1, 0.94] }}
                            transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <MagicalMediaFrame media={chapter.heroMedia} className="h-[52vh] min-h-[20rem]" priority={index < 2} />
                        </div>
                        <div className="grid grid-rows-[0.58fr_0.42fr] gap-2">
                          {chapter.supportingMedia[0] ? (
                            <MagicalMediaFrame media={chapter.supportingMedia[0]} className="h-full min-h-[12rem]" />
                          ) : null}
                          <div className="grid grid-cols-2 gap-2">
                            {chapter.supportingMedia[1] ? <MagicalMediaFrame media={chapter.supportingMedia[1]} className="h-32 sm:h-36" /> : null}
                            {chapter.supportingMedia[2] ? <MagicalMediaFrame media={chapter.supportingMedia[2]} className="h-32 sm:h-36" /> : null}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {chapter.supportingMedia.slice(3, 6).map((item) => (
                          <motion.div
                            key={`${chapter.id}-chemistry-${item.src}`}
                            animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
                            transition={reduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <MagicalMediaFrame media={item} className="h-32 sm:h-36" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : endOfSummerMission ? (
                  <div className="relative rounded-xl border border-sky-100/25 bg-[linear-gradient(155deg,rgba(6,14,26,0.95),rgba(10,18,34,0.94))] p-2.5">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(255,203,140,0.2),transparent_32%),radial-gradient(circle_at_86%_88%,rgba(133,191,255,0.18),transparent_42%)]" />
                    <div className="mb-2 flex items-center justify-between rounded-lg border border-amber-100/20 bg-black/35 px-3 py-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-amber-100/82">end of summer reel</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-100/70">season cut</p>
                    </div>
                    <div className="relative grid h-[68vh] min-h-[32rem] gap-2 md:grid-cols-[1.15fr_0.85fr]">
                      <div className="relative h-full">
                        <div className="relative mx-auto h-full max-w-[26rem]">
                          <motion.div
                            animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                            transition={reduceMotion ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                            className="h-full"
                          >
                            <MagicalMediaFrame
                              media={chapter.heroMedia}
                              className="h-full rounded-[1.1rem] border border-amber-100/30 bg-black/45"
                              fit="contain"
                              mediaPosition="top"
                              priority={index < 2}
                            />
                          </motion.div>
                          <div className="pointer-events-none absolute inset-x-8 bottom-3 rounded border border-amber-100/25 bg-black/40 px-2 py-1 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-amber-100/80">
                            menu night
                          </div>
                        </div>
                      </div>
                      <div className="grid h-full min-h-0 grid-rows-[0.4fr_0.36fr_0.24fr] gap-2">
                        {chapter.supportingMedia[0] ? (
                          <motion.div
                            className="min-h-0"
                            animate={reduceMotion ? undefined : { x: [0, 2, 0] }}
                            transition={reduceMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <MagicalMediaFrame media={chapter.supportingMedia[0]} className="h-full min-h-0" fit="contain" mediaPosition="top" />
                          </motion.div>
                        ) : null}
                        {chapter.supportingMedia[1] ? (
                          <motion.div
                            className="min-h-0"
                            animate={reduceMotion ? undefined : { x: [0, -2, 0] }}
                            transition={reduceMotion ? undefined : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <MagicalMediaFrame media={chapter.supportingMedia[1]} className="h-full min-h-0" fit="contain" mediaPosition="center" />
                          </motion.div>
                        ) : null}
                        <div className="grid min-h-0 grid-cols-2 gap-2">
                          {chapter.supportingMedia[2] ? (
                            <motion.div
                              className="min-h-0"
                              animate={reduceMotion ? undefined : { rotate: [-1.2, 0.8, -1.2] }}
                              transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <MagicalMediaFrame media={chapter.supportingMedia[2]} className="h-full min-h-0" />
                            </motion.div>
                          ) : null}
                          {chapter.supportingMedia[3] ? (
                            <motion.div
                              className="min-h-0"
                              animate={reduceMotion ? undefined : { rotate: [1.2, -0.8, 1.2] }}
                              transition={reduceMotion ? undefined : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <MagicalMediaFrame media={chapter.supportingMedia[3]} className="h-full min-h-0" />
                            </motion.div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : chaosButOursWinter ? (
                  <div className="relative rounded-xl border border-cyan-100/20 bg-[linear-gradient(160deg,rgba(7,14,30,0.95),rgba(10,18,38,0.94))] p-2.5">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(132,190,255,0.18),transparent_32%),radial-gradient(circle_at_84%_86%,rgba(255,194,140,0.18),transparent_36%)]" />
                    <div className="mb-2 flex items-center justify-between rounded-lg border border-cyan-100/20 bg-black/35 px-3 py-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-100/82">winter tiktok board</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/75">{chaosWinterMedia.length} poses</p>
                    </div>
                    <div className="relative h-[72vh] min-h-[34rem] overflow-hidden rounded-xl border border-cyan-100/14 bg-black/22 p-2">
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_10%,transparent_90%,rgba(255,255,255,0.06)_100%)]" />
                      <div className="relative grid h-full grid-cols-2 gap-2 md:grid-cols-4">
                        {chaosWinterColumns.map((column, columnIndex) => {
                          const lane = [...column, ...column];
                          return (
                            <div key={`${chapter.id}-lane-${columnIndex}`} className="relative overflow-hidden rounded-lg border border-cyan-100/12 bg-black/25 p-1">
                              <motion.div
                                className="space-y-2"
                                animate={
                                  reduceMotion
                                    ? undefined
                                    : columnIndex % 2 === 0
                                      ? { y: ["0%", "-50%"] }
                                      : { y: ["-50%", "0%"] }
                                }
                                transition={reduceMotion ? undefined : { duration: 22 + columnIndex * 3, repeat: Infinity, ease: "linear" }}
                              >
                                {lane.map((item, laneIndex) => (
                                  <motion.div
                                    key={`${chapter.id}-pose-${columnIndex}-${laneIndex}-${item.src}`}
                                    animate={reduceMotion ? undefined : { y: [0, laneIndex % 2 === 0 ? -2 : 2, 0], rotate: [0, laneIndex % 2 === 0 ? -0.45 : 0.45, 0] }}
                                    transition={reduceMotion ? undefined : { duration: 3.8 + (laneIndex % 3) * 0.45, repeat: Infinity, ease: "easeInOut" }}
                                  >
                                    <MagicalMediaFrame
                                      media={item}
                                      className="h-40 sm:h-44 md:h-48 lg:h-52"
                                      fit="contain"
                                      mediaClassName="scale-[1.02]"
                                      priority={index < 2 && columnIndex === 0 && laneIndex === 0}
                                    />
                                  </motion.div>
                                ))}
                              </motion.div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : trialDistanceSignal ? (
                  <div className="relative rounded-xl border border-sky-100/22 bg-[linear-gradient(158deg,rgba(7,13,26,0.95),rgba(10,16,32,0.96))] p-2.5">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(130,190,255,0.2),transparent_34%),radial-gradient(circle_at_84%_86%,rgba(255,199,146,0.16),transparent_36%)]" />
                    <div className="mb-2 flex items-center justify-between rounded-lg border border-sky-100/18 bg-black/35 px-3 py-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-100/80">long-distance relay</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/75">signal online</p>
                    </div>
                    <div className="relative grid h-[70vh] min-h-[34rem] gap-2 md:grid-cols-[1.15fr_0.85fr]">
                      <div className="relative h-full overflow-hidden rounded-xl border border-sky-100/20 bg-black/30 p-1.5">
                        <motion.div
                          animate={reduceMotion ? undefined : { y: [0, -4, 0], scale: [1, 1.01, 1] }}
                          transition={reduceMotion ? undefined : { duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
                          className="h-full"
                        >
                          <MagicalMediaFrame
                            media={chapter.heroMedia}
                            className="h-full rounded-[1rem]"
                            fit="contain"
                            mediaPosition="center"
                            priority={index < 2}
                          />
                        </motion.div>
                        <div className="pointer-events-none absolute inset-0 rounded-[0.9rem] bg-[repeating-linear-gradient(180deg,rgba(151,211,255,0.08)_0_2px,transparent_2px_11px)] mix-blend-screen" />
                        <motion.span
                          className="pointer-events-none absolute left-3 top-3 rounded border border-sky-100/25 bg-black/45 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-sky-100/75"
                          animate={reduceMotion ? undefined : { opacity: [0.55, 0.95, 0.55] }}
                          transition={reduceMotion ? undefined : { duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          remote feed
                        </motion.span>
                      </div>
                      <div className="grid h-full min-h-0 grid-cols-2 grid-rows-2 gap-2">
                        {chapter.supportingMedia.slice(0, 4).map((item, signalIndex) => (
                          <motion.div
                            key={`${chapter.id}-signal-${item.src}`}
                            className="min-h-0"
                            animate={reduceMotion ? undefined : { y: [0, signalIndex % 2 === 0 ? -3 : 3, 0], rotate: [0, signalIndex % 2 === 0 ? -0.7 : 0.7, 0] }}
                            transition={reduceMotion ? undefined : { duration: 3.4 + signalIndex * 0.35, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <MagicalMediaFrame
                              media={item}
                              className="h-full min-h-0"
                              fit={item.type === "video" ? "contain" : "cover"}
                              mediaPosition={item.type === "video" ? "center" : "top"}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <div className="pointer-events-none absolute inset-0">
                        <motion.span
                          className="absolute left-[62%] top-[28%] h-2 w-2 rounded-full bg-sky-200/90 [filter:drop-shadow(0_0_9px_rgba(125,200,255,0.8))]"
                          animate={reduceMotion ? undefined : { scale: [0.8, 1.35, 0.8], opacity: [0.45, 0.95, 0.45] }}
                          transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.span
                          className="absolute left-[57%] top-[58%] h-[2px] w-[21%] bg-[linear-gradient(90deg,rgba(125,200,255,0.45),rgba(255,188,136,0.6),rgba(125,200,255,0.15))]"
                          animate={reduceMotion ? undefined : { opacity: [0.3, 0.8, 0.3], scaleX: [0.94, 1.05, 0.94] }}
                          transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </div>
                ) : epilogueAfterOath ? (
                  <div className="relative overflow-hidden rounded-xl border border-pink-100/30 bg-[linear-gradient(160deg,rgba(42,18,44,0.95),rgba(21,11,34,0.97))] p-2.5 shadow-[0_24px_60px_rgba(20,5,24,0.58)]">
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,198,224,0.22),transparent_35%),radial-gradient(circle_at_82%_84%,rgba(252,224,182,0.2),transparent_34%)]" />
                      {Array.from({ length: 16 }).map((_, sparkle) => (
                        <motion.span
                          key={`${chapter.id}-epilogue-spark-${sparkle}`}
                          className="absolute h-[6px] w-[6px] rounded-full bg-pink-100/70"
                          style={{ left: `${5 + sparkle * 6}%`, top: `${10 + (sparkle % 5) * 16}%` }}
                          animate={reduceMotion ? undefined : { y: [0, -10, 0], opacity: [0.2, 0.75, 0.2], scale: [0.8, 1.2, 0.8] }}
                          transition={reduceMotion ? undefined : { duration: 3.2 + (sparkle % 3) * 0.4, repeat: Infinity, ease: "easeInOut", delay: sparkle * 0.13 }}
                        />
                      ))}
                    </div>
                    <div className="mb-2 flex items-center justify-between rounded-lg border border-pink-100/28 bg-black/35 px-3 py-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-pink-100/86">epilogue replay</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/78">one dance at a time</p>
                    </div>
                    <div className="relative mx-auto w-full max-w-[46rem]">
                      <div className="relative mx-auto aspect-square w-full max-w-[38rem] overflow-hidden rounded-[1rem] border border-pink-100/32 bg-black/35 p-2">
                        <div className="pointer-events-none absolute inset-2 rounded-[0.8rem] bg-[radial-gradient(circle_at_15%_15%,rgba(255,197,233,0.18),transparent_45%),radial-gradient(circle_at_80%_84%,rgba(252,224,182,0.16),transparent_44%)]" />
                        {epilogueMediaDeck[epilogueDanceIndex] ? (
                          <MagicalMediaFrame
                            media={epilogueMediaDeck[epilogueDanceIndex]}
                            className="h-full w-full rounded-[0.85rem] border border-pink-100/28"
                            fit="contain"
                            mediaClassName="!scale-100 group-hover:!scale-100 bg-black/75"
                            onVideoEnded={() => setEpilogueDanceFinished(true)}
                            priority={index < 2 && epilogueDanceIndex === 0}
                          />
                        ) : null}
                        <div className="pointer-events-none absolute inset-x-4 bottom-16 rounded border border-pink-100/30 bg-black/45 px-3 py-2 text-center">
                          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-pink-100/88">
                            {epilogueMediaDeck[epilogueDanceIndex]
                              ? getEpilogueClipLabel(epilogueMediaDeck[epilogueDanceIndex].src, epilogueDanceIndex)
                              : "After Oath Dance"}
                          </p>
                        </div>
                        {epilogueDanceFinished ? (
                          <motion.button
                            type="button"
                            onClick={goToNextEpilogueDance}
                            className="absolute inset-x-8 bottom-4 z-20 rounded-md border border-amber-100/45 bg-amber-900/35 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-100/92"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: "easeOut" }}
                          >
                            press for next dance
                          </motion.button>
                        ) : (
                          <div className="pointer-events-none absolute inset-x-8 bottom-4 rounded-md border border-pink-100/28 bg-black/40 px-3 py-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-pink-100/80">
                            once this dance ends, next button appears
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      {epilogueMediaDeck.map((item, clipIndex) => (
                        <button
                          type="button"
                          key={`${chapter.id}-epilogue-pill-${item.src}`}
                          onClick={() => goToEpilogueDance(clipIndex)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] transition",
                            clipIndex === epilogueDanceIndex
                              ? "border-pink-100/65 bg-pink-900/45 text-pink-100/96"
                              : "border-pink-100/28 bg-black/35 text-pink-100/80 hover:bg-pink-950/36"
                          )}
                        >
                          {getEpilogueClipLabel(item.src, clipIndex)}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={goToNextEpilogueDance}
                        className="rounded-full border border-amber-100/40 bg-amber-950/30 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-amber-100/90 transition hover:bg-amber-900/40"
                      >
                        next dance
                      </button>
                    </div>
                  </div>
                ) : finalMissionOath ? (
                  <div className="relative rounded-xl border border-rose-100/35 bg-[linear-gradient(158deg,rgba(39,17,30,0.96),rgba(21,10,24,0.97))] p-2.5 shadow-[0_24px_60px_rgba(22,6,18,0.55)]">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(255,196,205,0.25),transparent_34%),radial-gradient(circle_at_84%_86%,rgba(255,224,173,0.2),transparent_34%)]" />
                      <motion.div
                        className="absolute left-3 top-3 h-11 w-11 rounded-lg border border-rose-100/35 bg-rose-900/35 p-2"
                        animate={reduceMotion ? undefined : { rotate: [-3, 3, -3], y: [0, -1, 0] }}
                        transition={reduceMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <svg viewBox="0 0 64 64" className="h-full w-full text-rose-100/90" aria-hidden="true">
                          <path d="M12 20c6-5 14-5 20 0 6-5 14-5 20 0l-8 8-12-8-12 8-8-8z" fill="currentColor" />
                          <path d="M18 28l6 22 8-10 8 10 6-22" fill="currentColor" opacity="0.75" />
                        </svg>
                      </motion.div>
                      <motion.div
                        className="absolute right-3 top-3 h-11 w-11 rounded-full border border-amber-100/35 bg-rose-900/30 p-2"
                        animate={reduceMotion ? undefined : { rotate: [0, 8, 0], scale: [1, 1.05, 1] }}
                        transition={reduceMotion ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <svg viewBox="0 0 64 64" className="h-full w-full text-amber-100/90" aria-hidden="true">
                          <circle cx="32" cy="32" r="6" fill="currentColor" />
                          <circle cx="32" cy="20" r="7" fill="currentColor" opacity="0.85" />
                          <circle cx="44" cy="28" r="7" fill="currentColor" opacity="0.85" />
                          <circle cx="40" cy="42" r="7" fill="currentColor" opacity="0.85" />
                          <circle cx="24" cy="42" r="7" fill="currentColor" opacity="0.85" />
                          <circle cx="20" cy="28" r="7" fill="currentColor" opacity="0.85" />
                        </svg>
                      </motion.div>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        {[0, 1, 2].map((heart) => (
                          <motion.svg
                            key={`oath-heart-left-${heart}`}
                            viewBox="0 0 24 24"
                            className="h-4 w-4 text-rose-100/85"
                            animate={reduceMotion ? undefined : { y: [0, -2, 0], scale: [1, 1.08, 1] }}
                            transition={reduceMotion ? undefined : { duration: 1.8 + heart * 0.2, repeat: Infinity, ease: "easeInOut", delay: heart * 0.12 }}
                          >
                            <path
                              fill="currentColor"
                              d="M12 21s-7-4.6-9.3-8C0.8 10.4 1.7 6.7 5 5.5 7.1 4.7 9.4 5.5 11 7.3L12 8.4l1-1.1c1.6-1.8 3.9-2.6 6-1.8 3.3 1.2 4.2 4.9 2.3 7.5C19 16.4 12 21 12 21z"
                            />
                          </motion.svg>
                        ))}
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                        {[0, 1, 2].map((heart) => (
                          <motion.svg
                            key={`oath-heart-right-${heart}`}
                            viewBox="0 0 24 24"
                            className="h-4 w-4 text-amber-100/85"
                            animate={reduceMotion ? undefined : { y: [0, -2, 0], scale: [1, 1.08, 1] }}
                            transition={reduceMotion ? undefined : { duration: 1.9 + heart * 0.2, repeat: Infinity, ease: "easeInOut", delay: heart * 0.14 }}
                          >
                            <path
                              fill="currentColor"
                              d="M12 21s-7-4.6-9.3-8C0.8 10.4 1.7 6.7 5 5.5 7.1 4.7 9.4 5.5 11 7.3L12 8.4l1-1.1c1.6-1.8 3.9-2.6 6-1.8 3.3 1.2 4.2 4.9 2.3 7.5C19 16.4 12 21 12 21z"
                            />
                          </motion.svg>
                        ))}
                      </div>
                      {Array.from({ length: 10 }).map((_, petal) => (
                        <motion.span
                          key={`proposal-petal-${petal}`}
                          className="absolute h-[5px] w-[8px] rounded-full bg-rose-200/60"
                          style={{ left: `${8 + petal * 8.5}%`, top: `${6 + (petal % 4) * 15}%` }}
                          animate={reduceMotion ? undefined : { y: [0, 16, 0], x: [0, petal % 2 ? 4 : -4, 0], opacity: [0.12, 0.45, 0.12] }}
                          transition={reduceMotion ? undefined : { duration: 5 + (petal % 3), repeat: Infinity, ease: "easeInOut", delay: petal * 0.2 }}
                        />
                      ))}
                    </div>
                    <div className="mb-2 flex items-center justify-between rounded-lg border border-rose-100/28 bg-black/35 px-3 py-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-rose-100/85">proposal archive</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-100/78">oath night</p>
                    </div>
                    <div className="relative h-[72vh] min-h-[35rem] overflow-hidden rounded-[1rem] border border-rose-100/26 bg-black/26 p-2">
                      <motion.div
                        className="flex h-full w-full"
                        animate={{ x: `-${finalMissionSlideIndex * 100}%` }}
                        transition={{ duration: reduceMotion ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                      >
                        {finalMissionMediaSequence.map((item, sequenceIndex) => {
                          const stepLabel = getFinalMissionLabel(item.src, sequenceIndex);

                          return (
                            <div key={`${chapter.id}-proposal-sequence-${sequenceIndex}-${item.src}`} className="relative h-full w-full shrink-0">
                              <MagicalMediaFrame
                                media={item}
                                className="h-full w-full rounded-[0.95rem] border border-rose-100/30"
                                fit="cover"
                                mediaClassName="object-center scale-[1.04] group-hover:scale-[1.08]"
                                priority={index < 2 && sequenceIndex === 0}
                              />
                              <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded border border-rose-100/28 bg-black/45 px-3 py-2 text-center">
                                <p className="font-mono text-[10px] uppercase tracking-[0.23em] text-rose-100/88">{stepLabel}</p>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                      <div className="pointer-events-none absolute inset-y-2 left-2 w-12 bg-gradient-to-r from-[#160a1a] to-transparent" />
                      <div className="pointer-events-none absolute inset-y-2 right-2 w-12 bg-gradient-to-l from-[#160a1a] to-transparent" />
                      <button
                        type="button"
                        onClick={goToPrevFinalMissionSlide}
                        className="absolute left-3 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-rose-100/40 bg-black/45 text-rose-100/90 transition hover:bg-black/70"
                        aria-label="Show previous proposal step"
                      >
                        <span aria-hidden="true">{"<"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={goToNextFinalMissionSlide}
                        className="absolute right-3 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-rose-100/40 bg-black/45 text-rose-100/90 transition hover:bg-black/70"
                        aria-label="Show next proposal step"
                      >
                        <span aria-hidden="true">{">"}</span>
                      </button>
                      <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-rose-100/30 bg-black/45 px-2 py-1">
                        {finalMissionMediaSequence.map((item, stepIndex) => (
                          <button
                            type="button"
                            key={`${chapter.id}-proposal-dot-${item.src}`}
                            onClick={() => goToFinalMissionSlide(stepIndex)}
                            aria-label={`Go to step ${stepIndex + 1}: ${getFinalMissionLabel(item.src, stepIndex)}`}
                            className={cn(
                              "h-2 rounded-full border transition",
                              stepIndex === finalMissionSlideIndex
                                ? "w-6 border-rose-50/90 bg-rose-100/85"
                                : "w-2 border-rose-100/45 bg-rose-100/25 hover:bg-rose-100/45"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <MagicalMediaFrame
                    media={chapter.heroMedia}
                    className={cn("h-[56vh] min-h-64", sideQuestAdventure && "h-[49vh]")}
                    priority={index < 2}
                  />
                )}
                {chapter.supportingMedia.length > 0 ? (
                  firstEncounterCinema ? (
                    <div className="relative mt-4">
                      <div className="pointer-events-none absolute inset-x-0 -top-2 h-2 rounded bg-[radial-gradient(circle_at_6px_4px,rgba(0,0,0,0.85)_2px,transparent_2px)] [background-size:18px_8px]" />
                      <div className="pointer-events-none absolute inset-x-0 -bottom-2 h-2 rounded bg-[radial-gradient(circle_at_6px_4px,rgba(0,0,0,0.85)_2px,transparent_2px)] [background-size:18px_8px]" />
                      <div className="grid grid-cols-2 gap-3">
                        {chapter.supportingMedia.slice(0, 2).map((item) => (
                          <MagicalMediaFrame key={`${chapter.id}-${item.src}`} media={item} className="h-36 sm:h-44" />
                        ))}
                      </div>
                    </div>
                  ) : worldOfHerCollage || candlelightCollage || cityWalkOrbit || proofChemistryLab || endOfSummerMission || chaosButOursWinter || trialDistanceSignal || epilogueAfterOath || finalMissionOath ? null : (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {chapter.supportingMedia.slice(0, 6).map((item, itemIndex) => (
                        <div
                          key={`${chapter.id}-${item.src}`}
                          onMouseEnter={sideQuestAdventure ? triggerSideQuestTigerMarker : undefined}
                        >
                          <MagicalMediaFrame
                            media={item}
                            className={cn("h-28", sideQuestAdventure && "h-40")}
                            onVideoPlay={sideQuestAdventure ? triggerSideQuestTigerMarker : undefined}
                            priority={index < 2 && itemIndex === 0}
                          />
                        </div>
                      ))}
                    </div>
                  )
                ) : null}
              </>
            )}
          </div>

          {rider ? (
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={`ember-${i}-${entryTick}`}
                  className="absolute bottom-[-1rem] h-[3px] w-[3px] rounded-full bg-orange-300/80 animate-dust"
                  style={{ left: `${(i * 17) % 100}%`, animationDelay: `${(i * 0.12) % 1.6}s`, animationDuration: `${2 + (i % 4)}s` }}
                />
              ))}
            </div>
          ) : null}

          {mission ? (
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: featherCount }).map((_, i) => (
                <span
                  key={`f-${i}-${entryTick}`}
                  className="absolute left-[-12px] top-[10%] h-[2px] w-5 rotate-12 bg-zinc-100/40 animate-featherDrift"
                  style={{ top: `${12 + i * 7}%`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          ) : null}
        </aside>
      </div>
      <span className="sr-only">{tagSigilName(chapter.tags[0])}</span>
    </section>
  );
}


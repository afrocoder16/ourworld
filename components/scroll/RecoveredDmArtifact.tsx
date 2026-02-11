"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MediaItem } from "@/content/book";
import { SigilSet } from "@/components/icons/SigilIcons";

type RecoveredDmArtifactProps = {
  active: boolean;
  avatarMedia: MediaItem;
  onFirstSignal?: () => void;
};

type DmBeat =
  | { kind: "marker"; text: string; delay: number }
  | { kind: "bubble"; align: "left" | "right"; tone: "violet" | "slate"; text: string; delay: number };

const dmBeats: DmBeat[] = [
  { kind: "marker", text: "Aug 15 at 20:05", delay: 420 },
  { kind: "bubble", align: "right", tone: "violet", text: "Hey tsii", delay: 520 },
  { kind: "bubble", align: "right", tone: "violet", text: "Remember me?", delay: 700 },
  { kind: "bubble", align: "left", tone: "slate", text: "Hey... i don't think so 😅", delay: 760 },
  { kind: "bubble", align: "right", tone: "violet", text: "it's me, rock-paper-scissors guy 😭", delay: 860 },
  { kind: "bubble", align: "left", tone: "slate", text: "wait that was you?? 😂", delay: 760 },
  { kind: "bubble", align: "right", tone: "violet", text: "yes. snacks + jokes package included", delay: 860 },
  { kind: "bubble", align: "left", tone: "slate", text: "okay fine... continue 😌", delay: 760 }
];

export function RecoveredDmArtifact({ active, avatarMedia, onFirstSignal }: RecoveredDmArtifactProps) {
  const [phase, setPhase] = useState(0);
  const [identityRevealed, setIdentityRevealed] = useState(false);
  const [avatarMissing, setAvatarMissing] = useState(false);
  const hasFiredSignal = useRef(false);

  useEffect(() => {
    if (!active || phase === 0 || phase >= dmBeats.length) return;

    const currentBeat = dmBeats[phase - 1];
    const timer = window.setTimeout(() => {
      setPhase((prev) => Math.min(prev + 1, dmBeats.length));
    }, currentBeat.delay);

    return () => window.clearTimeout(timer);
  }, [active, phase]);

  useEffect(() => {
    if (phase < 3 || hasFiredSignal.current) return;
    hasFiredSignal.current = true;
    onFirstSignal?.();
  }, [onFirstSignal, phase]);

  const startSequence = () => {
    if (phase !== 0) return;
    setPhase(1);
  };

  const resetSequence = () => {
    setPhase(0);
    hasFiredSignal.current = false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-full"
    >
      <div className="pointer-events-none absolute -inset-4 bg-[radial-gradient(circle,rgba(108,196,255,0.18),rgba(108,196,255,0)_68%)]" />
      <div className="relative h-full overflow-hidden rounded-[2.2rem] border border-gold/30 bg-[linear-gradient(180deg,rgba(18,24,38,0.96),rgba(9,13,24,0.96))] p-3 shadow-[0_35px_70px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,rgba(255,196,123,0.16),transparent_35%),repeating-linear-gradient(130deg,transparent_0_18px,rgba(135,189,255,0.08)_18px_19px)]" />
        <motion.div
          className="pointer-events-none absolute left-4 top-20 h-24 w-24 rounded-full border border-cyan-300/25"
          animate={{ scale: active ? [0.9, 1.1, 0.95] : 0.95, opacity: active ? [0.15, 0.35, 0.2] : 0.12 }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-red-200/20 bg-red-900/50 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-red-100/85">
          Recovered Message
        </div>

        <div className="relative flex h-full min-h-[63vh] flex-col rounded-[1.7rem] border border-gold/20 bg-[linear-gradient(180deg,rgba(5,10,18,0.96),rgba(7,10,16,0.98))] px-4 pb-4 pt-3">
          <div className="mb-3 flex items-center justify-between text-zinc-200">
            <span className="font-mono text-xs tracking-[0.2em]">19:03</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-200/75" />
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-200/75" />
              <span className="h-1.5 w-4 rounded-sm bg-zinc-200/75" />
              <motion.span
                animate={{ opacity: phase >= 1 ? [0.4, 1, 0.4] : 0.25, scale: phase >= 1 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                className="h-2 w-2 rounded-full bg-cyan-300"
              />
            </div>
          </div>

          <div className="mb-3 flex items-center gap-3 border-b border-white/10 pb-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/20 bg-zinc-900">
              {!avatarMissing && avatarMedia.type === "image" ? (
                <Image src={avatarMedia.src} alt={avatarMedia.alt} fill className="object-cover" onError={() => setAvatarMissing(true)} />
              ) : (
                <div className="grid h-full w-full place-items-center bg-zinc-800 text-zinc-300">
                  <SigilSet.StarSigil className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-zinc-100">
                {identityRevealed ? "Tsi 💫" : <span className="inline-block rounded bg-zinc-700/80 px-2 py-1 text-sm">██████</span>}
              </p>
              <p className="font-mono text-xs text-zinc-400">
                {identityRevealed ? "@tsi_nu4" : <span className="inline-block rounded bg-zinc-700/70 px-2 py-0.5 text-[10px]">handle redacted</span>}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIdentityRevealed((prev) => !prev)}
              className="ml-auto rounded border border-cyan-200/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-100/90"
            >
              {identityRevealed ? "Mask" : "Reveal"}
            </button>
          </div>

          <div className="relative flex-1 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(20,24,36,0.78),rgba(16,20,30,0.84))] p-3 pr-2">
            <div className="pointer-events-none absolute inset-0 opacity-15">
              <SigilSet.GlyphSigil className="absolute right-3 top-4 h-10 w-10 text-cyan-100/35" />
              <SigilSet.WingSigil className="absolute left-3 bottom-4 h-10 w-10 text-cyan-100/30" />
            </div>

            {phase > 0
              ? dmBeats.slice(0, phase).map((beat, idx) => {
                  if (beat.kind === "marker") {
                    return (
                      <p key={`marker-${idx}`} className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                        {beat.text}
                      </p>
                    );
                  }
                  return <Bubble key={`bubble-${idx}`} align={beat.align} tone={beat.tone} text={beat.text} />;
                })
              : (
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">Recovered DM thread ready</p>
              )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            {phase === 0 ? (
              <button
                type="button"
                onClick={startSequence}
                className="rounded-full border border-gold/45 bg-gold/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold"
              >
                Send it
              </button>
            ) : (
              <button
                type="button"
                onClick={resetSequence}
                className="rounded-full border border-zinc-400/35 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-300"
              >
                Replay ritual
              </button>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">artifact_001</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Bubble({ align, tone, text }: { align: "left" | "right"; tone: "violet" | "slate"; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
        align === "right" ? "ml-auto rounded-br-md" : "mr-auto rounded-bl-md"
      } ${tone === "violet" ? "bg-violet-600/85 text-white" : "bg-zinc-700/80 text-zinc-100"}`}
    >
      {text}
    </motion.div>
  );
}

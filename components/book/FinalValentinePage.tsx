"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookConfig } from "@/content/book";
import { ConfettiBurst } from "@/components/effects/ConfettiBurst";
import { WaxSeal } from "@/components/effects/WaxSeal";
import { cn } from "@/lib/cn";

type FinalValentinePageProps = {
  config: BookConfig["finalPrompt"];
};

const finaleFrames = [
  { src: "/media/proposal_1.jpg", title: "The Question", caption: "The room held its breath." },
  { src: "/media/proposal_2.jpg", title: "The Ring Moment", caption: "Time slowed down on purpose." },
  { src: "/media/proposal_3.jpg", title: "She Said Yes", caption: "The yes echoed like fireworks." },
  { src: "/media/proposal_4.jpg", title: "Forever Starts Here", caption: "Case closed. Lifetime mission." }
];

const owedTreats = [
  "I owe you a baklava",
  "I owe you a dessert",
  "I owe you a cheesecake",
  "I owe you a movie night",
  "I owe you a flower date",
  "I owe you breakfast in bed"
];

const loveStormTokens = ["💖", "💘", "💕", "💞", "❤️", "LOVE", "YOU", "😍"];

export function FinalValentinePage({ config }: FinalValentinePageProps) {
  const reduceMotion = useReducedMotion();
  const [burstTick, setBurstTick] = useState(0);
  const [message, setMessage] = useState("");
  const [sealed, setSealed] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  const [openTreats, setOpenTreats] = useState(owedTreats);

  const showIOweList = noAttempts >= 3 && !sealed;
  const canDodgeNoButton = noAttempts < 3 && !sealed;
  const loveStormPieces = useMemo(
    () =>
      Array.from({ length: 90 }).map((_, i) => ({
        id: `love-${i}`,
        left: `${(i * 9.7) % 100}%`,
        delay: (i % 11) * 0.15,
        duration: 3.5 + (i % 7) * 0.45,
        token: loveStormTokens[i % loveStormTokens.length],
        drift: (i % 2 === 0 ? 1 : -1) * (8 + (i % 6) * 2)
      })),
    []
  );

  useEffect(() => {
    if (sealed || reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveFrame((prev) => (prev + 1) % finaleFrames.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [reduceMotion, sealed]);

  const onYes = () => {
    setBurstTick((prev) => prev + 1);
    setSealed(true);
    setNoAttempts(0);
    setNoButtonOffset({ x: 0, y: 0 });
    setOpenTreats(owedTreats);
    setMessage(config.yesResponse);
  };

  const onNo = () => {
    setSealed(false);
    setMessage(config.noResponse);
  };

  const dodgeNoButton = () => {
    if (!canDodgeNoButton) return;
    const nextAttempts = noAttempts + 1;
    setNoAttempts(nextAttempts);
    setNoButtonOffset({
      x: Math.round((Math.random() - 0.5) * 260),
      y: Math.round((Math.random() - 0.5) * 120)
    });
    if (nextAttempts >= 3) {
      setOpenTreats(owedTreats);
      setMessage("Okay, I gave up. Tap promises below and collect your treats.");
      return;
    }
    setMessage(`Nope. Try again (${nextAttempts}/3).`);
  };

  const claimTreat = (treat: string) => {
    setOpenTreats((prev) => prev.filter((item) => item !== treat));
  };

  const nextFrame = () => {
    setActiveFrame((prev) => (prev + 1) % finaleFrames.length);
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[linear-gradient(160deg,#090a13_0%,#131227_45%,#0a1221_100%)]">
      <ConfettiBurst trigger={burstTick} />
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 top-[-18%] h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgba(255,183,99,0.24),transparent_62%)] blur-xl"
          animate={reduceMotion ? undefined : { x: [-16, 22, -16], y: [0, 16, 0], scale: [1, 1.08, 1] }}
          transition={reduceMotion ? undefined : { duration: 8.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 bottom-[-20%] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(120,198,255,0.2),transparent_64%)] blur-xl"
          animate={reduceMotion ? undefined : { x: [18, -20, 18], y: [0, -14, 0], scale: [1, 1.06, 1] }}
          transition={reduceMotion ? undefined : { duration: 9.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20"
          animate={reduceMotion ? undefined : { rotate: 360, scale: [1, 1.03, 1] }}
          transition={reduceMotion ? undefined : { duration: 24, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/18"
          animate={reduceMotion ? undefined : { rotate: -360, scale: [1.02, 0.98, 1.02] }}
          transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: "linear" }}
        />
        {Array.from({ length: 36 }).map((_, i) => (
          <motion.span
            key={`final-spark-${i}`}
            className="absolute h-[3px] w-[3px] rounded-full bg-white/70"
            style={{ left: `${(i * 11) % 100}%`, top: `${(i * 17) % 100}%` }}
            animate={reduceMotion ? undefined : { opacity: [0.12, 0.9, 0.12], scale: [0.8, 1.3, 0.8] }}
            transition={reduceMotion ? undefined : { duration: 2.5 + (i % 5) * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1400px] flex-col px-4 pb-8 pt-20 sm:px-7 lg:px-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold/90">Final Gate: Oath Protocol</p>
          <WaxSeal
            label={sealed ? "Oath Locked In" : "Awaiting Final Answer"}
            className={cn(
              "rounded-full border border-red-300/15 bg-black/25 px-2 py-1 backdrop-blur-sm",
              sealed && "border-red-200/45 shadow-[0_0_30px_rgba(255,70,90,0.25)]"
            )}
          />
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.section
            className="relative overflow-hidden rounded-[1.35rem] border border-gold/28 bg-[linear-gradient(160deg,rgba(18,16,30,0.86),rgba(7,11,20,0.88))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reduceMotion ? 0.1 : 0.6, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-0">
              <motion.div
                className="absolute -left-1/3 top-0 h-full w-1/2 rotate-[18deg] bg-gradient-to-r from-transparent via-gold/12 to-transparent"
                animate={reduceMotion ? undefined : { x: ["-10%", "260%"] }}
                transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.03)_0_1px,transparent_1px_9px)]" />
            </div>

            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold/85">Final Oath Page</p>
              <h2 className="mt-4 font-body text-[clamp(2rem,5vw,4.8rem)] font-semibold leading-[1.02] text-white [text-shadow:0_8px_28px_rgba(0,0,0,0.65)]">
                {config.title}
              </h2>
              <p className="mt-4 max-w-xl text-xl font-medium text-zinc-100 sm:text-2xl">{config.body}</p>

              <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-xl">
                {["trust", "chaos", "forever"].map((token, idx) => (
                  <motion.div
                    key={token}
                    className="rounded-full border border-gold/28 bg-black/25 px-3 py-2 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-gold/92"
                    animate={reduceMotion ? undefined : { y: [0, -2, 0], opacity: [0.7, 1, 0.7] }}
                    transition={reduceMotion ? undefined : { duration: 2 + idx * 0.3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {token}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <motion.button
                  type="button"
                  onClick={onYes}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-lg border border-gold/70 bg-[linear-gradient(145deg,rgba(255,207,130,0.45),rgba(255,153,77,0.28))] px-5 py-3 font-mono text-sm uppercase tracking-[0.1em] text-white shadow-[0_0_28px_rgba(255,187,95,0.25)] transition hover:shadow-[0_0_40px_rgba(255,187,95,0.4)]"
                >
                  {config.yesLabel}
                </motion.button>
                {canDodgeNoButton ? (
                  <motion.button
                    type="button"
                    onClick={dodgeNoButton}
                    onMouseEnter={dodgeNoButton}
                    onFocus={dodgeNoButton}
                    animate={{ x: noButtonOffset.x, y: noButtonOffset.y }}
                    transition={{ duration: reduceMotion ? 0.05 : 0.28, ease: "easeOut" }}
                    className="rounded-lg border border-sky-100/35 bg-[linear-gradient(145deg,rgba(96,167,255,0.2),rgba(49,79,130,0.2))] px-5 py-3 font-mono text-sm uppercase tracking-[0.1em] text-sky-100 transition hover:bg-[linear-gradient(145deg,rgba(96,167,255,0.3),rgba(49,79,130,0.26))]"
                  >
                    {config.noLabel}
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={onNo}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-lg border border-sky-100/35 bg-[linear-gradient(145deg,rgba(96,167,255,0.2),rgba(49,79,130,0.2))] px-5 py-3 font-mono text-sm uppercase tracking-[0.1em] text-sky-100 transition hover:bg-[linear-gradient(145deg,rgba(96,167,255,0.3),rgba(49,79,130,0.26))]"
                  >
                    I gave up
                  </motion.button>
                )}
                <motion.button
                  type="button"
                  onClick={nextFrame}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-lg border border-zinc-100/22 bg-black/22 px-5 py-3 font-mono text-sm uppercase tracking-[0.1em] text-zinc-200 transition hover:border-zinc-100/35"
                >
                  Shift Scene
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {message ? (
                  <motion.p
                    key={message}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className={cn(
                      "mt-6 max-w-xl rounded-lg border px-4 py-3 font-mono text-sm uppercase tracking-[0.08em]",
                      sealed
                        ? "border-gold/45 bg-gold/15 text-gold"
                        : "border-sky-200/35 bg-sky-900/20 text-sky-100/92"
                    )}
                  >
                    {message}
                  </motion.p>
                ) : null}
              </AnimatePresence>

              {showIOweList ? (
                <div className="mt-4 rounded-lg border border-sky-200/35 bg-sky-900/22 p-3">
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.08em] text-sky-100/95">Tap each promise to claim it</p>
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {openTreats.map((treat) => (
                        <motion.button
                          key={treat}
                          type="button"
                          onClick={() => claimTreat(treat)}
                          className="rounded-full border border-gold/40 bg-gold/16 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-gold hover:bg-gold/25"
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.9 }}
                          transition={{ duration: reduceMotion ? 0.01 : 0.24, ease: "easeOut" }}
                        >
                          {treat}
                        </motion.button>
                      ))}
                    </AnimatePresence>
                    {openTreats.length === 0 ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-mono text-xs uppercase tracking-[0.08em] text-emerald-200/90"
                      >
                        all claimed. you win.
                      </motion.p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.section>

          <motion.section
            className="relative overflow-hidden rounded-[1.35rem] border border-sky-100/24 bg-[linear-gradient(165deg,rgba(10,18,34,0.86),rgba(14,10,28,0.9))] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-5"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: reduceMotion ? 0.1 : 0.6, ease: "easeOut", delay: reduceMotion ? 0 : 0.1 }}
          >
            <div className="mb-3 flex items-center justify-between rounded-lg border border-sky-100/22 bg-black/30 px-3 py-1.5">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-sky-100/92">vow cinema</p>
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-gold/90">{activeFrame + 1}/4</p>
            </div>

            <div className="relative h-[58vh] min-h-[24rem] overflow-hidden rounded-[1rem] border border-sky-100/24 bg-black/35 sm:h-[62vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={finaleFrames[activeFrame].src}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: reduceMotion ? 0.15 : 0.7, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={finaleFrames[activeFrame].src}
                    alt={finaleFrames[activeFrame].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 90vw, 48vw"
                    priority={activeFrame === 0}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),transparent_30%,transparent_65%,rgba(0,0,0,0.55))]" />

              <motion.div
                className="pointer-events-none absolute right-3 top-3 rounded border border-sky-100/28 bg-black/55 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-sky-100/95"
                animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
                transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                memory broadcast
              </motion.div>

              <div className="absolute inset-x-3 bottom-3 rounded border border-gold/28 bg-black/45 px-3 py-2">
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-gold">{finaleFrames[activeFrame].title}</p>
                <p className="mt-1 text-base text-zinc-100">{finaleFrames[activeFrame].caption}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {finaleFrames.map((frame, frameIndex) => (
                <button
                  key={frame.src}
                  type="button"
                  onClick={() => setActiveFrame(frameIndex)}
                  className={cn(
                    "relative h-16 overflow-hidden rounded-md border transition sm:h-20",
                    frameIndex === activeFrame
                      ? "border-gold/65 ring-1 ring-gold/45"
                      : "border-sky-100/20 hover:border-sky-100/40"
                  )}
                >
                  <Image src={frame.src} alt={frame.title} fill className="object-cover" sizes="22vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                </button>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {sealed ? (
          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,215,141,0.22),transparent_46%)]" />
            <motion.h3
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-body text-4xl font-semibold text-gold drop-shadow-[0_0_28px_rgba(255,190,112,0.45)] sm:text-6xl"
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.45, ease: "easeOut" }}
            >
              OATH SEALED
            </motion.h3>
            {Array.from({ length: 14 }).map((_, heart) => (
              <motion.span
                key={`sealed-heart-${heart}`}
                className="absolute text-rose-200/85"
                style={{ left: `${12 + heart * 6}%`, bottom: `${8 + (heart % 4) * 8}%` }}
                initial={{ opacity: 0, y: 16 }}
                animate={reduceMotion ? { opacity: 0.35 } : { opacity: [0, 0.9, 0], y: [16, -36 - (heart % 3) * 14, -62], x: [0, heart % 2 ? 12 : -12, 0] }}
                transition={reduceMotion ? { duration: 0.1 } : { duration: 2.2 + (heart % 3) * 0.28, repeat: Infinity, delay: heart * 0.1, ease: "easeOut" }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 21s-7-4.6-9.3-8C0.8 10.4 1.7 6.7 5 5.5 7.1 4.7 9.4 5.5 11 7.3L12 8.4l1-1.1c1.6-1.8 3.9-2.6 6-1.8 3.3 1.2 4.2 4.9 2.3 7.5C19 16.4 12 21 12 21z"
                  />
                </svg>
              </motion.span>
            ))}
            <div className="absolute inset-0 overflow-hidden">
              {loveStormPieces.map((piece) => (
                <motion.span
                  key={`${piece.id}-${burstTick}`}
                  className="absolute top-[-8vh] font-mono text-lg font-semibold text-rose-100 drop-shadow-[0_0_10px_rgba(255,102,158,0.55)]"
                  style={{ left: piece.left }}
                  initial={{ y: "-8vh", opacity: 0.1, x: 0 }}
                  animate={
                    reduceMotion
                      ? { opacity: 0.65 }
                      : { y: "112vh", opacity: [0, 1, 1, 0], x: [0, piece.drift, -piece.drift, 0], rotate: [0, piece.drift > 0 ? 12 : -12, 0] }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0.1 }
                      : { duration: piece.duration, delay: piece.delay, repeat: Infinity, ease: "linear" }
                  }
                >
                  {piece.token}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

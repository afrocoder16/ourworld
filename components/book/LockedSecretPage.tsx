"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookConfig } from "@/content/book";
import { WaxSeal } from "@/components/effects/WaxSeal";
import { SigilSet } from "@/components/icons/SigilIcons";

type LockedSecretPageProps = {
  config: BookConfig["locked"];
};

type UnlockPhase = "idle" | "align-1" | "align-2" | "align-3" | "open";

export function LockedSecretPage({ config }: LockedSecretPageProps) {
  const [value, setValue] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<UnlockPhase>("idle");
  const secretGallery = config.secretGallery?.length ? config.secretGallery : config.secretMedia ? [config.secretMedia] : [];

  const runUnlockSequence = () => {
    setPhase("align-1");
    window.setTimeout(() => setPhase("align-2"), 320);
    window.setTimeout(() => setPhase("align-3"), 650);
    window.setTimeout(() => {
      setPhase("open");
      setUnlocked(true);
    }, 980);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (value.trim().toLowerCase() === config.password.toLowerCase()) {
      setError("");
      runUnlockSequence();
      return;
    }
    setError("Seal mismatch. Try again.");
    setPhase("idle");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/80">Locked Archive</p>
        <WaxSeal label="Classified" />
      </div>
      {!unlocked ? (
        <form onSubmit={submit} className="space-y-3 rounded-xl border border-gold/20 bg-black/20 p-4">
          <h3 className="font-display text-xl text-ink">Sealed Message — Enter A Gift Of Love</h3>
          <p className="whitespace-pre-line text-sm text-ink/70">{config.hint}</p>
          <div className="relative overflow-hidden rounded-lg border border-gold/25 bg-black/30 p-3">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/60">Inheritance Chest Protocol</div>
            <div className="relative h-16">
              <motion.div
                className="absolute left-3 top-3 text-ink/50"
                animate={{ rotate: phase === "align-1" || phase === "align-2" || phase === "align-3" ? [0, 12, 0] : 0, opacity: phase === "idle" ? 0.3 : 0.9 }}
              >
                <SigilSet.GlyphSigil className="h-10 w-10" />
              </motion.div>
              <motion.div
                className="absolute left-[42%] top-3 text-ink/50"
                animate={{ rotate: phase === "align-2" || phase === "align-3" ? [0, -18, 0] : 0, opacity: phase === "align-2" || phase === "align-3" ? 0.95 : 0.35 }}
              >
                <SigilSet.ShardSigil className="h-10 w-10" />
              </motion.div>
              <motion.div
                className="absolute right-3 top-3 text-ink/50"
                animate={{ rotate: phase === "align-3" ? [0, 16, 0] : 0, opacity: phase === "align-3" || phase === "open" ? 1 : 0.35 }}
              >
                <SigilSet.WaxSealSigil className="h-10 w-10" />
              </motion.div>
              {phase !== "idle" ? (
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.7, 0.2] }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 rounded-md bg-[radial-gradient(circle,rgba(108,191,255,0.35),rgba(108,191,255,0)_70%)]"
                />
              ) : null}
            </div>
          </div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter passphrase"
            className="w-full rounded-md border border-gold/30 bg-black/20 px-3 py-2 text-ink placeholder:text-ink/50 focus:border-gold/60 focus:outline-none"
          />
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
          <button type="submit" className="rounded-md border border-gold/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-ink transition hover:bg-gold/20">
            Unlock
          </button>
        </form>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h3 className="font-display text-2xl text-ink">{config.secretTitle}</h3>
          <div className="space-y-1 text-base text-ink/85">
            {config.secretBody.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          {secretGallery.length ? (
            <div className="relative overflow-hidden rounded-xl border border-gold/25 bg-[linear-gradient(160deg,rgba(20,17,28,0.95),rgba(8,10,18,0.97))] p-3">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,208,141,0.18),transparent_36%),radial-gradient(circle_at_84%_82%,rgba(128,196,255,0.18),transparent_34%)]" />
                {Array.from({ length: 12 }).map((_, spark) => (
                  <motion.span
                    key={`locked-spark-${spark}`}
                    className="absolute h-[4px] w-[4px] rounded-full bg-gold/70"
                    style={{ left: `${8 + spark * 7}%`, top: `${10 + (spark % 4) * 20}%` }}
                    animate={{ y: [0, -9, 0], opacity: [0.15, 0.72, 0.15], scale: [0.8, 1.15, 0.8] }}
                    transition={{ duration: 2.8 + (spark % 3) * 0.4, repeat: Infinity, ease: "easeInOut", delay: spark * 0.12 }}
                  />
                ))}
              </div>
              <div className="mb-2 flex items-center justify-between rounded-lg border border-gold/22 bg-black/35 px-3 py-1.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold/80">tiny tinu dossier</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-200/72">origin snapshots</p>
              </div>
              <div className="relative grid gap-2.5 md:grid-cols-[1.08fr_0.92fr]">
                {secretGallery[0] ? (
                  <motion.div
                    className="relative h-[52vh] min-h-[18rem] overflow-hidden rounded-[1rem] border border-gold/28 bg-black/35"
                    animate={{ y: [0, -3, 0], rotate: [-0.25, 0.25, -0.25] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {secretGallery[0].type === "image" ? (
                      <Image src={secretGallery[0].src} alt={secretGallery[0].alt} fill className="object-cover" sizes="(max-width: 768px) 88vw, 56vw" />
                    ) : (
                      <video src={secretGallery[0].src} className="h-full w-full object-cover" autoPlay muted playsInline loop controls />
                    )}
                    <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded border border-gold/28 bg-black/45 px-2 py-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/88">archive 01</p>
                    </div>
                  </motion.div>
                ) : null}
                <div className="grid gap-2.5 md:grid-rows-2">
                  {secretGallery.slice(1, 3).map((item, idx) => (
                    <motion.div
                      key={`${item.src}-${idx}`}
                      className="relative h-56 min-h-[11rem] overflow-hidden rounded-[1rem] border border-gold/26 bg-black/35"
                      animate={{ y: [0, idx % 2 === 0 ? 2 : -2, 0], rotate: [0, idx % 2 === 0 ? 0.35 : -0.35, 0] }}
                      transition={{ duration: 3.3 + idx * 0.35, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {item.type === "image" ? (
                        <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(max-width: 768px) 88vw, 34vw" />
                      ) : (
                        <video src={item.src} className="h-full w-full object-cover" autoPlay muted playsInline loop controls />
                      )}
                      <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded border border-gold/28 bg-black/45 px-2 py-1.5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/88">{`archive 0${idx + 2}`}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      )}
    </div>
  );
}

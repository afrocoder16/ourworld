"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioTrack } from "@/content/book";
import { CodexAudioEventDetail } from "@/lib/audio-events";

type ActiveAudioState = {
  sectionId: string;
  trackId: string;
  intensity: number;
  stinger?: string;
};

type AudioManagerProps = {
  tracks: AudioTrack[];
  defaultTrackId: string;
  activeAudio: ActiveAudioState;
};

const CROSSFADE_MS = 2400;
const FADE_STEP_MS = 90;
const LOCKED_VOLUME = 0.48;

export function AudioManager({ tracks, defaultTrackId, activeAudio }: AudioManagerProps) {
  const trackMap = useMemo(() => new Map(tracks.map((track) => [track.id, track])), [tracks]);
  const orderedTrackIds = useMemo(() => tracks.map((track) => track.id), [tracks]);

  const [currentTrackId, setCurrentTrackId] = useState(defaultTrackId);
  const [currentIntensity, setCurrentIntensity] = useState(0.55);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customTrackLabel, setCustomTrackLabel] = useState<string | null>(null);
  const [userStarted, setUserStarted] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const stingerRef = useRef<HTMLAudioElement | null>(null);
  const overlayAudioRefs = useRef<HTMLAudioElement[]>([]);
  const manualTrackLockRef = useRef(false);

  const clearFadeTimer = () => {
    if (fadeTimerRef.current) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  const cleanupAudio = (audio?: HTMLAudioElement | null) => {
    if (!audio) return;
    audio.pause();
    audio.src = "";
    audio.load();
  };

  const targetVolume = useCallback((intensity: number) => Math.max(0, Math.min(1, LOCKED_VOLUME * intensity)), []);

  const playStinger = (src?: string) => {
    if (!src) return;
    if (stingerRef.current) {
      stingerRef.current.pause();
      stingerRef.current = null;
    }
    const stinger = new Audio(src);
    stinger.volume = Math.min(1, LOCKED_VOLUME * 0.8);
    stingerRef.current = stinger;
    void stinger.play().catch(() => undefined);
  };

  const playOverlay = (src?: string, gain = 0.95) => {
    if (!src) return;
    const clip = new Audio(src);
    clip.preload = "auto";
    clip.volume = Math.max(0, Math.min(1, LOCKED_VOLUME * gain));
    clip.onended = () => {
      overlayAudioRefs.current = overlayAudioRefs.current.filter((item) => item !== clip);
    };
    overlayAudioRefs.current.push(clip);
    void clip.play().catch(() => undefined);
  };

  const playTrack = async (trackId: string, intensity: number, fadeFromCurrent = false) => {
    const nextTrack = trackMap.get(trackId);
    if (!nextTrack) return;

    const nextAudio = new Audio(nextTrack.src);
    nextAudio.loop = true;
    nextAudio.preload = "auto";
    nextAudio.volume = fadeFromCurrent ? 0 : targetVolume(intensity);

    const prevAudio = audioRef.current;
    const prevIntensity = currentIntensity;
    audioRef.current = nextAudio;
    setCurrentTrackId(trackId);
    setCurrentIntensity(intensity);
    setCustomTrackLabel(null);

    try {
      await nextAudio.play();
      setIsPlaying(true);
    } catch {
      cleanupAudio(nextAudio);
      audioRef.current = prevAudio ?? null;
      setIsPlaying(false);
      return;
    }

    if (!fadeFromCurrent || !prevAudio) {
      cleanupAudio(prevAudio);
      return;
    }

    clearFadeTimer();
    const steps = Math.max(1, Math.floor(CROSSFADE_MS / FADE_STEP_MS));
    let frame = 0;
    fadeTimerRef.current = window.setInterval(() => {
      frame += 1;
      const ratio = Math.min(1, frame / steps);
      nextAudio.volume = targetVolume(intensity) * ratio;
      prevAudio.volume = targetVolume(prevIntensity) * (1 - ratio);
      if (ratio >= 1) {
        clearFadeTimer();
        cleanupAudio(prevAudio);
      }
    }, FADE_STEP_MS);
  };

  const playCustomTrack = async (src: string, intensity: number, label?: string) => {
    const nextAudio = new Audio(src);
    nextAudio.loop = true;
    nextAudio.preload = "auto";
    nextAudio.volume = 0;

    const prevAudio = audioRef.current;
    const prevIntensity = currentIntensity;
    audioRef.current = nextAudio;
    setCurrentTrackId(`custom:${src}`);
    setCurrentIntensity(intensity);
    setCustomTrackLabel(label ?? "Special Track");

    try {
      await nextAudio.play();
      setIsPlaying(true);
    } catch {
      cleanupAudio(nextAudio);
      audioRef.current = prevAudio ?? null;
      setIsPlaying(false);
      return;
    }

    clearFadeTimer();
    if (!prevAudio) {
      nextAudio.volume = targetVolume(intensity);
      return;
    }

    const steps = Math.max(1, Math.floor(CROSSFADE_MS / FADE_STEP_MS));
    let frame = 0;
    fadeTimerRef.current = window.setInterval(() => {
      frame += 1;
      const ratio = Math.min(1, frame / steps);
      nextAudio.volume = targetVolume(intensity) * ratio;
      prevAudio.volume = targetVolume(prevIntensity) * (1 - ratio);
      if (ratio >= 1) {
        clearFadeTimer();
        cleanupAudio(prevAudio);
      }
    }, FADE_STEP_MS);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = targetVolume(currentIntensity);
  }, [currentIntensity, targetVolume]);

  useEffect(() => {
    if (!userStarted) return;
    const trackChanged = activeAudio.trackId !== currentTrackId;
    const intensityChanged = Math.abs(activeAudio.intensity - currentIntensity) > 0.04;

    if (activeAudio.sectionId !== activeSection) {
      setActiveSection(activeAudio.sectionId);
      playStinger(activeAudio.stinger);
    }

    if (manualTrackLockRef.current) {
      return;
    }

    if (trackChanged) {
      void playTrack(activeAudio.trackId, activeAudio.intensity, true);
      return;
    }

    if (intensityChanged) {
      setCurrentIntensity(activeAudio.intensity);
      if (audioRef.current) audioRef.current.volume = targetVolume(activeAudio.intensity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAudio, userStarted]);

  useEffect(() => {
    return () => {
      clearFadeTimer();
      cleanupAudio(audioRef.current);
      cleanupAudio(stingerRef.current);
      overlayAudioRefs.current.forEach((clip) => cleanupAudio(clip));
      overlayAudioRefs.current = [];
    };
  }, []);

  const onPlayPause = async () => {
    if (!userStarted) setUserStarted(true);

    if (!audioRef.current) {
      await playTrack(activeAudio.trackId, activeAudio.intensity || 0.6, false);
      playStinger(activeAudio.stinger);
      setActiveSection(activeAudio.sectionId);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const onCodexAudio = (event: Event) => {
      const detail = (event as CustomEvent<CodexAudioEventDetail>).detail;
      if (!detail) return;

      if (detail.action === "start") {
        if (!userStarted) {
          void onPlayPause();
        }
        return;
      }

      if (!userStarted) setUserStarted(true);

      if (detail.action === "sfx") {
        playOverlay(detail.src, detail.intensity ?? 1);
        return;
      }

      if (detail.action === "track") {
        manualTrackLockRef.current = true;
        if (detail.trackId) {
          void playTrack(detail.trackId, detail.intensity ?? (currentIntensity || 0.6), Boolean(audioRef.current));
          return;
        }
        if (detail.src) {
          void playCustomTrack(detail.src, detail.intensity ?? (currentIntensity || 0.6), detail.label);
        }
      }
    };

    window.addEventListener("codex-audio", onCodexAudio as EventListener);
    return () => window.removeEventListener("codex-audio", onCodexAudio as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStarted, currentIntensity, onPlayPause, playTrack, targetVolume]);

  const onNext = async () => {
    const index = Math.max(0, orderedTrackIds.findIndex((id) => id === currentTrackId));
    const nextId = orderedTrackIds[(index + 1) % orderedTrackIds.length];
    if (!userStarted) setUserStarted(true);
    await playTrack(nextId, currentIntensity, Boolean(audioRef.current));
  };

  const activeTrack = trackMap.get(currentTrackId);

  return (
    <div className="fixed bottom-4 left-4 z-50 w-[260px] rounded-2xl border border-gold/25 bg-black/65 p-3 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/85">Music Orb</p>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold/60">{activeTrack?.vibe ?? "locked"}</span>
      </div>
      <p className="truncate font-display text-sm text-zinc-100/90">{customTrackLabel ?? activeTrack?.label ?? "No track selected"}</p>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-200/60">Intensity {Math.round(currentIntensity * 100)}%</div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onPlayPause}
          className="rounded-full border border-gold/45 bg-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:bg-gold/20"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full border border-gold/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold/85 hover:bg-gold/10"
        >
          Next
        </button>
      </div>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-300/55">Volume locked</p>
    </div>
  );
}

"use client";

export type CodexAudioEventDetail = {
  action: "start" | "track" | "sfx";
  src?: string;
  trackId?: string;
  label?: string;
  intensity?: number;
};

export const dispatchCodexAudio = (detail: CodexAudioEventDetail) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<CodexAudioEventDetail>("codex-audio", { detail }));
};


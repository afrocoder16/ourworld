import { Chapter } from "@/content/book";
import { getWorldModules } from "@/lib/world-engine";

export type ParticleMode = "dust" | "embers" | "snow";

export const getParticleMode = (chapter?: Chapter): ParticleMode => {
  if (!chapter) return "dust";
  const modules = getWorldModules(chapter);
  if (modules.includes("shatter")) return "snow";
  if (modules.includes("rider") || modules.includes("guild")) return "embers";
  return "dust";
};

export const isFaeChapter = (chapter: Chapter): boolean => chapter.id === "chapter-2-world-of-her";

export const isProposalChapter = (chapter: Chapter): boolean => chapter.id === "final-mission-oath";

export const isTrialChapter = (chapter: Chapter): boolean => chapter.tags.includes("trial");

export const isMissionChapter = (chapter: Chapter): boolean => chapter.tags.includes("mission");

export const hasOceanRipple = (chapter: Chapter): boolean =>
  chapter.tags.includes("adventure") || chapter.id === "mission-03-city-walk";

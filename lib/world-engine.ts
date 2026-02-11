import { Chapter, ChapterTag } from "@/content/book";

export type WorldModule =
  | "psy"
  | "guild"
  | "rider"
  | "fae"
  | "quest"
  | "legacy"
  | "rune"
  | "shatter"
  | "assassin";

const tagModuleMap: Record<ChapterTag, WorldModule[]> = {
  prologue: ["psy", "quest"],
  mission: ["guild", "assassin", "rune"],
  trial: ["shatter", "psy", "legacy"],
  proposal: ["rider", "guild", "rune"],
  epilogue: ["fae", "quest"],
  goofy: ["assassin", "shatter"],
  adventure: ["quest", "rider"],
  cozy: ["psy", "fae"]
};

export const getWorldModules = (chapter: Chapter): WorldModule[] => {
  const base = new Set<WorldModule>();
  chapter.tags.forEach((tag) => tagModuleMap[tag].forEach((moduleId) => base.add(moduleId)));

  if (chapter.id === "chapter-2-world-of-her") {
    base.add("fae");
    base.add("psy");
  }
  if (chapter.id === "final-mission-oath") {
    base.add("rider");
    base.add("guild");
  }
  if (chapter.id === "trial-distance") {
    base.add("shatter");
    base.add("legacy");
  }

  return Array.from(base);
};

const watermarkMap: Record<ChapterTag, string> = {
  prologue:
    "radial-gradient(circle_at_12%_18%,rgba(148,206,255,0.2),transparent_34%),repeating-linear-gradient(120deg,transparent_0_14px,rgba(136,185,255,0.12)_14px_15px)",
  mission:
    "repeating-linear-gradient(90deg,rgba(98,39,31,0.1)_0_2px,transparent_2px_24px),repeating-linear-gradient(0deg,rgba(98,39,31,0.08)_0_2px,transparent_2px_24px)",
  trial:
    "linear-gradient(128deg,transparent_0_46%,rgba(148,187,213,0.18)_46.2%_47%,transparent_47.4%),linear-gradient(62deg,transparent_0_52%,rgba(148,187,213,0.12)_52.2%_53%,transparent_53.4%)",
  proposal:
    "radial-gradient(circle_at_78%_18%,rgba(255,150,87,0.2),transparent_30%),linear-gradient(150deg,rgba(118,78,45,0.12),transparent_36%)",
  epilogue:
    "radial-gradient(circle_at_20%_22%,rgba(184,255,230,0.18),transparent_34%),linear-gradient(115deg,rgba(103,157,255,0.1),transparent_40%)",
  goofy:
    "repeating-radial-gradient(circle_at_18%_30%,rgba(120,96,74,0.1)_0_8px,transparent_8px_20px)",
  adventure:
    "repeating-linear-gradient(9deg,transparent_0_11px,rgba(115,186,255,0.12)_11px_12px),radial-gradient(circle_at_80%_76%,rgba(115,186,255,0.17),transparent_34%)",
  cozy:
    "radial-gradient(circle_at_75%_20%,rgba(255,214,152,0.18),transparent_33%),repeating-linear-gradient(145deg,transparent_0_12px,rgba(156,130,92,0.1)_12px_13px)"
};

export const getTagWatermark = (tag: ChapterTag): string => watermarkMap[tag];


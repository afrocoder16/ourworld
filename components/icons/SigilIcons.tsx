import { ChapterTag } from "@/content/book";

type IconProps = {
  className?: string;
  strokeWidth?: number;
};

const iconClass = "fill-none stroke-current";

const StarSigil = ({ className, strokeWidth = 1.7 }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path className={iconClass} strokeWidth={strokeWidth} d="M12 2.8l2.1 5.3 5.6.4-4.3 3.6 1.4 5.4L12 14.5 7.2 17.5l1.4-5.4-4.3-3.6 5.6-.4L12 2.8z" />
  </svg>
);

const DaggerSigil = ({ className, strokeWidth = 1.6 }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path className={iconClass} strokeWidth={strokeWidth} d="M12 3l2.2 2.2-1.6 4.4L15 12l-3 9-3-9 2.4-2.4-1.6-4.4L12 3z" />
    <path className={iconClass} strokeWidth={strokeWidth} d="M7 12h10" />
  </svg>
);

const WingSigil = ({ className, strokeWidth = 1.5 }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path className={iconClass} strokeWidth={strokeWidth} d="M4 16c3-1 5-4 7-10 3 2 4 5 4 9-2 0-4 0-6 1-2 1-3 2-5 4" />
    <path className={iconClass} strokeWidth={strokeWidth} d="M13 7c2 0 4 1 7 4-1 3-4 5-8 5" />
  </svg>
);

const FlameSigil = ({ className, strokeWidth = 1.7 }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path className={iconClass} strokeWidth={strokeWidth} d="M12 3c2 2 3 4 2 6 2-1 4 2 4 5a6 6 0 11-12 0c0-3 2-6 4-7 0 2 1 3 2 4 .5-1 1-2 0-8z" />
  </svg>
);

const WaveSigil = ({ className, strokeWidth = 1.7 }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path className={iconClass} strokeWidth={strokeWidth} d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path className={iconClass} strokeWidth={strokeWidth} d="M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  </svg>
);

const GlyphSigil = ({ className, strokeWidth = 1.7 }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path className={iconClass} strokeWidth={strokeWidth} d="M5 7h6v4h4v6H9v-4H5z" />
    <path className={iconClass} strokeWidth={strokeWidth} d="M14 5h5v5M16.5 6.5v7" />
  </svg>
);

const GearSigil = ({ className, strokeWidth = 1.6 }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      className={iconClass}
      strokeWidth={strokeWidth}
      d="M12 3.7l1.4 1.6 2.1-.2.8 2 2 .8-.2 2.1 1.6 1.4-1.6 1.4.2 2.1-2 .8-.8 2-2.1-.2L12 20.3l-1.4-1.6-2.1.2-.8-2-2-.8.2-2.1L4.3 12l1.6-1.4-.2-2.1 2-.8.8-2 2.1.2L12 3.7z"
    />
    <circle className={iconClass} cx="12" cy="12" r="2.5" strokeWidth={strokeWidth} />
  </svg>
);

const ShardSigil = ({ className, strokeWidth = 1.7 }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path className={iconClass} strokeWidth={strokeWidth} d="M4 5l8-2 8 4-2 12-9 2L4 5z" />
    <path className={iconClass} strokeWidth={strokeWidth} d="M12 3v16M8 9l8 3" />
  </svg>
);

const WaxSealSigil = ({ className, strokeWidth = 1.7 }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      className={iconClass}
      strokeWidth={strokeWidth}
      d="M12 3c2.2 0 3.3 1.5 5 2.5 1.8 1 3.8 1.6 4.2 3.8.4 2.3-1.1 3.9-1.7 5.9-.6 2.1-.2 4.5-2.1 5.8-1.8 1.2-4 .4-5.4.2-1.4.2-3.6 1-5.4-.2-1.9-1.3-1.5-3.7-2.1-5.8-.6-2-2.1-3.6-1.7-5.9.4-2.2 2.4-2.8 4.2-3.8C8.7 4.5 9.8 3 12 3z"
    />
    <path className={iconClass} strokeWidth={strokeWidth} d="M9 12.5l2 2 4-4" />
  </svg>
);

const sigilIcon = (name: keyof typeof SigilSet, className?: string) => {
  const Icon = SigilSet[name];
  return <Icon className={className} />;
};

export const tagSigilName = (tag: ChapterTag): keyof typeof SigilSet => {
  if (tag === "prologue") return "StarSigil";
  if (tag === "mission") return "DaggerSigil";
  if (tag === "trial") return "ShardSigil";
  if (tag === "proposal") return "WaxSealSigil";
  if (tag === "epilogue") return "FlameSigil";
  if (tag === "cozy") return "WingSigil";
  if (tag === "goofy") return "GearSigil";
  return "WaveSigil";
};

export const tagIcon = (tag: ChapterTag, className?: string) => sigilIcon(tagSigilName(tag), className);

export const SigilSet = {
  StarSigil,
  DaggerSigil,
  WingSigil,
  FlameSigil,
  WaveSigil,
  GlyphSigil,
  GearSigil,
  ShardSigil,
  WaxSealSigil
};


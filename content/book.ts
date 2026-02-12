import { withBasePath } from "@/lib/base-path";

export type MediaType = "image" | "video";

export type MediaItem = {
  type: MediaType;
  src: string;
  alt: string;
  loop?: boolean;
};

export type ChapterTag =
  | "prologue"
  | "mission"
  | "trial"
  | "proposal"
  | "epilogue"
  | "goofy"
  | "adventure"
  | "cozy";

export type Chapter = {
  id: string;
  chapterTitle: string;
  dateLabel: string;
  bodyText: string[];
  quoteLine: string;
  footnote: string;
  heroMedia: MediaItem;
  supportingMedia: MediaItem[];
  tags: ChapterTag[];
  redactedLine?: string;
  trackId: string;
  intensity: number;
  stinger?: string;
};

export type AudioTrack = {
  id: string;
  label: string;
  vibe: string;
  src: string;
};

export type BookConfig = {
  title: string;
  subtitle: string;
  dedication: string;
  audio: {
    defaultTrackId: string;
    specialTrackId: string;
    tracks: AudioTrack[];
  };
  vault: {
    extraMedia: MediaItem[];
  };
  locked: {
    password: string;
    hint: string;
    secretTitle: string;
    secretBody: string[];
    secretMedia?: MediaItem;
    secretGallery?: MediaItem[];
  };
  finalPrompt: {
    title: string;
    body: string;
    yesLabel: string;
    noLabel: string;
    noResponse: string;
    yesResponse: string;
  };
  chapters: Chapter[];
};

const img = (name: string, alt: string): MediaItem => ({
  type: "image",
  src: withBasePath(`/media/${name}.jpg`),
  alt
});

const vid = (name: string, alt: string, loop = false): MediaItem => ({
  type: "video",
  src: withBasePath(`/media/${name}.mp4`),
  alt,
  loop
});

const audio = (name: string): string => withBasePath(`/audio/${name}.mp3`);
const sfx = (name: string): string => withBasePath(`/audio/sfx/${name}.mp3`);

export const book: BookConfig = {
  title: "The Library Codex",
  subtitle: "A private field record of fate, fire, and u",
  dedication: "Filed by: your favorite co-conspirator",
  audio: {
    defaultTrackId: "teresa-teng",
    specialTrackId: "dragon-vow-proposal",
    tracks: [
      { id: "teresa-teng", label: "Teresa Teng", vibe: "classic", src: audio("Teresa Teng") },
      { id: "cozy-candlelight", label: "Candle Archive", vibe: "cozy", src: audio("cozy-candlelight") },
      { id: "veil-of-glyphs", label: "Veil of Glyphs", vibe: "mysterious", src: audio("veil-of-glyphs") },
      { id: "chaos-sidequest", label: "Chaos Sidequest", vibe: "playful", src: audio("chaos-sidequest") },
      { id: "distance-oath", label: "Distance Oath", vibe: "emotional", src: audio("distance-oath") },
      { id: "dragon-vow-proposal", label: "Dragon Vow", vibe: "proposal", src: audio("dragon-vow-proposal") }
    ]
  },
  vault: {
    extraMedia: [
      vid("tiktok_making-4", "TikTok making 4"),
      vid("tiktok_making-5", "TikTok making 5"),
      vid("tiktok_making-6", "TikTok making 6"),
      vid("tiktok_making-7", "TikTok making 7"),
      vid("tiktok_making-8", "TikTok making 8"),
      vid("tiktok_making-9", "TikTok making 9"),
      vid("tiktok_making-10", "TikTok making 10"),
      vid("tiktok_making-11", "TikTok making 11"),
      vid("tiktok_making-12", "TikTok making 12")
    ]
  },
  locked: {
    password: "Smeagol",
    hint: "The most precious things ever given are never placed in plain sight...\nthey are hidden where only the heart knows to look",
    secretTitle: "Classified Origin File",
    secretBody: [
      "Record shows tiny chaos agent archived as small_tinu.",
      "Mission verdict: still lethal with one smile.",
      "Archive note: tiny legend, maximum cuteness."
    ],
    secretMedia: img("small_tinu", "Small Tinu archive"),
    secretGallery: [
      img("small_tinu", "Small Tinu archive 1"),
      img("small_tinu-2", "Small Tinu archive 2"),
      img("small_tinu-3", "Small Tinu archive 3")
    ]
  },
  finalPrompt: {
    title: "Will you be my Valentine, Fiance edition?",
    body: "No spell stronger than this: stay weird with me, forever.",
    yesLabel: "Yes, always",
    noLabel: "Need one more chapter",
    noResponse: "Accepted. I owe you dessert + chapter DLC.",
    yesResponse: "Oath sealed. Confetti protocol launched."
  },
  chapters: [
    {
      id: "prologue-first-signal",
      chapterTitle: "Prologue: The First Signal",
      dateLabel: "Case Log: Signal Zero",
      bodyText: [
        "A random ping on insta, then a facetime that ran too long.",
        "I played cool, but fate already opened the file.",
        "U smiled once and the whole room changed alignment."
      ],
      quoteLine: "\"Some signals don't fade. They lock in.\"",
      footnote: "Signal tag: archived as the first spark.",
      heroMedia: img("1-first-insta", "First insta memory"),
      supportingMedia: [img("face_time", "FaceTime call"), img("face_time_2", "FaceTime part 2")],
      tags: ["prologue", "cozy"],
      redactedLine: "Classified note: my sleep schedule was immediately ruined.",
      trackId: "teresa-teng",
      intensity: 0.42,
      stinger: sfx("psynet-pulse")
    },
    {
      id: "chapter-1-first-encounter",
      chapterTitle: "Chapter 1: First Encounter",
      dateLabel: "Entry 01: Movie Night",
      bodyText: [
        "We started with lunch, acting calm while my heart was doing chaos.",
        "I convinced u to hit the movies even though rain was falling outside.",
        "We watched Nobody 2, and by the end the night felt like pure magic."
      ],
      quoteLine: "\"Rain outside, warm seats inside, and u right next to me.\"",
      footnote: "Field note: rain mission succeeded.",
      heroMedia: vid("first-date-vid", "First date video", true),
      supportingMedia: [img("2-dateout", "First date out"), img("3-kiss", "First kiss")],
      tags: ["cozy"],
      redactedLine: "Redacted: convincing u took 2 minutes, falling for u took less.",
      trackId: "teresa-teng",
      intensity: 0.5
    },
    {
      id: "mission-01-reservation-lie",
      chapterTitle: "Mission 01: The Reservation Lie",
      dateLabel: "Dossier 01: Intentional Plot Twist",
      bodyText: [
        "Second date was called an anniversary as a joke.",
        "Then it stopped being a joke and started being real.",
        "We kept acting unserious while building something serious."
      ],
      quoteLine: "\"Best lie ever filed in this codex.\"",
      footnote: "Private note: fake title, real feelings.",
      heroMedia: vid("second date and anniversery lol - vid", "Second date anniversary", true),
      supportingMedia: [],
      tags: ["mission", "goofy"],
      redactedLine: "Hidden memo: that fake anniversary became my favorite date marker.",
      trackId: "teresa-teng",
      intensity: 0.63,
      stinger: sfx("guild-stamp")
    },
    {
      id: "chapter-2-world-of-her",
      chapterTitle: "Chapter 2: The World I Fell Into",
      dateLabel: "Archive: Family & Fire",
      bodyText: [
        "You spoke with a kind of passion that made the whole table disappear. I wasn't listening to the restaurant anymore... I was listening to you. The way your eyes lit up, the way your hands moved when you talked, the quiet confidence resting in your voice - I knew I was witnessing someone rare.",
        "Then you spoon fed me... and somehow that small moment echoed louder than any love confession ever could. Soft. Natural. Ours. Our first baklava dissolved into laughter, little games, and the beginning of rituals we didn't even realize we were creating. Those walls heard our giggles long before they ever heard our silence.",
        "Somewhere between the house jokes, that stolen bathroom kiss, you singing Guilty as Sin, and that dangerously cute dance in the selfie... I stopped feeling like a visitor in your life. I realized something quietly, but with absolute certainty. I was already home."
      ],
      quoteLine: "\"Your world wasn't something I wanted to explore... it was somewhere my soul recognized immediately.\"",
      footnote: "",
      heroMedia: vid("Italian_uncle_story- vid", "Italian uncle story"),
      supportingMedia: [vid("her_happiness- vid", "Her happiness"), vid("her_singingwithme- vid", "Her singing with me")],
      tags: ["cozy", "mission"],
      redactedLine: "Sealed truth: I fell for you in the quiet moments you didn't even realize were changing me.",
      trackId: "teresa-teng",
      intensity: 0.54,
      stinger: sfx("portal-shift")
    },
    {
      id: "mission-02-candlelight-rituals",
      chapterTitle: "Mission 02: Where The Flame Began",
      dateLabel: "Ritual Notes: Night Brew",
      bodyText: [
        "Our first night walk downtown felt small to the world... but quietly enormous to me. The city moved around us - headlights passing, distant laughter, doors opening and closing - yet somehow it felt like everything softened when you were near. Night slowed down for us. Almost like time itself understood it was stepping into something sacred.",
        "And then you smiled... and I finally understood why people spend lifetimes trying to describe light. Those walks were never just steps on pavement. They were sparks. The beginning of something warm... something steady... something impossible to ignore.",
        "Your laugh became my favorite sound without asking permission. Your presence became the place my nervous system learned how to rest. Without realizing it, we weren't just walking through downtown... we were walking toward an us."
      ],
      quoteLine: "\"Some flames don't arrive to burn your world down... they arrive to teach your heart how to stay warm.\"",
      footnote: "",
      heroMedia: vid("cute_vidofus - vid", "Cute video of us", true),
      supportingMedia: [vid("down_town_walk-vid", "Downtown walk", true), vid("her_cute_laughing", "Her cute laughing", true), vid("her_cute_smile-vid", "Her cute smile", true)],
      tags: ["mission", "cozy"],
      redactedLine: "Classified warmth: Somewhere between your smile and those quiet streets... I knew I was no longer walking alone.",
      trackId: "teresa-teng",
      intensity: 0.58,
      stinger: sfx("guild-stamp")
    },
    {
      id: "chapter-3-side-quest-adventure",
      chapterTitle: "Chapter 3: The Queen Takes The Water",
      dateLabel: "Expedition File: Kayak Arc",
      bodyText: [
        "You stepped into that kayak unsure... cautious... maybe even a little scared.\n\nBut I watched something happen that day.\nThe hesitation faded.\nThe warrior showed up.",
        "you were graceful, fearless, impossible to ignore - just like Like Celaena\n\nStroke by stroke... you didn't just learn the water.\nYou claimed it.\n\nAnd somewhere between the waves and your laughter...\nI realized I wasn't just falling for your softness -\nI was falling for your strength.",
        "Then came the tiger park.\nYour favorite creature... powerful, elegant, untamed.\n\nI couldn't help but smile -\nyou've always carried that same energy."
      ],
      quoteLine: "\"No map. No fear. Just us... and whatever horizon dared to wait.\"",
      footnote: "",
      heroMedia: vid("first_kayak-vid", "First kayak video"),
      supportingMedia: [
        vid("The_tiger_park_vid", "Tiger park video"),
        vid("The_tiger_park-vid", "Tiger park video 2"),
        img("The_tiger_park-2", "Tiger park second image")
      ],
      tags: ["adventure"],
      redactedLine: "Agent note: Co-captain confirmed.",
      trackId: "distance-oath",
      intensity: 0.68,
      stinger: sfx("ember-burst")
    },
    {
      id: "mission-03-city-walk",
      chapterTitle: "Mission 03: The two fools",
      dateLabel: "Urban File: Predators & Pavement",
      bodyText: [
        "Somewhere along the way... we stopped trying to look perfect.\n\nThe weird faces came out.\nThe unfiltered laughter.\nThe beautiful chaos.",
        "You saw my foolish side and didn't run\nyou matched it.\n\nThat's when I knew what we had was rare.",
        "Anyone can love the polished version.\nBut us?\nWe loved each other unguarded."
      ],
      quoteLine: "\"Comfort is when your soul stops performing.\"",
      footnote: "",
      heroMedia: vid("making_foolsh_snap videos - vid", "Making foolish snap video", true),
      supportingMedia: [
        img("weird_face_making-1", "Weird face making 1"),
        img("weird_face_making-2", "Weird face making 2"),
        img("weird_face_making-3", "Weird face making 3"),
        img("weird_face_making-4", "Weird face making 4"),
        img("weird_face_making-5", "Weird face making 5")
      ],
      tags: ["mission", "adventure"],
      redactedLine: "Hidden realization: I have never been more myself than when I'm with you.",
      trackId: "distance-oath",
      intensity: 0.62,
      stinger: sfx("guild-stamp")
    },
    {
      id: "chapter-4-proof-of-chemistry",
      chapterTitle: "Chapter 4: The Season of Becoming",
      dateLabel: "Lab Record: Zero Doubt",
      bodyText: [
        "Summer taught us how to begin.\nWinter showed us who we were becoming.",
        "The girl who once stepped into the kayak carefully...\nnow moved like she belonged to the water.\nWatching you grow felt like watching a legend in the making.\nBrave. Adaptive. Alive.",
        "And I couldn't help but think -\nmaybe adventure didn't find you...\nmaybe you were always adventure.\nIf Celaena had a rival, she'd be worried."
      ],
      quoteLine: "\"You didn't just learn the waves... you became one.\"",
      footnote: "Field note: winter revealed the queen.",
      heroMedia: vid("shebecomeprokayak- vid", "She became pro kayak", true),
      supportingMedia: [
        vid("shebecomeprokayak- vid 2", "She became pro kayak 2", true),
        img("kayak_girl_adventure", "Kayak girl adventure"),
        img("kayak_girl_adventure-2", "Kayak girl adventure 2"),
        img("kayak_girl_adventure-3", "Kayak girl adventure 3"),
        img("kayak_girl_adventure-4", "Kayak girl adventure 4"),
        img("kayak_girl_adventure-5", "Kayak girl adventure 5")
      ],
      tags: ["cozy"],
      redactedLine: "Field report: Attraction upgraded to awe.",
      trackId: "distance-oath",
      intensity: 0.66
    },
    {
      id: "mission-04-end-of-summer",
      chapterTitle: "Mission: The End of Summer",
      dateLabel: "Season Log: Late Golden Days",
      bodyText: [
        "We ran through the last warm days like we were trying to steal time itself.\nWatching you pick from the menu shouldn't have been unforgettable...\nbut somehow, you made even that look beautiful.",
        "Neck kisses.\nSleepy peace beside you.\nLaughter between seasons.",
        "Summer ended on the calendar...\nbut it never really left us."
      ],
      quoteLine: "\"Seasons changed.\nMy feelings didn't.\"",
      footnote: "Season note: warmth archived permanently.",
      heroMedia: vid("food_menu_picking - vid", "Food menu picking", true),
      supportingMedia: [
        vid("kissing_her_intheneck -vid", "Kissing her in the neck", true),
        vid("sleeping_beauty-vid", "Sleeping beauty", true),
        img("winter_date", "Winter date"),
        img("winter_date2", "Winter date 2")
      ],
      tags: ["mission", "cozy"],
      redactedLine: "Confirmed: Wherever you are... feels like summer.",
      trackId: "cozy-candlelight",
      intensity: 0.67,
      stinger: sfx("guild-stamp")
    },
    {
      id: "chapter-5-chaos-but-ours",
      chapterTitle: "Chapter 5: The Making of TikTok",
      dateLabel: "Winter Log: Indoor TikTok Lab",
      bodyText: [
        "Winter tried to trap us indoors...\nso we turned the house into a stage.",
        "Trend after trend.\nLaugh after laugh.\nTake after take.",
        "Somewhere between best friends and soulmates...\nwe built our own kind of fun.\nNot perfect.\nNot serious.\nJust ours."
      ],
      quoteLine: "\"Joy looks better when it's shared.\"",
      footnote: "Mission note: house studio, heart studio.",
      heroMedia: img("tiktok_making", "TikTok making 1"),
      supportingMedia: [
        img("tiktok_making-2", "TikTok making 2"),
        img("tiktok_making-3", "TikTok making 3"),
        img("tiktok_making-4", "TikTok making 4"),
        img("tiktok_making-5", "TikTok making 5"),
        img("tiktok_making-6", "TikTok making 6"),
        img("tiktok_making-7", "TikTok making 7"),
        img("tiktok_making-8", "TikTok making 8"),
        img("tiktok_making-10", "TikTok making 10"),
        img("tiktok_making-11", "TikTok making 11"),
        img("tiktok_making-12", "TikTok making 12")
      ],
      tags: ["goofy"],
      redactedLine: "Status update: Married energy detected early.",
      trackId: "chaos-sidequest",
      intensity: 0.7,
      stinger: sfx("contract-sign")
    },
    {
      id: "trial-distance",
      chapterTitle: "Trial: The Distance",
      dateLabel: "Trial Record: Long Nights",
      bodyText: [
        "Distance tested us - quietly, relentlessly.\nScreens replaced touches.\nSilence sometimes replaced laughter.",
        "We argued.\nWe missed each other.\nWe learned.",
        "But even oceans couldn't teach our hearts how to quit.\nBecause every night ended the same way -\nchoosing us again."
      ],
      quoteLine: "\"Distance was loud... but love was louder.\"",
      footnote: "Signal note: reconnection always won.",
      heroMedia: vid("play_fighting-vid", "Play fighting call", true),
      supportingMedia: [
        img("Face_time", "Face time"),
        img("face_time_2", "Face time 2"),
        vid("co-living- vid", "Co living video", true),
        vid("co-lving - vid", "Co living setup video", true)
      ],
      tags: ["trial", "cozy"],
      redactedLine: "Transmission secured: Always you.",
      trackId: "distance-oath",
      intensity: 0.74,
      stinger: sfx("trial-fracture")
    },
    {
      id: "final-mission-oath",
      chapterTitle: "Final Mission: The Oath",
      dateLabel: "Seal Log: Proposal Night",
      bodyText: [
        "No decoys.\nNo second plans.\nJust a heart standing fully exposed.",
        "When I knelt, time didn't slow...\nit stilled.\nAnd when you said yes -\nthe universe quietly shifted into place.",
        "Every chapter before this suddenly made sense.\nEvery step had been guiding me here.\nNot to a moment...\nbut to a lifetime with you."
      ],
      quoteLine: "\"In every lifetime, in every version of this world...\nI would still find you.\"",
      footnote: "Oath note: one question, infinite yes.",
      heroMedia: img("the_process", "Proposal process 1"),
      supportingMedia: [
        img("the_process-2", "Proposal process 2"),
        img("the_process-3", "Proposal process 3"),
        img("the_process-4", "Proposal process 4"),
        img("the_process-5", "Proposal process 5"),
        img("proposal_1", "Proposal 1"),
        img("proposal_2", "Proposal 2"),
        img("proposal_3", "Proposal 3"),
        img("proposal_4", "Proposal 4")
      ],
      tags: ["proposal", "mission"],
      redactedLine: "Case closed: forever begins now.",
      trackId: "dragon-vow-proposal",
      intensity: 0.95,
      stinger: sfx("rider-oath")
    },
    {
      id: "epilogue-after-oath",
      chapterTitle: "Epilogue: After the Oath",
      dateLabel: "Forward File: Next Era",
      bodyText: [
        "And then... we danced.\nNot because music was playing -\nbut because our hearts didn't know how to stand still anymore.",
        "Laughter came easier.\nLove felt deeper.\nThe future felt closer.",
        "This wasn't the end of our story.\nIt was the first page of the life we're about to write together."
      ],
      quoteLine: "\"The best part of us... is still on the way.\"",
      footnote: "Forward note: joy in motion.",
      heroMedia: vid("Video Project 2", "Video Project 2 dance"),
      supportingMedia: [vid("Video Project 3", "Video Project 3 dance")],
      tags: ["epilogue", "cozy"],
      redactedLine: "Next chapter loading: Husband & Wife.",
      trackId: "dragon-vow-proposal",
      intensity: 0.82,
      stinger: sfx("portal-shift")
    }
  ]
};

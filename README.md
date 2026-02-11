# library-codex-valentine

Full-screen fantasy scroll journey with a chapter-driven **World Engine** (VFX, sigils, and adaptive audio).

## Stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- Framer Motion
- Static/local only (no backend)

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Checks:

```bash
npm run lint
npm run build
```

## Data-Driven Content

All story and media config is in `content/book.ts`.

Each chapter includes:

- `trackId`
- `intensity` (0-1)
- optional `stinger` SFX

Also includes chapter copy, tags, media, redaction line, and final/locked content.

## World Engine

Modules are mapped from chapter tags in `lib/world-engine.ts`:

- Psy/Changeling
- Guild Hunter
- Fourth Wing
- Flames of Chaos
- Percy quest/ocean
- Legacy glyphs
- Rune/clockwork
- Shatter fracture
- Assassin contracts

Tag → watermark pattern is also defined there.

## Icon System

Original sigils in `components/icons/SigilIcons.tsx`:

- star
- dagger
- wing
- flame
- wave
- glyph
- gear
- shard
- wax seal

Sigils are used in:

- TOC modal
- Bond Meter rail
- Chapter headers
- Faint page watermarks

## Audio

Music + SFX files:

- `public/audio/*.mp3`
- `public/audio/sfx/*.mp3`

Features:

- chapter enter track switching (IntersectionObserver-driven active section)
- crossfade (~2.4s)
- per-chapter intensity scaling
- optional chapter stinger SFX
- music orb UI: play/pause, next, volume, SFX mute

## Fullscreen Scroll Experience

- each chapter is a full-screen scene
- floating codex panels within scene
- parallax cinematic background layers
- magical media frames with reveal + shimmer
- Memory Vault, Locked Archive, Final Oath as full-screen sections

## Key Files

```text
components/book/BookShell.tsx
components/scroll/ChapterSceneSection.tsx
components/scroll/CinematicBackground.tsx
components/scroll/AudioManager.tsx
components/scroll/BondMeter.tsx
components/scroll/TocModal.tsx
components/icons/SigilIcons.tsx
lib/world-engine.ts
content/book.ts
```

## Deploy (GitHub + Vercel)

```bash
git init
git add .
git commit -m "World engine fantasy scroll upgrade"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

Then import repo in Vercel and deploy.


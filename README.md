# SnowCraft - Fan Remake

A clean-room fan remake of **SnowCraft** (Windows, 2001) built as a modern web app with Next.js, HTML5 Canvas, and TypeScript.

## Attribution and Disclaimer

**This is an unofficial fan remake and is not affiliated with Nicholson NY.**

- Inspired by SnowCraft (Windows, 2001).
- Original developer: Nicholson NY.
- Original publisher: Nicholson NY.
- Source: https://www.myabandonware.com/game/snowcraft-du6#download

All game assets (art, code, sounds) in this remake are newly created and original. No proprietary assets from the original game were extracted or reused.

## Local Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
npm start
```

## Deployment on Vercel

This project deploys to Vercel with zero configuration:

1. Push this repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Vercel auto-detects Next.js and deploys. No extra settings needed.

Alternatively, use the Vercel CLI:

```bash
npx vercel --prod
```

## Embedding in Your Personal OS Site

The game exports an embeddable React component. Import and use it like this:

```tsx
import SnowcraftApp from '@/components/SnowcraftApp';

// In your OS window component:
function SnowcraftWindow() {
  return (
    <div style={{ width: 800, height: 600 }}>
      <SnowcraftApp mode="embedded" />
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'standalone' \| 'embedded'` | `'standalone'` | Standalone fills the viewport. Embedded fills its parent container. |
| `hideChrome` | `boolean` | `false` | When true, hides any outer UI chrome so your OS window manager can supply its own titlebar. |

### URL-based Embedding

You can also embed via iframe using the standalone route:

```html
<iframe
  src="/apps/snowcraft?embedded=true&hideChrome=true"
  width="800"
  height="600"
  style="border: none;"
></iframe>
```

### Behavior in Embedded Mode

- Fills its parent container and responds to resizing
- Recomputes canvas scale while maintaining aspect ratio
- Only captures Tab, Escape, and Space keyboard events (does not steal global shortcuts)
- Works inside resizable windows

## Gameplay

### Controls
- **Left-click** a red unit to select it
- **Right-click** to move the selected unit within its movement range
- **Left-click and hold** to charge a throw, release to fire a snowball
- **Tab** to cycle through your units
- **Escape** to pause

### Objective
Knock out all enemy (green team) units to clear each level. Your team of 3 faces increasingly tough opponents across 10 levels.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Rendering:** HTML5 Canvas (no heavy game engines)
- **Styling:** Tailwind CSS for UI panels
- **Audio:** Procedural sound via Web Audio API (no external audio files)
- **Sprites:** Procedurally drawn via Canvas API (no external sprite files)
- **PWA:** Web App Manifest + Service Worker for offline support

## Architecture

```
src/
  app/                  # Next.js App Router pages
  components/           # React components
    SnowcraftApp.tsx    # Main embeddable component
    GameCanvas.tsx      # Canvas with resize handling
    ui/                 # Menu screens, HUD, overlays
  game/                 # Pure game logic (no React dependency)
    engine.ts           # Game loop (requestAnimationFrame + fixed timestep)
    state.ts            # Game state management
    renderer.ts         # Canvas rendering
    entities/           # Unit, Snowball, Obstacle factories
    systems/            # Movement, Combat, Collision, AI, Particles
    levels/             # Level data and progression
    audio/              # Procedural sound generation
  lib/                  # Math utilities
  __tests__/            # Unit tests
```

The game logic in `src/game/` is completely decoupled from React and could be reused with any renderer.

## License

This fan remake project is provided as-is for educational and entertainment purposes. It is not affiliated with, endorsed by, or connected to Nicholson NY or the original SnowCraft game.

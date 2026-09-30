# 다람쥐의 가을 준비 — Prototype 01

Phaser 3 + TypeScript, 1600×900 design coordinates, FIT scaling. Five acorns support touch and mouse dragging into a generous basket target. Off-target drops return gently; no score, timer or failure. Number feedback, Korean device speech synthesis, progress artwork and completion animation are included.

## Development

From repository root: `npm install`, `npm run check`, `npm run build`. Build preserves the existing static homepage and outputs the bundled game plus site assets to `dist/`. `npm run dev` serves the source site. Rebuild after TypeScript changes.

Entry: `/games/autumn-preparation/index.html`. Homepage integration: `/games.html?id=acorn-collector`. Existing game ID and iframe bridge retained for mute, restart, fullscreen and completion. Old game source is preserved for comparison.

## Reusable components

`games/shared/core/`: GameShell (Phaser scaling / bridge), Sound (audio unlock, chimes, Korean speech), Progress, Drag (return / hover / accept), Success. Asset manifest and scene positions are in `src/assets.ts`, separate from the interaction code.

Background generated from the approved autumn forest visual reference without game objects. The separate transparent atlas was sliced into idle/happy squirrel, acorn and basket textures. No CSS/SVG representational artwork is used. Reference concept image is the library-provided concept and used only for the game catalog cover.

## Validation and limitations

TypeScript check and production build pass. Image assets inspected at full resolution and alpha verified. Cloud browser preview was blocked by environment security policy before it could load, so actual pointer/touch, speech output and in-browser visual QA remain unverified. Korean voice availability depends on the user's OS/browser; chimes and number feedback remain independent. Verify five successful drops, one off-target drop, restart, mute and fullscreen on PC and Android tablet before classroom use.

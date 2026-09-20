# Kinder Edu — Common UI Design System

**Version: v1.0**  
**Status: Current / Approved**

> This document is the source of truth for shared visual rules across the Kinder Edu ecosystem. Service-specific UIs may differ, but they must preserve this common brand DNA.

## Versioning rule

- v1.0 is the initial approved common UI design system.
- When an approved common design rule changes, increment the version and update this document in the same change.
- Do not increment the version for implementation-only fixes that do not change an approved design rule.
- New work must follow the latest approved version.
- Record each design-rule revision in the Change Log at the bottom.

## 1. Core direction

**Clean + Warm + Editorial + Character/IP**

- Do not use an overly colorful, toy-like kindergarten aesthetic.
- Keep the interface modern, spacious, restrained, and content-led.
- The services share a visual language; they do not need identical layouts.

## 2. Color

- Background: white / warm white / off-white.
- Surface: white or very light warm gray.
- Primary text: black / charcoal.
- Secondary text: gray.
- Brand accent: restrained, natural green.
- Supporting colors: limited and content-dependent.
- Avoid excessive saturated primary colors.
- UI remains restrained; content imagery and illustrations provide most of the color.

## 3. Panels and cards

- Use medium-to-large rounded corners.
- Keep visible gaps between independent panels.
- Prefer thin/subtle borders and restrained shadows.
- Use generous internal padding and whitespace.
- Do not pack cards with unnecessary information.
- Independent rounded-window/card composition is a recurring visual motif.

## 4. Typography

- Product/UI/body/navigation: **Pretendard**
- Character dialogue/speech bubbles: **Poor Story**
- Handwritten memo/doodle/accent: **Nanum Pen Script**
- Pretendard should cover the large majority of interface text.
- Handwritten fonts are accents, not general UI fonts.
- Use open-source/OFL fonts. Prefer self-hosted WOFF2 for production.
- If font assets are unavailable, use fallbacks rather than downloading arbitrary binaries.

## 5. Character / IP usage

Characters are brand devices, not filler decoration.

Main:
- Hero: three representative characters as the primary IP presence.
- 놀며자라 card: seasonal/play/education visual.
- 프로그램 card: actual program UI visual.
- 유아용 게임 card: actual game screen/app icon.
- 만들기 card: actual outputs such as name tags, cards, stationery, stickers.
- 웹툰 card: actual comic panel.

Do not repeat character illustrations across every card simply to fill space.

## 6. Hand-drawn accents

Allowed in moderation:
- short handwritten notes
- arrows
- underlines
- small hearts
- leaves
- simple doodles

The hierarchy is:

**Clean UI → Editorial Layout → Hand-drawn Accent → Character IP**

Decorative elements must not interfere with usability or information hierarchy.

## 7. Spacing and information density

- Prefer low information density and generous whitespace.
- Especially on the Main page, avoid long descriptions, dense lists, statistics, or unnecessary navigation.
- A service entry should generally contain: service name, representative visual, very short supporting copy when needed, and entry interaction.

## 8. Service-specific UI directions

- **Main:** Brand / IP centered.
- **놀며자라:** Editorial / Magazine.
- **프로그램:** Productivity UI + Character/IP layer.
- **유아용 게임:** App Store-inspired visual discovery.
- **만들기:** Creator / Template platform.
- **웹툰:** Comic / Character centered.

Shared visual DNA must remain recognizable while each service keeps an interface appropriate to its function.

## 9. Main page layout

Desktop baseline:
- Hero: approximately 40% of the first viewport.
- Category area: approximately 60%.

Category area:
- Left ~25%: 프로그램 (top), 만들기 (bottom)
- Center ~50%: 놀며자라
- Right ~25%: 유아용 게임 (top), 웹툰 (bottom)

Rules:
- Category panels do not touch.
- Maintain clear gaps.
- Use independent rounded panels.
- The center 놀며자라 panel has the strongest category emphasis.
- Ratios are design baselines, not rigid values that should break responsive layouts.

## 10. Program UI baseline

The 프로그램 service may use a shared shell:
- Left: App Dock
- Center: Program Workspace
- Right: Character/IP Panel
- Desktop conceptual ratio: approximately 1:6:3

Product UI and Brand/IP Layer remain separate. System status and errors must be communicated clearly in the product UI, not only through character dialogue.

## 11. Responsive principle

- Desktop fidelity is the first priority for the initial implementation.
- Preserve the usable content/workspace area as width decreases.
- Ratios are allowed to adapt.
- Avoid over-designing mobile behavior before the desktop system is validated.

## Change Log

### v1.0 — 2026-09-20
- Established the initial approved common UI design system.
- Defined common visual direction, color, typography, panel/card treatment, character/IP usage, information density, service-specific UI identities, Main layout, and Program UI baseline.

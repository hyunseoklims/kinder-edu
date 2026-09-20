# Kinder Edu — Common UI Design System

**Version: v1.4**  
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
- Primary brand: **지니쌤의 킨더에듀**. The primary audience is adult educators, especially teachers in their 30s–40s.
- Primary UI: Charcoal `#2E2E2E` + Off White `#FAF8F4`.
- Supporting reference accents: Pink Beige `#E7B8B0`, Sky Blue `#A7B8D9`, Warm Yellow `#F2C94C`.
- The previous green-led visual direction is retired.
- Accent colors must remain restrained; avoid childish rainbow palettes and cosmetics/lifestyle-brand styling.
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

## 11. Responsive and viewport safety

Responsive behavior is a functional requirement, not an optional polish step.

- No supported viewport may produce unintended horizontal page scrolling, clipped primary content, or inaccessible controls.
- Browser zoom at 100% must be usable without requiring the user to reduce zoom.
- Tablet browsers using **Desktop site mode** are explicitly supported. Galaxy Tab A9-class widths are part of the regression target.
- Desktop ratios such as Main 25:50:25 and Program 1:6:3 are preferred proportions, not hard minimum widths.
- Use fluid sizing (`minmax(0,...)`, `clamp()`, percentages, flexible gaps/padding) before changing the information architecture.
- Grid/flex children that contain long content must be allowed to shrink (`min-width: 0`) where appropriate.
- At compact-desktop/tablet widths, preserve the desktop composition when it remains readable by reducing gaps, padding, secondary copy, and decorative elements.
- If the composition can no longer remain usable, switch to a tablet/mobile layout rather than allowing clipping.
- Mobile layouts may stack content vertically.
- Decorative artwork may crop; primary text, navigation, actions, and product workspace must not.
- Validate Main, 놀며자라, and 프로그램 pages at wide desktop, notebook/compact desktop, tablet/Desktop-site mode, and mobile widths after meaningful layout changes.

## Change Log

### v1.4 — 2026-09-20
- Shifted the brand surface from generic colored-pencil decoration toward the established webtoon visual language.
- Use webtoon-style character drawings as the primary visual asset; UI color uses pastel fills with visible colored-pencil texture.
- Added initial Games, Creator, and Webtoon page structures. Games intentionally omits search/categories/new-game sections until real games exist. Creator places Our Class in the sidebar. Webtoon uses a three-character hover/tap hero and three vertical episode streams.

### v1.3 — 2026-09-20
- Adopted colored-pencil / scanned-paper editorial styling as the shared visual expression for branded surfaces.
- Homepage uses visible pencil strokes, paper texture, hand-drawn accents, and the Kinder Edu open-page logo while keeping functional UI readable and restrained.
- Character and content artwork should carry the strongest colored-pencil texture; product controls remain clean.

### v1.2 — 2026-09-20
- Set the main brand name to **지니쌤의 킨더에듀** and clarified the adult-teacher audience.
- Replaced the green-led palette with the approved reference palette: charcoal, off-white, pink beige, sky blue, and warm yellow.
- Refined the visual target toward a professional education/editorial platform; Polychromos-like color is limited to small analogue accents.
- Avoid childish and cosmetics/lifestyle-brand aesthetics.

### v1.1 — 2026-09-20
- Added viewport-safety requirements.
- Added explicit support for tablet browsers in Desktop site mode, including Galaxy Tab A9-class widths.
- Defined no-clipping/no-horizontal-scroll behavior at 100% browser zoom.
- Clarified that desktop layout ratios must remain fluid rather than impose fixed minimum widths.

### v1.0 — 2026-09-20
- Established the initial approved common UI design system.
- Defined common visual direction, color, typography, panel/card treatment, character/IP usage, information density, service-specific UI identities, Main layout, and Program UI baseline.

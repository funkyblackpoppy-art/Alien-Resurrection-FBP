# Black Poppy Grimoire v18 — Implementation Guide & Design Specs

> **App:** Book of Shadows v18 · The Master Grimoire  
> **File:** `blackpoppygrimoirev18_1.html` (single-file SPA, ~5920 lines)  
> **Audit date:** 2026-06-17  
> **Status:** Pre-test audit complete — fixes required before QA sign-off

---

## 1. App Overview

A mystical single-page grimoire app combining:
- **Daily tarot draw** — Rider-Waite-Smith deck with embedded base64 images, upright/reversed states
- **Ritual control strip** — buttons to reroll daily items (moon phase, astrology, tarot, word magic, lore)
- **Journal leaves** — three textarea inputs (ritual, dream, sign) for daily entries
- **Spell basket** — structured form for setting/tracking intentions
- **Archive** — localStorage-persisted history of journal entries and snapshots
- **Four views** — Landing, Ritual, Journal, Archive (toggled via `.view` / `.view.active`)

### Design Aesthetic
- **Parchment substrate** — aged paper simulation via layered `radial-gradient` and `repeating-linear-gradient`
- **Sacred Chaos palette** — hot pink (`#ff2d8e`) as the "scream voice" against warm parchment (`#f0e8d4`)
- **Organic grimoire layout** — cards, leaves, and panels subtly rotated (0.15°–0.45°) as if hand-laid
- **Typography hierarchy** — 6 Google Fonts: IM Fell English, Cormorant Garamond, Libre Baskerville, Bebas Neue, Special Elite, Caveat

### Color Token Reference
| Token | Value | Role |
|---|---|---|
| `--paper` | `#f0e8d4` | Primary background |
| `--paper-2` | `#e8dec6` | Secondary parchment |
| `--ink` | `#1a1612` | Body text |
| `--accent` | `#ff2d8e` | Hot pink — labels, glyphs, dividers |
| `--accent-2` | `#ff007a` | Pink — stronger accent |
| `--rose` | `#6b1f2e` | Blood-rose secondary |
| `--purple` | `#2a1740` | Mystical authority |
| `--dark` | `#14110d` | Button fill, deepest ink |
| `--soft-ink` | `rgba(26,22,18,0.78)` | Body copy |

---

## 2. Architecture

```
Single HTML file
├── <head>          — meta, viewport, Google Fonts
├── <style>         — ~2650 lines CSS (custom properties, components, responsive)
├── <body>
│   └── .app-shell
│       └── .frame-wrap
│           ├── .botanical-frame (SVG decorative border, pointer-events:none)
│           └── .content-layer
│               ├── .micro-nav (top nav pills)
│               ├── section.view#landingView
│               ├── section.view#ritualView
│               ├── section.view#journalView
│               └── section.view#archiveView
└── <script>        — ~3200 lines JS (data, logic, localStorage, render)
```

### View Switching
- `.view { display: none }` / `.view.active { display: block }`
- JS `showView(id)` adds `.active` to target, removes from others
- **Known bug:** `#landingView` uses class `landing-view` not `view` — may not be hidden by the view system (see Bug JS-M1)

### Data Persistence
- `localStorage` keys: `bos:journal`, `bos:archive`, `bos:spellBasket`, `bos:snapshot`, `bos:rerolls`, `wordmagik:today:<date>`
- Daily items seeded by `new Date().toDateString()` for consistent same-day values

---

## 3. Audit Findings — Priority Bug List

### CRITICAL (must fix before any test)

| ID | Layer | Issue | Location |
|---|---|---|---|
| JS-C1 | JavaScript | **XSS via innerHTML** — journal entries and archive cards interpolated directly into `.innerHTML`. Malicious `<script>` or event handlers in saved text will execute. | `archiveCard()`, `ritualList.innerHTML`, `dreamSignList.innerHTML`, `snapshotList.innerHTML` ~line 5755–5782 |
| A-C1 | HTML | **No semantic landmarks** — zero `<header>`, `<main>`, `<nav>`, `<footer>`. Screen readers cannot navigate. | lines 2451–2664 |
| A-C2 | HTML | **Form labels unassociated** — all `basket-label` elements have no `for=` attribute; `<textarea>` inputs have no `<label>` at all. | Basket form ~line 5280; `#ritualInput`, `#dreamInput`, `#signInput` ~lines 2618–2632 |

### HIGH

| ID | Layer | Issue | Location |
|---|---|---|---|
| JS-H1 | JavaScript | **No try/catch on `load()`** — `JSON.parse(localStorage.getItem(key) \|\| '[]')` crashes entire app on corrupt data. | `load()` function ~line 5364 |
| JS-H2 | JavaScript | **Key mismatch: `'lore'` vs `'witchlore'`** — reroll counter written to `'lore'` but read from `'witchlore'`. Lore reroll permanently broken. | ~lines 4934, 5422 |
| A-H1 | HTML/CSS | **Color contrast failure** — `--accent` (#ff2d8e) on `--paper` (#f0e8d4) = ~2.8:1 (WCAG AA requires 4.5:1 for normal text). | All pink label/stamp elements |
| CSS-C1 | CSS | **Horizontal scroll on tablets** — `.composition` minimum width ~808px but breakpoint only fires at 1180px. | `.composition` rule ~line 296 |
| CSS-C2 | CSS | **Basket grid overflows mobile** — `grid-template-columns: 1fr 1.4fr auto` has no mobile override. | `.basket-add-row` |

### MEDIUM

| ID | Layer | Issue | Location |
|---|---|---|---|
| JS-M1 | JavaScript | **No back navigation** from ritual/journal/archive views to landing. No pill or button restores landing. | View nav ~line 5797 |
| JS-M2 | JavaScript | **Duplicate event bindings** on `[data-reroll]` buttons — both direct `addEventListener` in `render()` and global delegation. Each reroll fires twice. | ~lines 5707–5724, 5818–5823 |
| JS-M3 | JavaScript | **`saveTodaySnapshot` uses `window.dailySnapshot`** set only after `render()` completes — if render throws, snapshot is undefined. | ~line 5889 |
| CSS-H1 | CSS | **Gap in responsive coverage** — no breakpoints between 720px and 1180px. Tablets mostly uncovered. | `@media` blocks |
| CSS-H2 | CSS | **`.view` / `landing-view` class mismatch** — landing section may not be hidden by the view toggle system. | `.landing-view` / `.view` |
| CSS-H3 | CSS | **`--pink-loud` undefined** — `var(--accent-2, var(--pink-loud))` silently renders no color if `--accent-2` is empty. | `.basket-actions` |

### LOW

| ID | Layer | Issue | Location |
|---|---|---|---|
| JS-L1 | JavaScript | `Math.random()` stamp number re-randomizes on every render (cosmetic inconsistency). | ~lines 5313, 5540 |
| JS-L2 | JavaScript | Zodiac Capricorn wrap-around logic undocumented and fragile. | `getAstrologyData()` ~line 5018 |
| JS-L3 | JavaScript | Same localStorage date key built two different ways — fragile if one changes. | ~lines 5607, 5649 |
| A-M1 | HTML | No skip-navigation link — keyboard users tab through 15+ buttons on every load. | Top of body |
| A-M2 | HTML | No `aria-hidden` toggling on inactive views — CSS failure exposes hidden content to AT. | View sections |
| CSS-L1 | CSS | No 375px/480px breakpoints — hero title at 54px minimum is too large at 375px. | `@media (max-width:720px)` |
| CSS-L2 | CSS | Duplicate `.torn-pink` rule with conflicting `top` values. | Two locations in stylesheet |
| CSS-L3 | CSS | `backdrop-filter: blur(1px)` on 6 element types — GPU compositing overhead on low-end mobile; no `prefers-reduced-motion` guard. | ~line 891 |

---

## 4. Fix Implementation Plan

### Phase 1 — Critical Fixes (before any test session)

**JS-C1: XSS Fix**
Replace all direct `.innerHTML` interpolation of user data with a sanitizer:
```js
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
// Then: entry.text → escHtml(entry.text) everywhere in template literals
```

**JS-H1: Safe `load()`**
```js
function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}
```

**JS-H2: Fix key mismatch**
Change all occurrences of `'lore'` reroll key to `'witchlore'` (or vice versa — pick one).

**A-C2: Associate form labels**
Add `id` attributes to each textarea/input and matching `for=` to each label. Add `<label>` elements wrapping or preceding `#ritualInput`, `#dreamInput`, `#signInput`.

### Phase 2 — High Priority

**CSS-C1: Fix tablet overflow**
```css
@media (max-width: 900px) {
  .composition { grid-template-columns: 1fr; }
  .basket-add-row { grid-template-columns: 1fr; }
}
```

**JS-M2: Fix duplicate reroll bindings**
Remove direct `addEventListener` calls in `render()` for `[data-reroll]` buttons; use only the global delegation.

**JS-M1: Add landing back-navigation**
Add a "← Return" pill button to ritual/journal/archive view headers that calls `showView('landingView')`.

**CSS-H2: Fix class mismatch**
Add `view` class to `#landingView` element: `<section class="view landing-view active" id="landingView">`.

### Phase 3 — Medium / Polish

- Add `aria-label` to all `<section>` elements
- Add `aria-live="polite"` to tarot card area for screen reader announcements on draw
- Add `@media print` rule to suppress decorative backgrounds
- Add `@media (prefers-reduced-motion: reduce)` to disable `backdrop-filter` and transitions
- Add skip-navigation: `<a class="skip-link" href="#mainContent">Skip to content</a>`
- Fix `--pink-loud` — define it or remove the fallback

---

## 5. Test Checklist

### Functional Tests
- [ ] Landing view loads on first open
- [ ] All nav pills show correct view
- [ ] Back navigation works from all views
- [ ] Tarot card draws on page load with image visible
- [ ] Reroll buttons change content (all 5 daily items)
- [ ] Lore reroll actually changes (after JS-H2 fix)
- [ ] Journal textarea saves on "Save Entry" click
- [ ] Saved entries appear in Archive view
- [ ] Spell basket form saves and lists entries
- [ ] Archive entries persist across page refresh
- [ ] Import/export backup works

### Responsive Tests
- [ ] 375px mobile — no horizontal scroll
- [ ] 768px tablet — single-column layout
- [ ] 1024px — composition grid renders correctly
- [ ] 1440px desktop — full 3-column layout

### Browser Tests
- [ ] Chrome latest
- [ ] Safari (check backdrop-filter support)
- [ ] Firefox (check IM Fell English rendering)
- [ ] Mobile Safari

### Accessibility Tests
- [ ] Tab through all interactive elements in logical order
- [ ] Screen reader announces tarot card name on draw
- [ ] Form fields announced with labels
- [ ] No WCAG contrast failures (after fixing pink label contrast)

---

## 6. Design Specs Reference

### Typography Scale
| Role | Font | Size | Weight |
|---|---|---|---|
| Hero title | IM Fell English | clamp(58px, 9vw, 100px) | 400 |
| Hero script | IM Fell English italic | clamp(24px, 3.8vw, 42px) | 400 |
| Page title | IM Fell English | clamp(38px, 5vw, 58px) | 400 |
| Card name | Cormorant Garamond | 32px | 400 |
| Body copy | Libre Baskerville | 16px | 400 |
| Eyebrow labels | Bebas Neue | 10–11px | — |
| Journal input | Georgia (fallback-only) | 16px | 400 |
| Script annotations | Caveat | variable | 400–700 |

### Spacing System
- App shell padding: `18px`
- Content layer padding: `24px 28px 42px`
- Card border-radius: `26px 18px 30px 14px` (organic, hand-laid feel)
- Tarot stage border-radius: `210px 190px 38px 52px` (arch top)
- Grid gap: `28–34px` (composition), `22px` (journal river), `24px` (archive)

### Component Inventory
| Component | Class | Description |
|---|---|---|
| Nav pill | `.pill` | Rounded border button, transforms up on hover |
| Dark pill | `.pill.dark` | Ink-filled variant |
| Sheet | `.sheet` | Info card with double-border inset |
| Tarot stage | `.tarot-stage` | Arch-top centered card holder |
| Tarot card | `.tarot-card` + `.tarot-card-inner` | Card frame with embedded RWS image |
| Ribbon | `.ribbon` | Left-bordered contextual note |
| Medallion | `.medallion` | Circular element token |
| Leaf | `.leaf` | Journal page with textarea |
| Archive rail | `.archive-rail` | Scrollable entry list |
| Control strip | `.ritual-control-strip` | Pill-button row for rerolling |
| Tiny action | `.tiny-action` | Small ghost button inside cards |

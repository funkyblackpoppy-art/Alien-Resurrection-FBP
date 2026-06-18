# Sacred Chaos Portal — UI/UX Design Specification
### Funky Black Poppy | App Launcher for 20–30 Single-Page HTML Apps
**Version 1.0 | June 2026**

---

## TABLE OF CONTENTS

1. [Color Palette](#1-color-palette)
2. [Typography](#2-typography)
3. [App Card Component](#3-app-card-component)
4. [Grid Layout](#4-grid-layout)
5. [Filter/Search Bar](#5-filtersearch-bar)
6. [Header](#6-header)
7. [Status Badge System](#7-status-badge-system)
8. [Admin Panel](#8-admin-panel)
9. [Loading States and Entrance Animations](#9-loading-states-and-entrance-animations)
10. [Mobile Navigation](#10-mobile-navigation)
11. [Implementation Notes](#11-implementation-notes)

---

## 1. COLOR PALETTE

All colors are defined as CSS custom properties on `:root`. Every component in this spec references these variables exclusively — no hardcoded hex values appear in component CSS.

### 1.1 Design Intent

The palette is cosmic and handcrafted: near-black backgrounds evoke deep space; deep purple and electric teal create tension between mysticism and technology; gold brings warmth and value signaling; crimson rose is the alarm color, used sparingly for danger and sale states.

### 1.2 Full CSS Custom Properties Block

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  /* ─── BACKGROUNDS ─────────────────────────────────── */
  --color-bg-void:        #0a0a0f;   /* deepest background, page canvas */
  --color-bg-base:        #0d0d14;   /* standard page background */
  --color-bg-surface:     #13131f;   /* card surfaces, panels */
  --color-bg-elevated:    #1a1a2e;   /* raised surfaces, dropdowns */
  --color-bg-overlay:     #1f1f35;   /* modals, drawers */
  --color-bg-hover:       #22223a;   /* hover state fill for interactive items */
  --color-bg-active:      #26264a;   /* active/pressed state fill */

  /* ─── ACCENT: DEEP PURPLE ─────────────────────────── */
  --color-purple-950:     #1a0533;
  --color-purple-900:     #2d0d5e;
  --color-purple-800:     #4a1080;
  --color-purple-700:     #6b21a8;   /* primary purple */
  --color-purple-600:     #7c3aed;
  --color-purple-500:     #8b5cf6;
  --color-purple-400:     #a78bfa;
  --color-purple-300:     #c4b5fd;
  --color-purple-200:     #ddd6fe;
  --color-purple-glow:    rgba(107, 33, 168, 0.45);

  /* ─── ACCENT: ELECTRIC TEAL ───────────────────────── */
  --color-teal-900:       #003333;
  --color-teal-800:       #005f5f;
  --color-teal-700:       #008f8f;
  --color-teal-600:       #00b8b8;
  --color-teal-500:       #00d4d4;   /* primary teal */
  --color-teal-400:       #22e5e5;
  --color-teal-300:       #5eedec;
  --color-teal-200:       #99f5f4;
  --color-teal-glow:      rgba(0, 212, 212, 0.40);

  /* ─── ACCENT: GOLD ────────────────────────────────── */
  --color-gold-900:       #3d2300;
  --color-gold-800:       #6b3f00;
  --color-gold-700:       #9a5e00;
  --color-gold-600:       #c97d00;
  --color-gold-500:       #f0b429;   /* primary gold */
  --color-gold-400:       #f5c842;
  --color-gold-300:       #f9da74;
  --color-gold-200:       #fcedb3;
  --color-gold-glow:      rgba(240, 180, 41, 0.40);

  /* ─── ACCENT: CRIMSON ROSE ────────────────────────── */
  --color-crimson-900:    #3b0011;
  --color-crimson-800:    #6f0022;
  --color-crimson-700:    #a80034;
  --color-crimson-600:    #cc1040;
  --color-crimson-500:    #e11d48;   /* primary crimson */
  --color-crimson-400:    #f43f5e;
  --color-crimson-300:    #fb7185;
  --color-crimson-glow:   rgba(225, 29, 72, 0.40);

  /* ─── BORDER ──────────────────────────────────────── */
  --color-border-subtle:  rgba(255, 255, 255, 0.06);
  --color-border-default: rgba(255, 255, 255, 0.12);
  --color-border-strong:  rgba(255, 255, 255, 0.22);
  --color-border-focus:   var(--color-teal-500);
  --color-border-purple:  rgba(107, 33, 168, 0.60);
  --color-border-teal:    rgba(0, 212, 212, 0.50);
  --color-border-gold:    rgba(240, 180, 41, 0.50);

  /* ─── TEXT HIERARCHY ──────────────────────────────── */
  --color-text-primary:   #f0eff8;   /* near-white, main content */
  --color-text-secondary: #b8b5d4;   /* supporting text */
  --color-text-muted:     #6e6a8a;   /* placeholders, de-emphasized */
  --color-text-inverse:   #0a0a0f;   /* text on light/gold surfaces */
  --color-text-link:      var(--color-teal-400);
  --color-text-accent:    var(--color-purple-400);

  /* ─── SEMANTIC ────────────────────────────────────── */
  --color-success:        #22c55e;
  --color-success-bg:     rgba(34, 197, 94, 0.15);
  --color-success-border: rgba(34, 197, 94, 0.35);

  --color-warning:        #f0b429;
  --color-warning-bg:     rgba(240, 180, 41, 0.15);
  --color-warning-border: rgba(240, 180, 41, 0.35);

  --color-danger:         #e11d48;
  --color-danger-bg:      rgba(225, 29, 72, 0.15);
  --color-danger-border:  rgba(225, 29, 72, 0.35);

  --color-info:           #00d4d4;
  --color-info-bg:        rgba(0, 212, 212, 0.12);
  --color-info-border:    rgba(0, 212, 212, 0.30);

  /* ─── GRADIENTS ───────────────────────────────────── */
  --gradient-purple-teal: linear-gradient(135deg, #6b21a8 0%, #00d4d4 100%);
  --gradient-purple-gold: linear-gradient(135deg, #6b21a8 0%, #f0b429 100%);
  --gradient-teal-purple: linear-gradient(135deg, #00d4d4 0%, #7c3aed 100%);
  --gradient-cosmic:      linear-gradient(135deg, #0d0d14 0%, #1a0533 50%, #003333 100%);
  --gradient-card-border: linear-gradient(135deg, rgba(107,33,168,0.8) 0%, rgba(0,212,212,0.8) 100%);
  --gradient-shimmer:     linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%);
}
```

---

## 2. TYPOGRAPHY

### 2.1 Font Pairing Rationale

**Cinzel** (Google Fonts) is a classical Roman-inspired serif with geometric precision — it evokes ancient mysticism, runic inscriptions, and cosmic authority. Used for headings, the portal title, and card titles.

**Inter** (Google Fonts) is a highly legible grotesque sans-serif optimized for screens. Used for body copy, labels, tags, form fields, and all functional UI text.

### 2.2 Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
```

Place this at the very top of your stylesheet, before any `:root` declarations.

### 2.3 Typography Custom Properties

```css
:root {
  /* ─── FONT FAMILIES ──────────────────────────────── */
  --font-display:   'Cinzel', 'Palatino Linotype', Georgia, serif;
  --font-body:      'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono:      'Fira Code', 'Cascadia Code', 'Courier New', monospace;

  /* ─── FONT SCALE (Major Third: 1.25 ratio) ──────── */
  --fs-xs:    0.64rem;   /*  ~10.2px  */
  --fs-sm:    0.80rem;   /*  ~12.8px  */
  --fs-base:  1.00rem;   /*   16px    */
  --fs-lg:    1.25rem;   /*   20px    */
  --fs-xl:    1.563rem;  /*  ~25px    */
  --fs-2xl:   1.953rem;  /*  ~31px    */
  --fs-3xl:   2.441rem;  /*  ~39px    */
  --fs-4xl:   3.052rem;  /*  ~49px    */
  --fs-5xl:   3.815rem;  /*  ~61px    */

  /* ─── FONT WEIGHTS ───────────────────────────────── */
  --fw-light:     300;
  --fw-regular:   400;
  --fw-medium:    500;
  --fw-semibold:  600;
  --fw-bold:      700;
  --fw-black:     900;

  /* ─── LINE HEIGHTS ───────────────────────────────── */
  --lh-tight:     1.15;
  --lh-snug:      1.30;
  --lh-normal:    1.50;
  --lh-relaxed:   1.65;
  --lh-loose:     1.85;

  /* ─── LETTER SPACING ─────────────────────────────── */
  --ls-tightest:  -0.04em;
  --ls-tight:     -0.02em;
  --ls-normal:     0em;
  --ls-wide:       0.04em;
  --ls-wider:      0.08em;
  --ls-widest:     0.16em;
  --ls-display:    0.06em;   /* for Cinzel headings */
  --ls-label:      0.10em;   /* for uppercase labels */
  --ls-caps:       0.14em;   /* for all-caps small text */
}
```

### 2.4 Base Typography CSS Rules

```css
/* ─── ROOT DEFAULTS ─────────────────────────────────── */
html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  font-family: var(--font-body);
  font-size: var(--fs-base);
  font-weight: var(--fw-regular);
  line-height: var(--lh-normal);
  letter-spacing: var(--ls-normal);
  color: var(--color-text-primary);
  background-color: var(--color-bg-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ─── HEADING SCALE ─────────────────────────────────── */
h1 {
  font-family: var(--font-display);
  font-size: clamp(var(--fs-3xl), 5vw, var(--fs-5xl));
  font-weight: var(--fw-black);
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-display);
  color: var(--color-text-primary);
  margin: 0 0 1.25rem 0;
}

h2 {
  font-family: var(--font-display);
  font-size: clamp(var(--fs-2xl), 3.5vw, var(--fs-4xl));
  font-weight: var(--fw-bold);
  line-height: var(--lh-snug);
  letter-spacing: var(--ls-display);
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
}

h3 {
  font-family: var(--font-display);
  font-size: clamp(var(--fs-xl), 2.5vw, var(--fs-3xl));
  font-weight: var(--fw-semibold);
  line-height: var(--lh-snug);
  letter-spacing: var(--ls-wide);
  color: var(--color-text-primary);
  margin: 0 0 0.875rem 0;
}

h4 {
  font-family: var(--font-display);
  font-size: clamp(var(--fs-lg), 2vw, var(--fs-2xl));
  font-weight: var(--fw-semibold);
  line-height: var(--lh-normal);
  letter-spacing: var(--ls-wide);
  color: var(--color-text-secondary);
  margin: 0 0 0.75rem 0;
}

/* ─── BODY TEXT ─────────────────────────────────────── */
p {
  font-family: var(--font-body);
  font-size: var(--fs-base);
  font-weight: var(--fw-regular);
  line-height: var(--lh-relaxed);
  color: var(--color-text-secondary);
  margin: 0 0 1rem 0;
}

/* ─── UTILITY TEXT CLASSES ──────────────────────────── */
.text-sm {
  font-size: var(--fs-sm);
  line-height: var(--lh-normal);
  color: var(--color-text-secondary);
}

.text-xs {
  font-size: var(--fs-xs);
  line-height: var(--lh-normal);
  color: var(--color-text-muted);
}

.label {
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.caption {
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  font-weight: var(--fw-regular);
  line-height: var(--lh-relaxed);
  color: var(--color-text-muted);
  font-style: italic;
}

/* ─── GRADIENT TEXT UTILITY ─────────────────────────── */
.text-gradient-purple-teal {
  background: var(--gradient-purple-teal);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-purple-gold {
  background: var(--gradient-purple-gold);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 3. APP CARD COMPONENT

### 3.1 Anatomy

Each card represents one single-page HTML app. The card uses a gradient border via a `::before` pseudo-element layered behind the card surface. On hover, the card lifts (`translateY`), the border intensifies, and a subtle glow blooms beneath the card.

### 3.2 HTML Structure

```html
<article class="card" tabindex="0" data-app-id="ritual-sequencer">
  <div class="card__thumbnail-wrapper">
    <img
      class="card__thumbnail"
      src="thumbnails/ritual-sequencer.jpg"
      alt="Ritual Sequencer app screenshot"
      loading="lazy"
      width="400"
      height="300"
    />
    <span class="card__badge badge badge--shareable">Free</span>
  </div>
  <div class="card__body">
    <h3 class="card__title">Ritual Sequencer</h3>
    <p class="card__description">Build complex beat patterns with sacred timing ratios. Export as audio or MIDI for your ceremonies.</p>
    <div class="card__tags">
      <span class="card__tag card__tag--music">Music</span>
      <span class="card__tag card__tag--tools">Tools</span>
    </div>
    <div class="card__footer">
      <span class="card__price">Free</span>
      <a class="card__launch-btn" href="apps/ritual-sequencer/index.html" target="_blank" rel="noopener">
        Open Portal
      </a>
    </div>
  </div>
</article>
```

### 3.3 Complete Card CSS

```css
/* ─── CARD BASE ─────────────────────────────────────── */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-surface);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.28s ease,
    border-color 0.28s ease;
  contain: layout style paint;
  outline: none;

  /* gradient border via box-shadow trick for radius support */
  box-shadow:
    0 0 0 1px var(--color-border-default),
    0 4px 16px rgba(0, 0, 0, 0.45);
}

/* gradient border using ::before pseudo-element */
.card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: calc(1rem + 1px);
  background: var(--gradient-card-border);
  z-index: 0;
  opacity: 0;
  transition: opacity 0.28s ease;
  pointer-events: none;
}

/* inner surface that sits above ::before border */
.card::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: calc(1rem - 1px);
  background: var(--color-bg-surface);
  z-index: 1;
  pointer-events: none;
}

/* all direct children must be above ::after */
.card > * {
  position: relative;
  z-index: 2;
}

/* ─── CARD HOVER ────────────────────────────────────── */
.card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 0 0 1px transparent,
    0 8px 32px rgba(0, 0, 0, 0.60),
    0 0 48px var(--color-purple-glow),
    0 0 80px rgba(0, 212, 212, 0.12);
}

.card:hover::before {
  opacity: 1;
}

.card:hover::after {
  background: var(--color-bg-elevated);
}

/* ─── CARD FOCUS ────────────────────────────────────── */
.card:focus-visible,
.card:focus-within {
  outline: 2px solid var(--color-teal-500);
  outline-offset: 3px;
  box-shadow:
    0 0 0 4px var(--color-teal-glow),
    0 8px 32px rgba(0, 0, 0, 0.60);
}

/* ─── THUMBNAIL WRAPPER ─────────────────────────────── */
.card__thumbnail-wrapper {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: linear-gradient(135deg, #1a0533 0%, #003333 100%);
  flex-shrink: 0;
}

/* ─── THUMBNAIL IMAGE ───────────────────────────────── */
.card__thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
  transition: transform 0.40s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card:hover .card__thumbnail {
  transform: scale(1.05);
}

/* placeholder gradient shown when image is absent or loading */
.card__thumbnail[src=""],
.card__thumbnail:not([src]) {
  background: linear-gradient(135deg, #2d0d5e 0%, #003333 50%, #1a0533 100%);
}

/* ─── CARD BADGE ────────────────────────────────────── */
.card__badge {
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  z-index: 3;
}

/* ─── CARD BODY ─────────────────────────────────────── */
.card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem 1.125rem 1.125rem;
  gap: 0.5rem;
}

/* ─── CARD TITLE ────────────────────────────────────── */
.card__title {
  font-family: var(--font-display);
  font-size: var(--fs-base);
  font-weight: var(--fw-semibold);
  line-height: var(--lh-snug);
  letter-spacing: var(--ls-wide);
  color: var(--color-text-primary);
  margin: 0;

  /* single-line clamp */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ─── CARD DESCRIPTION ──────────────────────────────── */
.card__description {
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: var(--fw-regular);
  line-height: var(--lh-relaxed);
  color: var(--color-text-secondary);
  margin: 0;
  flex: 1;

  /* 3-line clamp */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ─── CARD TAGS ─────────────────────────────────────── */
.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.25rem;
}

/* ─── INDIVIDUAL TAG ────────────────────────────────── */
.card__tag {
  display: inline-flex;
  align-items: center;
  padding: 0.1875rem 0.5rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--ls-caps);
  text-transform: uppercase;
  line-height: 1;
  background-color: var(--color-bg-elevated);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border-subtle);
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

/* tag color variants */
.card__tag--tools    { background-color: rgba(107, 33, 168, 0.20); color: var(--color-purple-300); border-color: rgba(107, 33, 168, 0.40); }
.card__tag--art      { background-color: rgba(225, 29, 72, 0.18);  color: var(--color-crimson-300); border-color: rgba(225, 29, 72, 0.35); }
.card__tag--writing  { background-color: rgba(240, 180, 41, 0.15); color: var(--color-gold-300);    border-color: rgba(240, 180, 41, 0.35); }
.card__tag--music    { background-color: rgba(0, 212, 212, 0.12);  color: var(--color-teal-300);    border-color: rgba(0, 212, 212, 0.30); }
.card__tag--games    { background-color: rgba(34, 197, 94, 0.12);  color: #86efac;                  border-color: rgba(34, 197, 94, 0.30); }
.card__tag--generators { background-color: rgba(99, 102, 241, 0.15); color: #a5b4fc;               border-color: rgba(99, 102, 241, 0.35); }
.card__tag--rituals  { background-color: rgba(240, 180, 41, 0.12); color: var(--color-gold-400);    border-color: rgba(240, 180, 41, 0.30); }

/* ─── CARD FOOTER ───────────────────────────────────── */
.card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 0.375rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border-subtle);
}

/* ─── PRICE ─────────────────────────────────────────── */
.card__price {
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: var(--fw-bold);
  color: var(--color-gold-500);
  letter-spacing: var(--ls-wide);
  line-height: 1;
}

.card__price--free {
  color: var(--color-teal-400);
}

/* ─── LAUNCH BUTTON ─────────────────────────────────── */
.card__launch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4375rem 1rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-text-primary);
  background: var(--gradient-purple-teal);
  background-size: 200% 200%;
  background-position: 0% 50%;
  border: none;
  cursor: pointer;
  transition:
    background-position 0.40s ease,
    box-shadow 0.25s ease,
    transform 0.18s ease;
  white-space: nowrap;
  line-height: 1;
  animation: pulseGlow 4s ease-in-out infinite;
}

.card__launch-btn:hover {
  background-position: 100% 50%;
  box-shadow:
    0 0 18px var(--color-purple-glow),
    0 0 32px var(--color-teal-glow);
  transform: scale(1.04);
  animation: none;
}

.card__launch-btn:active {
  transform: scale(0.97);
}

.card__launch-btn:focus-visible {
  outline: 2px solid var(--color-teal-500);
  outline-offset: 3px;
}
```

---

## 4. GRID LAYOUT

### 4.1 Design Intent

The grid is mobile-first and content-driven. On small phones it shows one card per row for maximum readability. The grid expands through 2, 3, and 4 columns at natural breakpoints. The container has a maximum width to prevent cards from becoming unreadably wide on ultra-wide monitors.

### 4.2 Complete Grid CSS

```css
/* ─── CONTAINER ─────────────────────────────────────── */
.container {
  width: 100%;
  max-width: 1600px;
  margin-inline: auto;
  padding-inline: 1rem;    /* 16px on mobile */
}

@media (min-width: 640px) {
  .container {
    padding-inline: 1.5rem;   /* 24px */
  }
}

@media (min-width: 1024px) {
  .container {
    padding-inline: 2rem;     /* 32px */
  }
}

@media (min-width: 1440px) {
  .container {
    padding-inline: 3rem;     /* 48px */
  }
}

/* ─── PORTAL WRAPPER ────────────────────────────────── */
.portal-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  min-height: 100vh; /* fallback */
  background-color: var(--color-bg-void);
  position: relative;
  overflow-x: hidden;
}

/* background star field */
.portal-wrapper::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 15% 22%, rgba(255,255,255,0.55) 0%, transparent 100%),
    radial-gradient(1px 1px at 47% 8%,  rgba(255,255,255,0.40) 0%, transparent 100%),
    radial-gradient(1px 1px at 73% 35%, rgba(255,255,255,0.60) 0%, transparent 100%),
    radial-gradient(1px 1px at 88% 17%, rgba(255,255,255,0.35) 0%, transparent 100%),
    radial-gradient(1px 1px at 6%  61%, rgba(255,255,255,0.45) 0%, transparent 100%),
    radial-gradient(1px 1px at 34% 78%, rgba(255,255,255,0.30) 0%, transparent 100%),
    radial-gradient(1px 1px at 62% 55%, rgba(255,255,255,0.50) 0%, transparent 100%),
    radial-gradient(1px 1px at 91% 82%, rgba(255,255,255,0.40) 0%, transparent 100%),
    radial-gradient(2px 2px at 28% 44%, rgba(0,212,212,0.25) 0%, transparent 100%),
    radial-gradient(2px 2px at 79% 67%, rgba(107,33,168,0.30) 0%, transparent 100%),
    radial-gradient(1px 1px at 52% 92%, rgba(240,180,41,0.20) 0%, transparent 100%);
  background-size: 100% 100%;
  pointer-events: none;
  z-index: 0;
  animation: starTwinkle 8s ease-in-out infinite alternate;
}

/* ─── PORTAL MAIN ───────────────────────────────────── */
.portal-main {
  flex: 1;
  padding-top: 2rem;
  padding-bottom: 6rem;   /* space for mobile nav */
  position: relative;
  z-index: 1;
}

@media (min-width: 1024px) {
  .portal-main {
    padding-bottom: 3rem;
  }
}

/* ─── PORTAL GRID ───────────────────────────────────── */
.portal-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;
}

/* 375px+ still 1 col, gap increases slightly */
@media (min-width: 375px) {
  .portal-grid {
    gap: 1.125rem;
  }
}

/* 640px+: 2 columns */
@media (min-width: 640px) {
  .portal-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

/* 1024px+: 3 columns */
@media (min-width: 1024px) {
  .portal-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

/* 1440px+: 4 columns */
@media (min-width: 1440px) {
  .portal-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.75rem;
  }
}

/* ─── GRID SECTION HEADER ───────────────────────────── */
.portal-grid-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.portal-grid-header__count {
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  letter-spacing: var(--ls-wide);
}

/* ─── EMPTY STATE ───────────────────────────────────── */
.portal-grid--empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  grid-column: 1 / -1;
}

.portal-grid__empty-message {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  color: var(--color-text-muted);
  text-align: center;
  letter-spacing: var(--ls-display);
}

.portal-grid__empty-hint {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  margin-top: 0.5rem;
  text-align: center;
}
```

---

## 5. FILTER/SEARCH BAR

### 5.1 HTML Structure

```html
<section class="search-section" aria-label="Search and filter apps">
  <div class="container">
    <div class="search-bar">
      <div class="search-input-wrapper">
        <span class="search-icon" aria-hidden="true">⬡</span>
        <input
          class="search-input"
          type="search"
          placeholder="Search the void..."
          autocomplete="off"
          spellcheck="false"
          aria-label="Search apps"
          id="app-search"
        />
        <button class="search-clear" aria-label="Clear search" hidden>✕</button>
      </div>
      <div class="filter-chips" role="group" aria-label="Filter by category">
        <button class="chip is-active" data-filter="all"        aria-pressed="true">All</button>
        <button class="chip"           data-filter="tools"      aria-pressed="false">Tools</button>
        <button class="chip"           data-filter="art"        aria-pressed="false">Art</button>
        <button class="chip"           data-filter="writing"    aria-pressed="false">Writing</button>
        <button class="chip"           data-filter="music"      aria-pressed="false">Music</button>
        <button class="chip"           data-filter="games"      aria-pressed="false">Games</button>
        <button class="chip"           data-filter="generators" aria-pressed="false">Generators</button>
        <button class="chip"           data-filter="rituals"    aria-pressed="false">Rituals</button>
      </div>
    </div>
  </div>
</section>
```

### 5.2 Complete Filter/Search CSS

```css
/* ─── SEARCH SECTION ────────────────────────────────── */
.search-section {
  position: sticky;
  top: 0;
  z-index: 80;
  padding: 0.875rem 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 10, 15, 0.98) 0%,
    rgba(10, 10, 15, 0.92) 100%
  );
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--color-border-subtle);
}

/* ─── SEARCH BAR WRAPPER ────────────────────────────── */
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .search-bar {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
}

/* ─── SEARCH INPUT WRAPPER ──────────────────────────── */
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  width: 100%;
}

@media (min-width: 768px) {
  .search-input-wrapper {
    width: 280px;
    flex-shrink: 0;
  }
}

@media (min-width: 1024px) {
  .search-input-wrapper {
    width: 340px;
  }
}

/* ─── SEARCH ICON ───────────────────────────────────── */
.search-icon {
  position: absolute;
  left: 0.875rem;
  font-size: 1rem;
  color: var(--color-text-muted);
  pointer-events: none;
  z-index: 1;
  transition: color 0.20s ease;
  line-height: 1;
}

/* ─── SEARCH INPUT ──────────────────────────────────── */
.search-input {
  width: 100%;
  padding: 0.625rem 2.75rem 0.625rem 2.5rem;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: var(--fw-regular);
  color: var(--color-text-primary);
  outline: none;
  transition:
    border-color 0.20s ease,
    box-shadow 0.20s ease,
    background-color 0.20s ease;
  appearance: none;
  -webkit-appearance: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
  font-style: italic;
}

/* remove native search cancel button */
.search-input::-webkit-search-cancel-button {
  display: none;
}

.search-input:focus {
  border-color: var(--color-teal-500);
  background-color: var(--color-bg-elevated);
  box-shadow:
    0 0 0 3px var(--color-teal-glow),
    inset 0 1px 3px rgba(0, 0, 0, 0.40);
}

.search-input:focus + .search-icon,
.search-input-wrapper:focus-within .search-icon {
  color: var(--color-teal-400);
}

/* ─── SEARCH CLEAR BUTTON ───────────────────────────── */
.search-clear {
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.375rem;
  height: 1.375rem;
  border-radius: 50%;
  background: var(--color-bg-hover);
  border: none;
  color: var(--color-text-muted);
  font-size: 0.625rem;
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease;
  line-height: 1;
}

.search-clear:hover {
  background: var(--color-bg-active);
  color: var(--color-text-primary);
}

.search-clear[hidden] {
  display: none;
}

/* ─── FILTER CHIPS WRAPPER ──────────────────────────── */
.filter-chips {
  display: flex;
  gap: 0.375rem;
  flex: 1;
  overflow-x: auto;
  padding-bottom: 2px;   /* prevent clipping of focus ring */
  scrollbar-width: none;
  -ms-overflow-style: none;

  /* fade edges on mobile to hint scrollability */
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0px,
    black 8px,
    black calc(100% - 8px),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0px,
    black 8px,
    black calc(100% - 8px),
    transparent 100%
  );
}

.filter-chips::-webkit-scrollbar {
  display: none;
}

@media (min-width: 768px) {
  .filter-chips {
    flex-wrap: wrap;
    overflow-x: visible;
    -webkit-mask-image: none;
    mask-image: none;
  }
}

/* ─── CHIP BASE ─────────────────────────────────────── */
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.3125rem 0.875rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--ls-caps);
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid var(--color-border-default);
  background-color: var(--color-bg-surface);
  color: var(--color-text-secondary);
  transition:
    background-color 0.20s ease,
    border-color 0.20s ease,
    color 0.20s ease,
    box-shadow 0.20s ease,
    transform 0.15s ease;
  outline: none;
  line-height: 1;
  flex-shrink: 0;
}

/* ─── CHIP HOVER ────────────────────────────────────── */
.chip:hover {
  background-color: var(--color-bg-elevated);
  border-color: var(--color-border-strong);
  color: var(--color-text-primary);
  transform: translateY(-1px);
}

/* ─── CHIP ACTIVE STATE ─────────────────────────────── */
.chip.is-active {
  background: var(--gradient-teal-purple);
  border-color: transparent;
  color: var(--color-text-primary);
  box-shadow:
    0 0 14px var(--color-teal-glow),
    0 0 24px var(--color-purple-glow);
  transform: translateY(-1px);
}

.chip.is-active:hover {
  box-shadow:
    0 0 20px var(--color-teal-glow),
    0 0 36px var(--color-purple-glow);
}

/* ─── CHIP FOCUS ────────────────────────────────────── */
.chip:focus-visible {
  outline: 2px solid var(--color-teal-500);
  outline-offset: 3px;
}

/* ─── CHIP PRESSED ──────────────────────────────────── */
.chip:active {
  transform: translateY(0) scale(0.97);
}
```

---

## 6. HEADER

### 6.1 HTML Structure

```html
<header class="header" role="banner">
  <div class="header__bg" aria-hidden="true">
    <div class="header__geometry header__geometry--ring-outer"></div>
    <div class="header__geometry header__geometry--ring-inner"></div>
    <div class="header__geometry header__geometry--hexagon"></div>
    <div class="header__geometry header__geometry--triangle"></div>
    <div class="header__geometry header__geometry--core"></div>
  </div>

  <div class="container">
    <div class="header__content">
      <button class="header__admin-toggle" aria-label="Toggle admin mode" id="admin-toggle">
        🔒
      </button>

      <div class="header__wordmark">
        <span class="header__eyebrow label">Funky Black Poppy</span>
        <h1 class="header__title text-gradient-purple-teal">Sacred Chaos</h1>
        <p class="header__subtitle">App Portal</p>
      </div>

      <p class="header__tagline">
        "Where intention meets the infinite — your creative cosmos, organized."
      </p>

      <div class="header__count" role="status" aria-live="polite">
        <span class="header__count-number" id="portal-count">23</span>
        <span class="header__count-label">portals open</span>
      </div>
    </div>
  </div>
</header>
```

### 6.2 Complete Header CSS

```css
/* ─── HEADER ────────────────────────────────────────── */
.header {
  position: relative;
  width: 100%;
  padding: 4rem 0 3rem;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    rgba(13, 13, 20, 1.00) 0%,
    rgba(26, 5, 51, 0.45) 50%,
    rgba(13, 13, 20, 0.80) 100%
  );
  border-bottom: 1px solid var(--color-border-subtle);
}

@media (min-width: 640px) {
  .header {
    padding: 5rem 0 4rem;
  }
}

@media (min-width: 1024px) {
  .header {
    padding: 6rem 0 5rem;
  }
}

/* ─── HEADER BACKGROUND GEOMETRY ───────────────────── */
.header__bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 0;
}

/* shared geometry piece styles */
.header__geometry {
  position: absolute;
  border-style: solid;
  border-radius: 50%;
}

/* outer spinning ring */
.header__geometry--ring-outer {
  width: min(600px, 100vw);
  height: min(600px, 100vw);
  border-width: 1px;
  border-color: rgba(107, 33, 168, 0.25);
  border-style: solid;
  border-radius: 50%;
  animation: rotateGeometry 40s linear infinite;
}

/* dashed inner ring, counter-rotating */
.header__geometry--ring-inner {
  width: min(400px, 70vw);
  height: min(400px, 70vw);
  border-width: 1px;
  border-style: dashed;
  border-color: rgba(0, 212, 212, 0.20);
  border-radius: 50%;
  animation: rotateGeometry 28s linear infinite reverse;
}

/* hexagon approximated via clip-path */
.header__geometry--hexagon {
  width: min(280px, 50vw);
  height: min(280px, 50vw);
  border: none;
  background: transparent;
  border-radius: 0;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  outline: 1px solid rgba(240, 180, 41, 0.15);
  animation: rotateGeometry 60s linear infinite;
}

/* triangle */
.header__geometry--triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 min(120px, 22vw) min(210px, 38vw) min(120px, 22vw);
  border-color: transparent transparent rgba(107, 33, 168, 0.10) transparent;
  border-radius: 0;
  animation: rotateGeometry 50s linear infinite reverse;
  top: 50%;
  left: 50%;
  transform-origin: 50% 70%;
  transform: translate(-50%, -70%);
}

/* pulsing center core */
.header__geometry--core {
  width: min(120px, 22vw);
  height: min(120px, 22vw);
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 212, 212, 0.35);
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(107, 33, 168, 0.20) 0%,
    rgba(0, 212, 212, 0.05) 60%,
    transparent 100%
  );
  animation: pulseGlow 3s ease-in-out infinite;
}

/* ─── HEADER CONTENT ────────────────────────────────── */
.header__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

/* ─── ADMIN TOGGLE ──────────────────────────────────── */
.header__admin-toggle {
  position: absolute;
  top: -3rem;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background-color 0.20s ease,
    border-color 0.20s ease,
    box-shadow 0.20s ease;
  outline: none;
  line-height: 1;
}

.header__admin-toggle:hover {
  background: var(--color-bg-elevated);
  border-color: var(--color-border-strong);
  box-shadow: 0 0 12px var(--color-purple-glow);
}

.header__admin-toggle:focus-visible {
  outline: 2px solid var(--color-teal-500);
  outline-offset: 3px;
}

body.admin-mode .header__admin-toggle {
  background: rgba(107, 33, 168, 0.30);
  border-color: var(--color-purple-500);
  color: var(--color-purple-300);
  box-shadow: 0 0 16px var(--color-purple-glow);
}

/* ─── WORDMARK GROUP ─────────────────────────────────  */
.header__wordmark {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.header__eyebrow {
  letter-spacing: var(--ls-caps);
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

/* ─── PORTAL TITLE ──────────────────────────────────── */
.header__title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: var(--fw-black);
  line-height: var(--lh-tight);
  letter-spacing: 0.10em;
  margin: 0;
  text-shadow: 0 0 60px rgba(107, 33, 168, 0.50);

  /* gradient override (extends .text-gradient-purple-teal) */
  background: linear-gradient(135deg, #8b5cf6 0%, #00d4d4 60%, #f0b429 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── SUBTITLE ──────────────────────────────────────── */
.header__subtitle {
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: var(--fw-light);
  letter-spacing: var(--ls-widest);
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0;
}

/* ─── TAGLINE ───────────────────────────────────────── */
.header__tagline {
  font-family: var(--font-display);
  font-size: clamp(var(--fs-sm), 2vw, var(--fs-base));
  font-weight: var(--fw-regular);
  font-style: italic;
  color: var(--color-text-muted);
  letter-spacing: var(--ls-wide);
  max-width: 480px;
  margin: 0;
  line-height: var(--lh-relaxed);
}

/* ─── PORTAL COUNT ──────────────────────────────────── */
.header__count {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3125rem 0.875rem;
  background: rgba(0, 212, 212, 0.10);
  border: 1px solid var(--color-border-teal);
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  color: var(--color-teal-300);
}

.header__count-number {
  font-weight: var(--fw-bold);
  color: var(--color-teal-400);
}

.header__count-label {
  font-weight: var(--fw-medium);
  letter-spacing: var(--ls-caps);
  text-transform: uppercase;
}
```

---

## 7. STATUS BADGE SYSTEM

### 7.1 Design Intent

Badges appear on card thumbnails. They communicate the app's access model at a glance. The system has four states: **Personal** (private, admin-only visible), **Shareable** (free public link), **For Sale** (paid), and **Archived** (not currently active).

### 7.2 HTML Examples

```html
<!-- Shareable / Free -->
<span class="badge badge--shareable">🔗 Free</span>

<!-- For Sale -->
<span class="badge badge--for-sale">✦ $12</span>

<!-- Personal (admin-only) -->
<span class="badge badge--personal admin-only">🔒 Personal</span>

<!-- Archived -->
<span class="badge badge--archived admin-only">⊟ Archived</span>
```

### 7.3 Complete Badge CSS

```css
/* ─── BADGE BASE ────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--ls-caps);
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: none;
  user-select: none;
}

/* ─── PERSONAL BADGE ────────────────────────────────── */
.badge--personal {
  background-color: rgba(50, 45, 70, 0.88);
  color: #8b86a8;
  border: 1px solid rgba(139, 134, 168, 0.30);
}

/* ─── SHAREABLE BADGE ───────────────────────────────── */
.badge--shareable {
  background-color: rgba(0, 212, 212, 0.22);
  color: var(--color-teal-300);
  border: 1px solid rgba(0, 212, 212, 0.40);
  box-shadow: 0 0 8px rgba(0, 212, 212, 0.20);
}

/* ─── FOR SALE BADGE ────────────────────────────────── */
.badge--for-sale {
  background-color: rgba(240, 180, 41, 0.90);
  color: #1a0e00;
  border: 1px solid rgba(240, 180, 41, 0.60);
  box-shadow: 0 0 10px rgba(240, 180, 41, 0.30);
}

/* ─── ARCHIVED BADGE ────────────────────────────────── */
.badge--archived {
  background-color: rgba(25, 25, 38, 0.88);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border-subtle);
  opacity: 0.75;
}

/* ─── ADMIN-ONLY UTILITY ────────────────────────────── */
.admin-only {
  display: none !important;
}

body.admin-mode .admin-only {
  display: inline-flex !important;
}

/* for block-level admin-only elements */
body.admin-mode .admin-only--block {
  display: block !important;
}

body.admin-mode .admin-only--flex {
  display: flex !important;
}
```

---

## 8. ADMIN PANEL

### 8.1 HTML Structure

```html
<!-- Overlay backdrop -->
<div class="admin-overlay" id="admin-overlay" aria-hidden="true"></div>

<!-- Sliding drawer -->
<aside
  class="admin-drawer"
  id="admin-drawer"
  role="dialog"
  aria-modal="true"
  aria-label="Admin panel"
  aria-hidden="true"
>
  <div class="admin-drawer__header">
    <h2 class="admin-drawer__title">Admin Panel</h2>
    <button class="admin-drawer__close" aria-label="Close admin panel" id="admin-close">✕</button>
  </div>

  <div class="admin-drawer__body">
    <form class="admin-form" id="admin-form" novalidate>

      <div class="form-group">
        <label class="form-label" for="app-name">App Name</label>
        <input class="form-input" type="text" id="app-name" name="name" placeholder="My Sacred App" />
      </div>

      <div class="form-group">
        <label class="form-label" for="app-description">Description</label>
        <textarea class="form-textarea" id="app-description" name="description" rows="3" placeholder="What does this portal do..."></textarea>
      </div>

      <div class="form-group">
        <label class="form-label" for="app-url">App URL / Path</label>
        <input class="form-input" type="url" id="app-url" name="url" placeholder="apps/my-app/index.html" />
      </div>

      <div class="form-group">
        <label class="form-label" for="app-category">Category</label>
        <select class="form-select" id="app-category" name="category">
          <option value="">— Select category —</option>
          <option value="tools">Tools</option>
          <option value="art">Art</option>
          <option value="writing">Writing</option>
          <option value="music">Music</option>
          <option value="games">Games</option>
          <option value="generators">Generators</option>
          <option value="rituals">Rituals</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="app-price">Price (leave blank if free)</label>
        <input class="form-input" type="text" id="app-price" name="price" placeholder="12.00" />
      </div>

      <div class="form-group">
        <span class="form-label">App Status</span>
        <div class="radio-group" role="radiogroup" aria-label="App status">
          <label class="radio-option radio-option--shareable">
            <input type="radio" name="status" value="shareable" />
            <span class="radio-indicator"></span>
            <span class="radio-label">🔗 Shareable (Free)</span>
          </label>
          <label class="radio-option radio-option--for-sale">
            <input type="radio" name="status" value="for-sale" />
            <span class="radio-indicator"></span>
            <span class="radio-label">✦ For Sale</span>
          </label>
          <label class="radio-option radio-option--personal">
            <input type="radio" name="status" value="personal" />
            <span class="radio-indicator"></span>
            <span class="radio-label">🔒 Personal</span>
          </label>
          <label class="radio-option radio-option--archived">
            <input type="radio" name="status" value="archived" />
            <span class="radio-indicator"></span>
            <span class="radio-label">⊟ Archived</span>
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn--save">Save Portal</button>
        <button type="button" class="btn btn--cancel" id="admin-cancel">Cancel</button>
      </div>

    </form>
  </div>
</aside>
```

### 8.2 Complete Admin Panel CSS

```css
/* ─── ADMIN OVERLAY ─────────────────────────────────── */
.admin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 10, 0.75);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.admin-overlay.is-visible {
  opacity: 1;
  pointer-events: auto;
}

/* ─── ADMIN DRAWER ──────────────────────────────────── */
.admin-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(420px, 100vw);
  z-index: 210;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-overlay);
  border-left: 1px solid var(--color-border-purple);
  box-shadow:
    -4px 0 48px rgba(0, 0, 0, 0.70),
    -2px 0 16px var(--color-purple-glow);
  transform: translateX(100%);
  transition: transform 0.40s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.admin-drawer.is-open {
  transform: translateX(0);
}

/* ─── DRAWER HEADER ─────────────────────────────────── */
.admin-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border-subtle);
  background: linear-gradient(
    135deg,
    rgba(107, 33, 168, 0.18) 0%,
    rgba(0, 212, 212, 0.08) 100%
  );
  flex-shrink: 0;
}

.admin-drawer__title {
  font-family: var(--font-display);
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--ls-display);
  color: var(--color-text-primary);
  margin: 0;
}

.admin-drawer__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border-subtle);
  color: var(--color-text-secondary);
  font-size: var(--fs-sm);
  cursor: pointer;
  transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease;
  outline: none;
  line-height: 1;
}

.admin-drawer__close:hover {
  background: var(--color-danger-bg);
  border-color: var(--color-danger-border);
  color: var(--color-crimson-400);
}

.admin-drawer__close:focus-visible {
  outline: 2px solid var(--color-teal-500);
  outline-offset: 3px;
}

/* ─── DRAWER BODY ───────────────────────────────────── */
.admin-drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-default) transparent;
}

.admin-drawer__body::-webkit-scrollbar {
  width: 4px;
}

.admin-drawer__body::-webkit-scrollbar-track {
  background: transparent;
}

.admin-drawer__body::-webkit-scrollbar-thumb {
  background: var(--color-border-default);
  border-radius: 999px;
}

/* ─── FORM GROUP ────────────────────────────────────── */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1.25rem;
}

/* ─── FORM LABEL ────────────────────────────────────── */
.form-label {
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

/* ─── FORM INPUT ────────────────────────────────────── */
.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 0.5rem;
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: var(--fw-regular);
  color: var(--color-text-primary);
  outline: none;
  transition:
    border-color 0.20s ease,
    box-shadow 0.20s ease,
    background-color 0.20s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-input:focus {
  border-color: var(--color-teal-500);
  background-color: var(--color-bg-elevated);
  box-shadow: 0 0 0 3px var(--color-teal-glow);
}

.form-input:invalid:not(:placeholder-shown) {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px var(--color-danger-bg);
}

/* ─── FORM TEXTAREA ─────────────────────────────────── */
.form-textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 0.5rem;
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: var(--fw-regular);
  color: var(--color-text-primary);
  outline: none;
  resize: vertical;
  min-height: 5rem;
  line-height: var(--lh-relaxed);
  transition:
    border-color 0.20s ease,
    box-shadow 0.20s ease,
    background-color 0.20s ease;
  box-sizing: border-box;
}

.form-textarea::placeholder {
  color: var(--color-text-muted);
}

.form-textarea:focus {
  border-color: var(--color-teal-500);
  background-color: var(--color-bg-elevated);
  box-shadow: 0 0 0 3px var(--color-teal-glow);
}

/* ─── FORM SELECT ───────────────────────────────────── */
.form-select {
  width: 100%;
  padding: 0.625rem 2.25rem 0.625rem 0.875rem;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 0.5rem;
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: var(--fw-regular);
  color: var(--color-text-primary);
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236e6a8a' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  transition:
    border-color 0.20s ease,
    box-shadow 0.20s ease;
  box-sizing: border-box;
}

.form-select:focus {
  border-color: var(--color-teal-500);
  box-shadow: 0 0 0 3px var(--color-teal-glow);
}

.form-select option {
  background-color: var(--color-bg-elevated);
  color: var(--color-text-primary);
}

/* ─── RADIO GROUP ───────────────────────────────────── */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5625rem 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-subtle);
  background: var(--color-bg-surface);
  cursor: pointer;
  transition: border-color 0.20s ease, background-color 0.20s ease;
}

.radio-option:hover {
  background: var(--color-bg-elevated);
  border-color: var(--color-border-default);
}

/* hide native radio */
.radio-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* custom radio circle */
.radio-indicator {
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 50%;
  border: 2px solid var(--color-border-strong);
  flex-shrink: 0;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}

.radio-option input[type="radio"]:checked ~ .radio-indicator {
  border-color: var(--color-teal-500);
  background-color: var(--color-teal-500);
  box-shadow: 0 0 8px var(--color-teal-glow);
}

/* checked state: option container highlight */
.radio-option:has(input[type="radio"]:checked) {
  border-color: var(--color-border-teal);
  background: var(--color-info-bg);
}

.radio-label {
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--color-text-secondary);
}

/* radio variant accent colors for checked container */
.radio-option--shareable:has(input:checked) {
  border-color: rgba(0, 212, 212, 0.40);
  background: rgba(0, 212, 212, 0.08);
}
.radio-option--for-sale:has(input:checked) {
  border-color: rgba(240, 180, 41, 0.40);
  background: rgba(240, 180, 41, 0.08);
}
.radio-option--personal:has(input:checked) {
  border-color: rgba(139, 134, 168, 0.40);
  background: rgba(139, 134, 168, 0.08);
}
.radio-option--archived:has(input:checked) {
  border-color: var(--color-border-default);
  background: var(--color-bg-elevated);
  opacity: 0.75;
}

/* ─── FORM ACTIONS ──────────────────────────────────── */
.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border-subtle);
}

/* ─── BUTTON BASE ───────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6875rem 1.25rem;
  border-radius: 0.5rem;
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--ls-wide);
  cursor: pointer;
  border: none;
  outline: none;
  transition:
    box-shadow 0.22s ease,
    transform 0.16s ease,
    opacity 0.18s ease;
  line-height: 1;
}

.btn:focus-visible {
  outline: 2px solid var(--color-teal-500);
  outline-offset: 3px;
}

.btn:active {
  transform: scale(0.97);
}

/* ─── SAVE BUTTON ───────────────────────────────────── */
.btn--save {
  flex: 1;
  background: var(--gradient-teal-purple);
  color: var(--color-text-primary);
  box-shadow: 0 2px 12px var(--color-purple-glow);
}

.btn--save:hover {
  box-shadow:
    0 4px 20px var(--color-purple-glow),
    0 0 32px var(--color-teal-glow);
  transform: translateY(-1px);
}

/* ─── CANCEL BUTTON ─────────────────────────────────── */
.btn--cancel {
  padding: 0.6875rem 1rem;
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-default);
}

.btn--cancel:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-strong);
  color: var(--color-text-primary);
}
```

---

## 9. LOADING STATES AND ENTRANCE ANIMATIONS

### 9.1 Keyframe Definitions

```css
/* ─── FADE UP ───────────────────────────────────────── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── SHIMMER ───────────────────────────────────────── */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ─── PULSE GLOW ────────────────────────────────────── */
@keyframes pulseGlow {
  0%, 100% {
    box-shadow:
      0 0 8px var(--color-purple-glow),
      0 0 14px rgba(0, 212, 212, 0.15);
  }
  50% {
    box-shadow:
      0 0 22px var(--color-purple-glow),
      0 0 40px rgba(0, 212, 212, 0.30);
  }
}

/* ─── ROTATE GEOMETRY ───────────────────────────────── */
@keyframes rotateGeometry {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ─── STAR TWINKLE ──────────────────────────────────── */
@keyframes starTwinkle {
  0% {
    opacity: 0.55;
  }
  33% {
    opacity: 0.80;
  }
  66% {
    opacity: 0.45;
  }
  100% {
    opacity: 0.70;
  }
}

/* ─── SLIDE IN RIGHT ────────────────────────────────── */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* ─── FADE IN ───────────────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ─── SCALE UP ──────────────────────────────────────── */
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 9.2 Skeleton Loading Components

```css
/* ─── SKELETON CARD ─────────────────────────────────── */
.card--skeleton {
  pointer-events: none;
  cursor: default;
}

.card--skeleton::before,
.card--skeleton::after {
  display: none; /* no gradient border on skeletons */
}

/* ─── SKELETON BASE ELEMENT ─────────────────────────── */
.skeleton-block,
.skeleton-line {
  background: linear-gradient(
    90deg,
    var(--color-bg-elevated)    0%,
    rgba(255, 255, 255, 0.06)  25%,
    rgba(255, 255, 255, 0.08)  50%,
    rgba(255, 255, 255, 0.06)  75%,
    var(--color-bg-elevated)    100%
  );
  background-size: 200% 100%;
  animation: shimmer 2.2s ease-in-out infinite;
  border-radius: 0.25rem;
}

/* thumbnail placeholder */
.skeleton-block {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 0;
}

/* text line placeholders */
.skeleton-line {
  height: 0.875rem;
  border-radius: 999px;
  margin-bottom: 0.5rem;
}

.skeleton-line--title {
  height: 1rem;
  width: 75%;
}

.skeleton-line--desc-1 {
  height: 0.75rem;
  width: 100%;
}

.skeleton-line--desc-2 {
  height: 0.75rem;
  width: 85%;
}

.skeleton-line--desc-3 {
  height: 0.75rem;
  width: 60%;
}

.skeleton-line--tag {
  height: 1.25rem;
  width: 3.5rem;
  border-radius: 999px;
  display: inline-block;
}

.skeleton-line--price {
  height: 0.875rem;
  width: 2.5rem;
}

.skeleton-line--btn {
  height: 2rem;
  width: 6rem;
  border-radius: 999px;
}

/* ─── ANIMATION UTILITIES ───────────────────────────── */
.animate-fade-up {
  animation: fadeUp 0.50s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

.animate-shimmer {
  animation: shimmer 2.2s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulseGlow 3s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.35s ease both;
}

.animate-scale-up {
  animation: scaleUp 0.40s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* ─── STAGGER DELAYS ────────────────────────────────── */
/*
  Usage: add --stagger-delay to each card via inline style
  or use nth-child selectors for static grids.
*/
.portal-grid .card {
  animation: fadeUp 0.50s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation-delay: var(--stagger-delay, 0ms);
}

.portal-grid .card:nth-child(1)  { --stagger-delay:  0ms; }
.portal-grid .card:nth-child(2)  { --stagger-delay:  60ms; }
.portal-grid .card:nth-child(3)  { --stagger-delay: 120ms; }
.portal-grid .card:nth-child(4)  { --stagger-delay: 180ms; }
.portal-grid .card:nth-child(5)  { --stagger-delay: 240ms; }
.portal-grid .card:nth-child(6)  { --stagger-delay: 300ms; }
.portal-grid .card:nth-child(7)  { --stagger-delay: 360ms; }
.portal-grid .card:nth-child(8)  { --stagger-delay: 420ms; }
.portal-grid .card:nth-child(9)  { --stagger-delay: 480ms; }
.portal-grid .card:nth-child(10) { --stagger-delay: 540ms; }
.portal-grid .card:nth-child(11) { --stagger-delay: 580ms; }
.portal-grid .card:nth-child(12) { --stagger-delay: 610ms; }
/* beyond 12: stagger is capped — avoid motion overload on large grids */
.portal-grid .card:nth-child(n+13) { --stagger-delay: 640ms; }

/* ─── REDUCED MOTION ────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }

  .portal-wrapper::before {
    animation: none;
    opacity: 0.40;
  }

  .header__geometry {
    animation: none;
  }

  .header__geometry--core {
    animation: none;
  }

  .card__launch-btn {
    animation: none;
  }

  .card:hover {
    transform: none;
  }

  .card:hover .card__thumbnail {
    transform: none;
  }

  .chip:hover,
  .chip.is-active {
    transform: none;
  }

  .btn--save:hover {
    transform: none;
  }
}
```

---

## 10. MOBILE NAVIGATION

### 10.1 Design Intent

On mobile (below 1024px), a fixed bottom navigation bar provides persistent access to core portal functions. The bar uses a frosted glass effect that lets the dark background bleed through. On tablets (640px–1023px), a hamburger button in the top-right corner of the header opens a slide-down or drawer menu. The bottom nav hides on desktop where the header provides sufficient navigation context.

### 10.2 HTML Structure

```html
<!-- Mobile bottom navigation -->
<nav class="mobile-nav" role="navigation" aria-label="Mobile navigation">
  <div class="mobile-nav__items">
    <button class="mobile-nav__item is-active" data-nav="home" aria-label="Home" aria-current="page">
      <span class="mobile-nav__icon" aria-hidden="true">⌂</span>
      <span class="mobile-nav__label">Home</span>
    </button>
    <button class="mobile-nav__item" data-nav="search" aria-label="Search">
      <span class="mobile-nav__icon" aria-hidden="true">🔍</span>
      <span class="mobile-nav__label">Search</span>
    </button>
    <button class="mobile-nav__item" data-nav="grid" aria-label="Browse all">
      <span class="mobile-nav__icon" aria-hidden="true">⊞</span>
      <span class="mobile-nav__label">Browse</span>
    </button>
    <button class="mobile-nav__item admin-only" data-nav="admin" aria-label="Admin">
      <span class="mobile-nav__icon" aria-hidden="true">🔒</span>
      <span class="mobile-nav__label">Admin</span>
    </button>
  </div>
</nav>

<!-- Tablet hamburger (inside .header__content or separate) -->
<button class="tablet-hamburger" aria-label="Open menu" aria-expanded="false" id="hamburger-btn">
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
</button>
```

### 10.3 Complete Mobile Navigation CSS

```css
/* ─── MOBILE NAV ────────────────────────────────────── */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(13, 13, 20, 0.85);
  backdrop-filter: blur(24px) saturate(1.6);
  -webkit-backdrop-filter: blur(24px) saturate(1.6);
  border-top: 1px solid var(--color-border-subtle);

  /* safe area inset for iOS notch/home indicator */
  padding-bottom: max(env(safe-area-inset-bottom), 0.5rem);

  box-shadow:
    0 -4px 32px rgba(0, 0, 0, 0.50),
    0 -1px 0 var(--color-border-subtle);

  /* hide on desktop */
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .mobile-nav {
    display: none;
  }
}

/* ─── NAV ITEMS WRAPPER ─────────────────────────────── */
.mobile-nav__items {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: stretch;
  width: 100%;
  padding: 0.375rem 0.5rem 0;
}

/* ─── NAV ITEM ──────────────────────────────────────── */
.mobile-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1875rem;
  flex: 1;

  /* minimum 44x44px tap target (Apple HIG requirement) */
  min-height: 44px;
  min-width: 44px;
  padding: 0.375rem 0.25rem;

  background: none;
  border: none;
  cursor: pointer;
  border-radius: 0.625rem;
  color: var(--color-text-muted);
  position: relative;
  transition:
    background-color 0.20s ease,
    color 0.20s ease;
  outline: none;
}

.mobile-nav__item:hover {
  background-color: var(--color-bg-hover);
  color: var(--color-text-secondary);
}

.mobile-nav__item:focus-visible {
  outline: 2px solid var(--color-teal-500);
  outline-offset: 2px;
}

/* ─── ACTIVE NAV ITEM ───────────────────────────────── */
.mobile-nav__item.is-active {
  color: var(--color-teal-400);
}

/* active indicator dot above icon */
.mobile-nav__item.is-active::before {
  content: '';
  position: absolute;
  top: 0.1875rem;
  left: 50%;
  transform: translateX(-50%);
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 50%;
  background: var(--color-teal-500);
  box-shadow: 0 0 6px var(--color-teal-glow);
}

/* ─── NAV ICON ──────────────────────────────────────── */
.mobile-nav__icon {
  font-size: 1.25rem;
  line-height: 1;
  display: block;
  transition: transform 0.20s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mobile-nav__item.is-active .mobile-nav__icon {
  transform: scale(1.15);
}

.mobile-nav__item:active .mobile-nav__icon {
  transform: scale(0.90);
}

/* ─── NAV LABEL ─────────────────────────────────────── */
.mobile-nav__label {
  font-family: var(--font-body);
  font-size: 0.5625rem;   /* 9px — very small for nav labels */
  font-weight: var(--fw-semibold);
  letter-spacing: var(--ls-caps);
  text-transform: uppercase;
  line-height: 1;
}

/* ─── TABLET HAMBURGER ──────────────────────────────── */
.tablet-hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 0.5rem;
  cursor: pointer;
  padding: 0.375rem;
  transition: border-color 0.20s ease, background-color 0.20s ease;
  outline: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 90;
}

/* show on tablets only */
@media (min-width: 640px) and (max-width: 1023px) {
  .tablet-hamburger {
    display: flex;
  }
}

.tablet-hamburger:hover {
  background: var(--color-bg-elevated);
  border-color: var(--color-border-strong);
}

.tablet-hamburger:focus-visible {
  outline: 2px solid var(--color-teal-500);
  outline-offset: 3px;
}

/* ─── HAMBURGER LINES ───────────────────────────────── */
.hamburger-line {
  display: block;
  width: 1.25rem;
  height: 2px;
  background-color: var(--color-text-secondary);
  border-radius: 999px;
  transition:
    transform 0.30s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.20s ease;
  transform-origin: center;
}

/* ─── HAMBURGER OPEN STATE (X shape) ────────────────── */
.tablet-hamburger[aria-expanded="true"] .hamburger-line:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.tablet-hamburger[aria-expanded="true"] .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.tablet-hamburger[aria-expanded="true"] .hamburger-line:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

/* ─── BODY SCROLL LOCK when nav/drawer open ─────────── */
body.nav-open {
  overflow: hidden;
}

/* ─── SAFE AREA UTILITIES ───────────────────────────── */
.safe-area-top {
  padding-top: max(env(safe-area-inset-top), 0px);
}

.safe-area-bottom {
  padding-bottom: max(env(safe-area-inset-bottom), 0px);
}

/* ensure portal-main doesn't hide behind mobile nav */
@media (max-width: 1023px) {
  .portal-main {
    padding-bottom: calc(max(env(safe-area-inset-bottom), 0.5rem) + 5rem);
  }
}
```

---

## 11. IMPLEMENTATION NOTES

### 11.1 Vanilla JS State Management

The portal uses a single centralized state object — no framework required. All UI changes derive from mutations to this object, and a lightweight publish/subscribe system propagates those changes to DOM updaters.

```js
// ─── STATE STORE ──────────────────────────────────────
const Store = (() => {
  let state = {
    apps: [],              // Array<AppEntry> — all loaded app data
    filtered: [],          // Array<AppEntry> — current view after filters
    activeCategory: 'all', // string — current filter chip
    searchQuery: '',       // string — current search text
    isAdminMode: false,    // boolean — controls .admin-mode class on body
    isDrawerOpen: false,   // boolean — admin drawer state
    editingAppId: null,    // string|null — which app is being edited
    isLoading: true,       // boolean — skeleton state
  };

  const listeners = {};

  function getState() {
    return { ...state };
  }

  function setState(partial) {
    const prev = { ...state };
    state = { ...state, ...partial };
    Object.keys(partial).forEach(key => {
      if (listeners[key]) {
        listeners[key].forEach(fn => fn(state[key], prev[key]));
      }
    });
    if (listeners['*']) {
      listeners['*'].forEach(fn => fn(state, prev));
    }
  }

  function on(key, fn) {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(fn);
  }

  function off(key, fn) {
    if (!listeners[key]) return;
    listeners[key] = listeners[key].filter(f => f !== fn);
  }

  return { getState, setState, on, off };
})();

// ─── EXAMPLE SUBSCRIPTION ────────────────────────────
Store.on('filtered', (filtered) => {
  renderGrid(filtered);
  document.getElementById('portal-count').textContent = filtered.length;
});

Store.on('isAdminMode', (isAdmin) => {
  document.body.classList.toggle('admin-mode', isAdmin);
});

Store.on('isDrawerOpen', (isOpen) => {
  const drawer = document.getElementById('admin-drawer');
  const overlay = document.getElementById('admin-overlay');
  drawer.classList.toggle('is-open', isOpen);
  drawer.setAttribute('aria-hidden', String(!isOpen));
  overlay.classList.toggle('is-visible', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
});

// ─── FILTER LOGIC ────────────────────────────────────
function applyFilters() {
  const { apps, activeCategory, searchQuery } = Store.getState();
  const q = searchQuery.trim().toLowerCase();

  const filtered = apps.filter(app => {
    const matchCat = activeCategory === 'all' || app.category === activeCategory;
    const matchQ   = !q ||
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  Store.setState({ filtered });
}

Store.on('activeCategory', applyFilters);
Store.on('searchQuery',    applyFilters);
```

### 11.2 localStorage Admin Session Persistence

Admin mode is gated by a session token stored in `localStorage`. The token auto-expires after a configurable TTL (default 4 hours) — the portal is not security-critical but the friction discourages accidental admin access.

```js
const SESSION_KEY   = 'sacred-chaos-admin';
const SESSION_TTL   = 4 * 60 * 60 * 1000; // 4 hours in ms
const ADMIN_PASSKEY = 'funkyblackpoppy';   // set via env or config file — never commit real secrets

function saveAdminSession() {
  const payload = {
    token: btoa(ADMIN_PASSKEY + Date.now()),
    expires: Date.now() + SESSION_TTL,
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch (_) {
    // quota exceeded — fail silently, session just won't persist
  }
}

function loadAdminSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { expires } = JSON.parse(raw);
    if (Date.now() > expires) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

function clearAdminSession() {
  localStorage.removeItem(SESSION_KEY);
}

// On page load:
if (loadAdminSession()) {
  Store.setState({ isAdminMode: true });
}

// On admin toggle click:
document.getElementById('admin-toggle').addEventListener('click', () => {
  const { isAdminMode } = Store.getState();
  if (!isAdminMode) {
    const pass = prompt('Sacred Chaos admin passkey:');
    if (pass === ADMIN_PASSKEY) {
      saveAdminSession();
      Store.setState({ isAdminMode: true });
    }
  } else {
    clearAdminSession();
    Store.setState({ isAdminMode: false, isDrawerOpen: false });
  }
});
```

### 11.3 CSS Custom Property Toggling for Theme Variants

The portal supports a CSS-only theming system. The `body` element receives class flags that override `:root` custom properties. This means any third-party component or embedded iframe can read the same variables if it inherits the CSS cascade.

```css
/* default is already dark — :root defines dark values */

/* admin-mode: subtle purple tint shift */
body.admin-mode {
  --color-bg-surface:   #16122a;
  --color-bg-elevated:  #1e1840;
  --color-border-default: rgba(107, 33, 168, 0.30);
}

/* theme-light: hypothetical light override */
body.theme-light {
  --color-bg-void:      #f5f3ff;
  --color-bg-base:      #f0eeff;
  --color-bg-surface:   #ffffff;
  --color-bg-elevated:  #f8f5ff;
  --color-text-primary: #0d0a1a;
  --color-text-secondary: #3d3558;
  --color-text-muted:   #8b86a8;
  --color-border-default: rgba(107, 33, 168, 0.18);
}

/* high-contrast override for accessibility */
body.theme-high-contrast {
  --color-border-default: rgba(255, 255, 255, 0.50);
  --color-text-secondary: #f0eff8;
  --color-text-muted:     #c4b5fd;
}
```

Toggle via JS:

```js
function setTheme(themeName) {
  document.body.classList.remove('theme-light', 'theme-high-contrast');
  if (themeName !== 'dark') {
    document.body.classList.add(`theme-${themeName}`);
  }
  localStorage.setItem('sacred-chaos-theme', themeName);
}

// Restore on load
const savedTheme = localStorage.getItem('sacred-chaos-theme');
if (savedTheme) setTheme(savedTheme);
```

### 11.4 Performance Tips

**CSS Containment.** Add `contain: layout style paint` to `.card`, `.admin-drawer`, and `.search-section`. This tells the browser that changes inside these elements cannot affect layout outside them, enabling aggressive rendering optimizations.

```css
.card          { contain: layout style paint; }
.admin-drawer  { contain: layout style; }   /* not 'paint' — drawer overlaps page */
.search-section { contain: layout style; }
```

**`will-change` Usage.** Only apply `will-change` immediately before an animation begins, and remove it after. Overuse creates excessive GPU memory pressure.

```js
card.addEventListener('mouseenter', () => {
  card.style.willChange = 'transform, box-shadow';
});
card.addEventListener('mouseleave', () => {
  card.style.willChange = 'auto';
});
```

For the admin drawer, set it in CSS only when the drawer is known to animate:

```css
.admin-drawer.will-animate {
  will-change: transform;
}
```

**IntersectionObserver for Lazy Thumbnails.** Images are marked `loading="lazy"` in HTML which handles most cases, but for finer control (e.g., to trigger skeleton-to-image swap animations):

```js
const thumbObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.addEventListener('load', () => {
        img.closest('.card--skeleton')?.classList.remove('card--skeleton');
      }, { once: true });
    }
    thumbObserver.unobserve(img);
  });
}, {
  rootMargin: '200px 0px',  // start loading 200px before visible
  threshold: 0,
});

document.querySelectorAll('img[data-src]').forEach(img => thumbObserver.observe(img));
```

**`requestAnimationFrame` for Scroll Effects.** Batch all scroll-driven style updates inside `rAF` to avoid layout thrashing:

```js
let lastScrollY = 0;
let rafPending  = false;

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY;
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      updateScrollEffects(lastScrollY);
      rafPending = false;
    });
  }
}, { passive: true });

function updateScrollEffects(scrollY) {
  // e.g., parallax the header background
  const header = document.querySelector('.header__bg');
  if (header) {
    header.style.transform = `translateY(${scrollY * 0.25}px)`;
  }
}
```

### 11.5 App Data Structure

Each app entry is a plain JSON object. The portal loads these from a `apps.json` file at startup (or they can be inlined in the HTML for zero-request loading).

```json
{
  "id": "ritual-sequencer",
  "name": "Ritual Sequencer",
  "description": "Build complex beat patterns with sacred timing ratios. Export as audio or MIDI for your ceremonies.",
  "url": "apps/ritual-sequencer/index.html",
  "thumbnail": "thumbnails/ritual-sequencer.jpg",
  "thumbnailAlt": "Ritual Sequencer app screenshot showing a grid of sound triggers",
  "category": "music",
  "tags": ["music", "tools"],
  "status": "shareable",
  "price": null,
  "priceDisplay": "Free",
  "featured": false,
  "archived": false,
  "createdAt": "2025-11-14T00:00:00Z",
  "updatedAt": "2026-04-02T00:00:00Z",
  "version": "1.3.0",
  "externalLinks": {
    "github": null,
    "demo": null
  }
}
```

**Field Reference:**

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique slug, used as `data-app-id` on the card element |
| `name` | `string` | Display name — rendered in `.card__title` |
| `description` | `string` | Short description — rendered in `.card__description` |
| `url` | `string` | Relative path to the app's `index.html` |
| `thumbnail` | `string` | Relative path to thumbnail image |
| `thumbnailAlt` | `string` | Descriptive alt text for accessibility |
| `category` | `string` | One of: `tools`, `art`, `writing`, `music`, `games`, `generators`, `rituals` |
| `tags` | `string[]` | Array of tags (can include multiple categories) |
| `status` | `string` | One of: `shareable`, `for-sale`, `personal`, `archived` |
| `price` | `number\|null` | Price in dollars; `null` if free |
| `priceDisplay` | `string` | Human-readable price: `"Free"`, `"$12"`, `"$4.99"` |
| `featured` | `boolean` | If `true`, card may receive featured styling or sort priority |
| `archived` | `boolean` | Convenience flag mirroring `status === 'archived'` |
| `createdAt` | `string` | ISO 8601 timestamp |
| `updatedAt` | `string` | ISO 8601 timestamp |
| `version` | `string` | Semver string for the app |

### 11.6 HTML Semantic Structure Overview

The full page uses proper HTML5 landmarks throughout. This is the skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#0a0a0f" />
  <meta name="color-scheme" content="dark" />
  <title>Sacred Chaos — App Portal by Funky Black Poppy</title>
  <meta name="description" content="A curated portal of indie web apps by Funky Black Poppy. Dark cosmic mystical tools for creative chaos." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="styles/portal.css" />
</head>
<body class="portal-wrapper">

  <!-- Fixed admin overlay (hidden by default) -->
  <div class="admin-overlay" id="admin-overlay" aria-hidden="true"></div>

  <!-- Fixed admin drawer (hidden by default) -->
  <aside class="admin-drawer" id="admin-drawer" role="dialog" aria-modal="true" aria-label="Admin panel" aria-hidden="true">
    <!-- admin panel content (see Section 8) -->
  </aside>

  <!-- Page header landmark -->
  <header class="header" role="banner">
    <!-- header content (see Section 6) -->
  </header>

  <!-- Sticky search/filter bar -->
  <section class="search-section" aria-label="Search and filter">
    <!-- search content (see Section 5) -->
  </section>

  <!-- Main content landmark -->
  <main class="portal-main" id="main-content">
    <div class="container">

      <!-- Screen-reader skip link (placed before header in real HTML) -->
      <!-- <a href="#main-content" class="skip-link">Skip to content</a> -->

      <div class="portal-grid-header">
        <h2 class="portal-grid-header__heading label">All Portals</h2>
        <span class="portal-grid-header__count" role="status" aria-live="polite">
          <span id="visible-count">23</span> apps
        </span>
      </div>

      <!-- App grid -->
      <div class="portal-grid" id="portal-grid" role="list" aria-label="App grid">
        <!-- Cards rendered here by JS (see Section 3) -->
        <!-- role="listitem" on each .card article -->
      </div>

    </div>
  </main>

  <!-- Footer landmark -->
  <footer class="portal-footer" role="contentinfo">
    <div class="container">
      <p class="caption">Funky Black Poppy &copy; 2026 — Sacred Chaos Portal</p>
    </div>
  </footer>

  <!-- Fixed mobile bottom nav -->
  <nav class="mobile-nav" role="navigation" aria-label="Mobile navigation">
    <!-- nav items (see Section 10) -->
  </nav>

  <!-- Portal state + app data -->
  <script src="scripts/portal.js" defer></script>
</body>
</html>
```

**Key accessibility notes:**
- A visually hidden `<a href="#main-content">Skip to content</a>` is the first focusable element in the page — essential for keyboard users.
- The `.portal-grid` uses `role="list"` and each `.card` uses `role="listitem"` so screen readers announce item counts.
- All interactive elements have `:focus-visible` outlines defined in the component CSS (see Sections 3, 5, 6, 8, 10).
- The `.admin-drawer` uses `aria-modal="true"` and focus should be trapped inside while open (implement with a focus trap utility).
- `aria-live="polite"` on count elements ensures screen readers announce filter result changes without interrupting.
- Color is never the sole means of conveying information — badges use text labels, not just color.

---

*End of Sacred Chaos Portal UI/UX Design Specification — Funky Black Poppy — v1.0*

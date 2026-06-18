# Sacred Chaos App Portal — UI/UX Improvement Spec
### Funky Black Poppy · Rachael Nike · v2.0

---

## Audit Summary

The portal is a well-structured single-file HTML app with solid foundations:
a glassmorphic dark theme, working starfield canvas, spring-eased admin drawer,
and safe-area-aware bottom nav. The gaps are in depth: no motion choreography,
flat filter logic, emoji-only card thumbnails, and a dense admin form that fights
small screens. Every section below gives the exact CSS/JS to fix it.

---

## 1. Password Gate Redesign

### Goal
Turn the plain centered form into a ritual moment — sacred geometry SVG animating
behind the form, the brand name arriving letter-by-letter, and a pulsing portal
glow that feels alive before the user even types.

### 1a — Sacred Geometry SVG Background

Replace the static `.gate-glow` div with an inline SVG that draws itself via
`stroke-dashoffset` animation. Drop this inside `#gate`, before `.gate-logo`:

```html
<svg class="gate-geometry" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"
     aria-hidden="true">
  <!-- Outer circle -->
  <circle cx="250" cy="250" r="220" class="geo-line geo-ring-1"/>
  <!-- Inner circle -->
  <circle cx="250" cy="250" r="160" class="geo-line geo-ring-2"/>
  <!-- Star of David hexagon -->
  <polygon points="250,60 340,200 160,200" class="geo-line geo-tri-1"/>
  <polygon points="250,440 160,300 340,300" class="geo-line geo-tri-2"/>
  <!-- Six vesica petals (Flower of Life seed) -->
  <circle cx="250" cy="90"  r="80" class="geo-line geo-petal"/>
  <circle cx="319" cy="170" r="80" class="geo-line geo-petal"/>
  <circle cx="319" cy="330" r="80" class="geo-line geo-petal"/>
  <circle cx="250" cy="410" r="80" class="geo-line geo-petal"/>
  <circle cx="181" cy="330" r="80" class="geo-line geo-petal"/>
  <circle cx="181" cy="170" r="80" class="geo-line geo-petal"/>
  <!-- Center dot -->
  <circle cx="250" cy="250" r="6" class="geo-center"/>
</svg>
```

```css
/* Sacred geometry */
.gate-geometry {
  position: absolute;
  width: min(520px, 90vw);
  height: min(520px, 90vw);
  opacity: 0.18;
  animation: geoSpin 60s linear infinite;
  pointer-events: none;
}

.geo-line {
  fill: none;
  stroke-width: 1;
  stroke-linecap: round;
}
.geo-ring-1  { stroke: #8b5cf6; stroke-dasharray: 1382; stroke-dashoffset: 1382;
               animation: drawLine 3s 0.2s ease forwards; }
.geo-ring-2  { stroke: #06b6d4; stroke-dasharray: 1005; stroke-dashoffset: 1005;
               animation: drawLine 2.5s 0.6s ease forwards; }
.geo-tri-1   { stroke: #ec4899; stroke-dasharray: 600; stroke-dashoffset: 600;
               animation: drawLine 2s 1s ease forwards; }
.geo-tri-2   { stroke: #f59e0b; stroke-dasharray: 600; stroke-dashoffset: 600;
               animation: drawLine 2s 1.3s ease forwards; }
.geo-petal   { stroke: #8b5cf680; stroke-dasharray: 503; stroke-dashoffset: 503;
               animation: drawLine 3s 1.6s ease forwards; }
.geo-center  { fill: #8b5cf6; opacity: 0;
               animation: fadeIn 0.4s 3s ease forwards; }

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}
@keyframes geoSpin {
  to { transform: rotate(360deg); }
}
@keyframes fadeIn {
  to { opacity: 1; }
}
```

### 1b — Brand Tagline Animation

Replace the static `.gate-sub` text with a letter-by-letter reveal:

```html
<div class="gate-sub" id="gateSub" aria-label="Funky Black Poppy · Rachael Nike"></div>
```

```js
// Run after DOM ready
(function animateTagline() {
  const el = document.getElementById('gateSub');
  const text = 'Funky Black Poppy  ✦  Rachael Nike';
  el.innerHTML = text.split('').map((ch, i) =>
    `<span style="animation-delay:${(i * 0.04 + 2.2).toFixed(2)}s">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');
})();
```

```css
.gate-sub span {
  display: inline-block;
  opacity: 0;
  transform: translateY(8px);
  animation: letterIn 0.4s ease forwards;
}
@keyframes letterIn {
  to { opacity: 1; transform: translateY(0); }
}
```

### 1c — Pulsing Portal Glow

Upgrade `.gate-glow` to a triple-ring pulse:

```css
.gate-glow {
  position: absolute;
  width: 500px; height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, #8b5cf640 0%, #ec489920 40%, transparent 70%);
  animation: portalPulse 4s ease-in-out infinite;
  pointer-events: none;
}
.gate-glow::before,
.gate-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid #8b5cf640;
  animation: ringExpand 4s ease-out infinite;
}
.gate-glow::after {
  animation-delay: 1.3s;
}
@keyframes portalPulse {
  0%, 100% { transform: scale(1);   opacity: 0.7; }
  50%       { transform: scale(1.08); opacity: 1;   }
}
@keyframes ringExpand {
  0%   { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0;   }
}
```

### 1d — Wrong Password Shake

Replace the plain error text reveal with a shake + red border flash:

```js
function checkPassword() {
  const input = document.getElementById('pwInput');
  const val = input.value.trim();
  if (val === PASSWORD) {
    // existing fade-out logic
    document.getElementById('gate').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('gate').style.display = 'none';
      document.getElementById('app').classList.add('visible');
    }, 600);
  } else {
    const err = document.getElementById('gateError');
    err.textContent = 'Incorrect password. Try again.';
    input.value = '';
    input.classList.add('shake');
    input.addEventListener('animationend', () => input.classList.remove('shake'), { once: true });
    input.focus();
  }
}
```

```css
.gate-form input.shake {
  animation: inputShake 0.45s ease;
  border-color: #ec4899 !important;
}
@keyframes inputShake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-10px); }
  40%       { transform: translateX(10px);  }
  60%       { transform: translateX(-6px);  }
  80%       { transform: translateX(6px);   }
}
```

---

## 2. Card Visual Upgrades

### 2a — Gradient Mesh Thumbnails Per Category

Replace the emoji-on-gradient thumbnail with category-coded CSS mesh gradients.
Each card thumbnail becomes a proper visual header, not just a colored box with an emoji.

Add a `data-category` attribute to each card `div.card` when rendering, then define
per-category thumbnail styles:

```js
// Inside renderCards(), update the card HTML template:
function cardThumbnail(app) {
  return `
    <div class="card-thumb" data-cat="${escHtml(app.category)}">
      <span class="card-emoji">${escHtml(app.emoji || '✦')}</span>
      <div class="thumb-shimmer"></div>
    </div>`;
}
```

```css
.card-thumb {
  position: relative;
  height: 140px;
  border-radius: 10px 10px 0 0;
  margin: -1.25rem -1.25rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Category mesh gradients */
.card-thumb[data-cat="Art Tools"] {
  background: radial-gradient(ellipse at 20% 30%, #8b5cf680 0%, transparent 60%),
              radial-gradient(ellipse at 80% 70%, #ec489960 0%, transparent 50%),
              linear-gradient(135deg, #16162a 0%, #1e0a2e 100%);
}
.card-thumb[data-cat="Business"] {
  background: radial-gradient(ellipse at 30% 20%, #06b6d480 0%, transparent 60%),
              radial-gradient(ellipse at 70% 80%, #8b5cf660 0%, transparent 50%),
              linear-gradient(135deg, #0a1628 0%, #0a2030 100%);
}
.card-thumb[data-cat="Fun"] {
  background: radial-gradient(ellipse at 50% 10%, #f59e0b80 0%, transparent 50%),
              radial-gradient(ellipse at 20% 90%, #ec489960 0%, transparent 60%),
              linear-gradient(135deg, #1a100a 0%, #2a0a1a 100%);
}
.card-thumb[data-cat="Spiritual"] {
  background: radial-gradient(ellipse at 40% 40%, #8b5cf6a0 0%, transparent 50%),
              radial-gradient(ellipse at 60% 60%, #06b6d460 0%, transparent 50%),
              radial-gradient(ellipse at 80% 10%, #f59e0b40 0%, transparent 40%),
              linear-gradient(135deg, #0d0820 0%, #100a28 100%);
}
.card-thumb[data-cat="Productivity"] {
  background: radial-gradient(ellipse at 60% 30%, #06b6d460 0%, transparent 60%),
              radial-gradient(ellipse at 20% 70%, #8b5cf640 0%, transparent 50%),
              linear-gradient(135deg, #081818 0%, #0a1220 100%);
}
/* Fallback for any unlisted category */
.card-thumb:not([data-cat]) {
  background: linear-gradient(135deg, #16162a 0%, #0d0d1a 100%);
}

.card-emoji {
  font-size: 2.8rem;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 12px rgba(139,92,246,0.6));
}
```

### 2b — Shimmer on Hover

```css
.thumb-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg,
    transparent 40%,
    rgba(255,255,255,0.08) 50%,
    transparent 60%);
  transform: translateX(-100%);
  transition: none;
}
.card:hover .thumb-shimmer {
  animation: shimmerSlide 0.6s ease forwards;
}
@keyframes shimmerSlide {
  to { transform: translateX(200%); }
}
```

### 2c — Price Ribbon for For-Sale Cards

```css
/* Add to card render: if app.status === 'forsale' add class .has-ribbon */
.card.has-ribbon .card-thumb::after {
  content: attr(data-price);
  position: absolute;
  top: 14px;
  right: -8px;
  background: linear-gradient(90deg, #f59e0b, #d97706);
  color: #000;
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 14px 3px 10px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 8% 50%);
  letter-spacing: 0.05em;
  box-shadow: 0 2px 8px #f59e0b60;
}
```

In `cardThumbnail()`, add `data-price` to the thumb div:
```js
`<div class="card-thumb" data-cat="${escHtml(app.category)}"
      data-price="${app.price ? '$' + escHtml(app.price) : ''}">`
```

---

## 3. Micro-Interaction Library

Eight specific interactions with implementation:

### M1 — Card Entry Stagger (fix existing)

The existing `nth-child` stagger only covers 8 cards. Replace with a JS-driven
approach that works for any count:

```js
// At the end of renderCards(), after setting innerHTML:
document.querySelectorAll('.card').forEach((card, i) => {
  card.style.animationDelay = `${i * 0.06}s`;
  card.classList.add('card-entering');
});
```

```css
.card-entering {
  animation: cardIn 0.45s ease both;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}
```

### M2 — Button Ripple

```css
.btn-primary, .btn-launch, .btn-buy {
  position: relative;
  overflow: hidden;
}
```

```js
// Add once, covers all buttons
document.addEventListener('pointerdown', function(e) {
  const btn = e.target.closest('.btn-primary, .btn-launch, .btn-buy, .filter-btn');
  if (!btn) return;
  const r = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  r.className = 'ripple';
  r.style.cssText = `width:${size}px;height:${size}px;
    left:${e.clientX - rect.left - size/2}px;
    top:${e.clientY - rect.top  - size/2}px`;
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
});
```

```css
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  transform: scale(0);
  animation: rippleGrow 0.55s ease-out;
  pointer-events: none;
}
@keyframes rippleGrow {
  to { transform: scale(1); opacity: 0; }
}
```

### M3 — Search Input Focus Expand

```css
.search-wrap {
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}
.search-wrap:focus-within {
  box-shadow: 0 0 0 2px #8b5cf680, 0 8px 32px rgba(139,92,246,0.2);
  transform: scaleX(1.01);
}
```

### M4 — Filter Chip Pop-In

When a filter chip is added (see Section 4), animate its arrival:

```css
.filter-chip {
  animation: chipPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes chipPop {
  from { transform: scale(0.6); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
```

### M5 — Heart Favorite Burst

```css
.btn-fav {
  position: relative;
}
.btn-fav.is-faved svg {
  animation: heartBurst 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  fill: #ec4899;
}
@keyframes heartBurst {
  0%   { transform: scale(1);   }
  40%  { transform: scale(1.5); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1);   }
}
```

### M6 — Toast Slide-Up

```js
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast-visible'));
  setTimeout(() => {
    t.classList.remove('toast-visible');
    t.addEventListener('transitionend', () => t.remove());
  }, 3000);
}
```

```css
.toast {
  position: fixed;
  bottom: calc(80px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(22,22,42,0.95);
  border: 1px solid rgba(139,92,246,0.4);
  backdrop-filter: blur(16px);
  color: #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
  font-size: 0.875rem;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 9000;
  pointer-events: none;
  white-space: nowrap;
}
.toast.toast-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.toast.toast-error { border-color: rgba(236,72,153,0.5); }
```

### M7 — Nav Item Active Bounce

```css
.nav-item {
  transition: color 0.2s ease, transform 0.15s ease;
}
.nav-item:active {
  transform: scale(0.88);
}
.nav-item.active .nav-icon {
  display: inline-block;
  animation: navBounce 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes navBounce {
  from { transform: translateY(4px) scale(0.8); }
  to   { transform: translateY(0)   scale(1);   }
}
```

### M8 — Drawer Overlay Blur Build-In

The existing drawer uses `backdrop-filter:blur(4px)` with no transition.
Add:

```css
#drawerOverlay {
  transition: opacity 0.35s ease, backdrop-filter 0.35s ease;
  backdrop-filter: blur(0px);
  opacity: 0;
}
#drawerOverlay.open {
  opacity: 1;
  backdrop-filter: blur(8px);
}
```

---

## 4. Multi-Level Filter System

### Goal
Allow simultaneous category + status filtering. Replace the single-select
status row with two pill rows (Status / Category) plus a dynamic "active chips"
strip that shows what is currently filtered.

### State Model

```js
let activeFilters = {
  status: new Set(),    // 'personal','shareable','forsale','archived','comingsoon'
  category: new Set(),  // 'Art Tools','Business','Fun','Spiritual','Productivity'
};
```

### HTML Replacement

```html
<div class="filter-section">
  <div class="filter-group">
    <span class="filter-label">Status</span>
    <div class="filter-row" id="filterStatus">
      <button class="filter-btn" data-type="status" data-val="all">All</button>
      <button class="filter-btn" data-type="status" data-val="personal">Personal</button>
      <button class="filter-btn" data-type="status" data-val="shareable">Shareable</button>
      <button class="filter-btn" data-type="status" data-val="forsale">For Sale</button>
      <button class="filter-btn" data-type="status" data-val="archived">Archived</button>
      <button class="filter-btn" data-type="status" data-val="comingsoon">Coming Soon</button>
    </div>
  </div>
  <div class="filter-group">
    <span class="filter-label">Category</span>
    <div class="filter-row" id="filterCategory">
      <button class="filter-btn" data-type="category" data-val="Art Tools">Art Tools</button>
      <button class="filter-btn" data-type="category" data-val="Business">Business</button>
      <button class="filter-btn" data-type="category" data-val="Fun">Fun</button>
      <button class="filter-btn" data-type="category" data-val="Spiritual">Spiritual</button>
      <button class="filter-btn" data-type="category" data-val="Productivity">Productivity</button>
    </div>
  </div>
  <!-- Active chip strip -->
  <div class="chip-strip" id="chipStrip"></div>
</div>
```

### JS

```js
function toggleFilter(type, val) {
  if (type === 'status' && val === 'all') {
    activeFilters.status.clear();
  } else {
    const set = activeFilters[type];
    set.has(val) ? set.delete(val) : set.add(val);
  }
  updateFilterButtons();
  renderChips();
  renderCards();
}

function updateFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const type = btn.dataset.type;
    const val  = btn.dataset.val;
    if (val === 'all') {
      btn.classList.toggle('active', activeFilters.status.size === 0 && type === 'status');
    } else {
      btn.classList.toggle('active', activeFilters[type]?.has(val));
    }
  });
}

function renderChips() {
  const strip = document.getElementById('chipStrip');
  const chips = [];
  activeFilters.status.forEach(v =>
    chips.push(`<span class="filter-chip" data-type="status" data-val="${v}"
      onclick="toggleFilter('status','${v}')">${v} ✕</span>`));
  activeFilters.category.forEach(v =>
    chips.push(`<span class="filter-chip cat-chip" data-type="category" data-val="${v}"
      onclick="toggleFilter('category','${v}')">${v} ✕</span>`));
  strip.innerHTML = chips.join('');
  strip.style.display = chips.length ? 'flex' : 'none';
}

// Updated renderCards filter logic:
function appMatchesFilters(app) {
  const statusOk  = activeFilters.status.size === 0   || activeFilters.status.has(app.status);
  const catOk     = activeFilters.category.size === 0 || activeFilters.category.has(app.category);
  const searchOk  = !searchQuery || [app.name, app.description, app.category]
                    .some(f => f?.toLowerCase().includes(searchQuery.toLowerCase()));
  return statusOk && catOk && searchOk;
}

// Wire up buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => toggleFilter(btn.dataset.type, btn.dataset.val));
});
```

### CSS

```css
.filter-section { padding: 0 1.5rem; max-width: 1200px; margin: 0 auto; }
.filter-group   { margin-bottom: 0.5rem; }
.filter-label   { font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
                  color: var(--text-dim); margin-bottom: 0.35rem; display: block; }
.chip-strip     { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }
.filter-chip    { background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.4);
                  color: #c4b5fd; padding: 3px 10px; border-radius: 100px;
                  font-size: 0.72rem; cursor: pointer;
                  transition: background 0.2s ease; }
.filter-chip:hover { background: rgba(139,92,246,0.3); }
.cat-chip       { background: rgba(236,72,153,0.12); border-color: rgba(236,72,153,0.35);
                  color: #f9a8d4; }
```

---

## 5. Sort Bar

### HTML — insert between `.filter-section` and `.grid-section`

```html
<div class="sort-bar" id="sortBar">
  <span class="sort-label">Sort:</span>
  <div class="sort-options">
    <button class="sort-btn active" data-sort="newest">Newest</button>
    <button class="sort-btn" data-sort="oldest">Oldest</button>
    <button class="sort-btn" data-sort="name">Name A–Z</button>
    <button class="sort-btn" data-sort="price">Price ↑</button>
  </div>
</div>
```

### JS

```js
let currentSort = 'newest';

const SORT_FNS = {
  newest: (a, b) => (b.id || '').localeCompare(a.id || ''),
  oldest: (a, b) => (a.id || '').localeCompare(b.id || ''),
  name:   (a, b) => a.name.localeCompare(b.name),
  price:  (a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0),
};

document.querySelectorAll('.sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards();                    // renderCards must use SORT_FNS[currentSort] before render
  });
});

// Inside renderCards(), before building card HTML:
// const sorted = filtered.slice().sort(SORT_FNS[currentSort]);
// then map over sorted instead of filtered
```

### Animated Reorder

Wrap the sort in a FLIP animation so cards visibly slide to new positions:

```js
function renderCardsWithFLIP() {
  const grid = document.getElementById('cardGrid');
  // Record old positions
  const oldPositions = {};
  grid.querySelectorAll('.card[data-id]').forEach(card => {
    const r = card.getBoundingClientRect();
    oldPositions[card.dataset.id] = { x: r.left, y: r.top };
  });

  // Render new order (innerHTML update)
  renderCards();

  // FLIP: invert + play
  grid.querySelectorAll('.card[data-id]').forEach(card => {
    const old = oldPositions[card.dataset.id];
    if (!old) return;
    const r = card.getBoundingClientRect();
    const dx = old.x - r.left;
    const dy = old.y - r.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    card.animate(
      [{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'translate(0,0)' }],
      { duration: 380, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'both' }
    );
  });
}
```

Note: for FLIP to work, each card must have `data-id="${app.id}"` in the rendered HTML.

### CSS

```css
.sort-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem 0;
  max-width: 1200px;
  margin: 0 auto;
}
.sort-label {
  font-size: 0.75rem;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}
.sort-options { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.sort-btn {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  color: var(--text-dim);
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
}
.sort-btn:hover { background: rgba(139,92,246,0.1); color: var(--text); }
.sort-btn.active {
  background: rgba(139,92,246,0.2);
  border-color: rgba(139,92,246,0.5);
  color: #c4b5fd;
}
```

---

## 6. Admin Panel — Mobile-First Form Wizard

### Problem
The current drawer stacks 7 fields vertically with no grouping. On iPhone
(375px wide, 420px drawer capped at 100vw), this creates a scroll marathon.
Replace it with a 3-step wizard: Basic Info → Appearance → Pricing & Status.

### State

```js
let wizardStep = 1;
const WIZARD_STEPS = 3;
```

### HTML — Drawer Interior

```html
<div class="drawer-header">
  <h2 class="drawer-title">Add App</h2>
  <div class="wizard-progress">
    <div class="wizard-step-indicator" id="wizardSteps">
      <span class="ws ws-1 active">1</span>
      <div class="ws-line"></div>
      <span class="ws ws-2">2</span>
      <div class="ws-line"></div>
      <span class="ws ws-3">3</span>
    </div>
    <div class="wizard-step-labels">
      <span>Basics</span><span>Look</span><span>Details</span>
    </div>
  </div>
</div>

<!-- Step 1: Basic Info -->
<div class="wizard-panel" id="wp1">
  <label class="form-label">App Name <span class="req">*</span></label>
  <input id="fName" type="text" class="form-input" placeholder="e.g. Sacred Chaos Invoicer">
  <label class="form-label">App URL</label>
  <input id="fUrl" type="url" class="form-input" placeholder="https://…">
  <label class="form-label">Description</label>
  <textarea id="fDesc" class="form-input" rows="3" placeholder="What does it do?"></textarea>
</div>

<!-- Step 2: Appearance -->
<div class="wizard-panel hidden" id="wp2">
  <label class="form-label">Emoji Icon</label>
  <div class="emoji-picker-row" id="emojiQuickPick">
    🌀 🔮 🎯 🌙 ⚡ 🎨 💎 🦋 🧿 🌺 🔑 🚀
  </div>
  <input id="fEmoji" type="text" class="form-input" maxlength="4"
         placeholder="Or type your own emoji">
  <label class="form-label">Category</label>
  <select id="fCategory" class="form-input">
    <option value="">Choose…</option>
    <option>Art Tools</option>
    <option>Business</option>
    <option>Fun</option>
    <option>Spiritual</option>
    <option>Productivity</option>
  </select>
  <!-- Live card preview -->
  <div class="live-preview-label">Live Preview</div>
  <div class="live-preview-card" id="livePreview">
    <div class="lp-thumb"></div>
    <div class="lp-name">App Name</div>
    <div class="lp-cat">Category</div>
  </div>
</div>

<!-- Step 3: Pricing & Status -->
<div class="wizard-panel hidden" id="wp3">
  <label class="form-label">Status</label>
  <div class="status-radio-group" id="statusRadios">
    <label class="status-radio"><input type="radio" name="status" value="personal"> Personal</label>
    <label class="status-radio"><input type="radio" name="status" value="shareable"> Shareable</label>
    <label class="status-radio"><input type="radio" name="status" value="forsale"> For Sale</label>
    <label class="status-radio"><input type="radio" name="status" value="archived"> Archived</label>
    <label class="status-radio"><input type="radio" name="status" value="comingsoon"> Coming Soon</label>
  </div>
  <div id="priceWrap" class="hidden">
    <label class="form-label">Price</label>
    <input id="fPrice" type="text" class="form-input" placeholder="29.00">
  </div>
</div>

<!-- Wizard navigation -->
<div class="wizard-actions">
  <button class="btn-ghost" id="wizBack" onclick="wizardNav(-1)" style="display:none">← Back</button>
  <button class="btn-primary" id="wizNext" onclick="wizardNav(1)">Next →</button>
</div>
```

### JS

```js
function wizardNav(dir) {
  const panels = document.querySelectorAll('.wizard-panel');
  panels[wizardStep - 1].classList.add('hidden');
  wizardStep = Math.min(Math.max(wizardStep + dir, 1), WIZARD_STEPS);
  panels[wizardStep - 1].classList.remove('hidden');

  // Animate in
  panels[wizardStep - 1].style.animation = 'none';
  requestAnimationFrame(() => {
    panels[wizardStep - 1].style.animation = '';
    panels[wizardStep - 1].classList.add('panel-enter');
  });

  // Update step indicators
  document.querySelectorAll('.ws').forEach((s, i) => {
    s.classList.toggle('active', i < wizardStep);
    s.classList.toggle('current', i === wizardStep - 1);
  });

  // Show/hide nav buttons
  document.getElementById('wizBack').style.display = wizardStep > 1 ? '' : 'none';
  document.getElementById('wizNext').textContent =
    wizardStep === WIZARD_STEPS ? '✓ Save App' : 'Next →';

  if (wizardStep === WIZARD_STEPS) {
    document.getElementById('wizNext').onclick = addApp;
  } else {
    document.getElementById('wizNext').onclick = () => wizardNav(1);
  }
}

// Show/hide price field based on status
document.querySelectorAll('[name="status"]').forEach(r => {
  r.addEventListener('change', () => {
    document.getElementById('priceWrap').classList.toggle('hidden', r.value !== 'forsale');
  });
});

// Emoji quick-pick
document.getElementById('emojiQuickPick').addEventListener('click', e => {
  const emoji = e.target.textContent.trim();
  if (emoji) document.getElementById('fEmoji').value = emoji;
  updateLivePreview();
});

// Live preview updater
function updateLivePreview() {
  const name = document.getElementById('fName').value || 'App Name';
  const cat  = document.getElementById('fCategory').value || 'Category';
  const emoji = document.getElementById('fEmoji').value || '✦';
  document.querySelector('.lp-name').textContent = name;
  document.querySelector('.lp-cat').textContent = cat;
  document.querySelector('.lp-thumb').textContent = emoji;
}
['fName','fUrl','fDesc','fEmoji','fCategory'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateLivePreview);
});
```

### CSS

```css
.wizard-panel { transition: opacity 0.25s ease; }
.wizard-panel.hidden { display: none; }
.panel-enter { animation: panelSlideIn 0.3s ease both; }
@keyframes panelSlideIn {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

.wizard-progress { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.wizard-step-indicator { display: flex; align-items: center; gap: 4px; }
.ws {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 600;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--text-dim);
  transition: all 0.3s ease;
}
.ws.active  { background: rgba(139,92,246,0.2); border-color: #8b5cf6; color: #c4b5fd; }
.ws.current { background: #8b5cf6; border-color: #8b5cf6; color: #fff;
              box-shadow: 0 0 12px #8b5cf680; }
.ws-line    { width: 24px; height: 1px; background: rgba(255,255,255,0.12); }
.wizard-step-labels {
  display: flex; justify-content: space-between;
  width: 100%; font-size: 0.6rem;
  color: var(--text-dim); letter-spacing: 0.08em;
}

.emoji-picker-row {
  display: flex; flex-wrap: wrap; gap: 8px;
  margin-bottom: 0.75rem;
}
.emoji-picker-row span, .emoji-picker-row {
  cursor: default;
}
/* Each emoji in the row; JS splits by space */

.status-radio-group { display: flex; flex-direction: column; gap: 0.5rem; }
.status-radio {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.6rem 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.status-radio:has(input:checked) {
  background: rgba(139,92,246,0.12);
  border-color: rgba(139,92,246,0.4);
}

/* Live preview mini-card */
.live-preview-label {
  font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--text-dim); margin: 1rem 0 0.4rem;
}
.live-preview-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; overflow: hidden;
}
.lp-thumb {
  height: 60px; background: rgba(139,92,246,0.15);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem;
}
.lp-name { font-size: 0.875rem; font-weight: 600; padding: 0.5rem 0.75rem 0.1rem; }
.lp-cat  { font-size: 0.7rem; color: var(--pink); padding: 0 0.75rem 0.5rem; }

.wizard-actions {
  position: sticky; bottom: 0;
  display: flex; gap: 0.75rem; justify-content: flex-end;
  padding: 1rem 1.5rem;
  background: linear-gradient(to top, var(--drawer-bg) 60%, transparent);
}
.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--text-dim);
  padding: 0.6rem 1.2rem; border-radius: 10px;
  font-family: 'Inter', sans-serif;
  cursor: pointer; transition: all 0.2s ease;
}
.btn-ghost:hover { border-color: rgba(139,92,246,0.4); color: var(--text); }
```

---

## 7. Favorites System

### State & Persistence

```js
let favorites = new Set(JSON.parse(localStorage.getItem('scFavorites') || '[]'));

function toggleFavorite(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  localStorage.setItem('scFavorites', JSON.stringify([...favorites]));
  // Re-render just the affected card's heart
  const btn = document.querySelector(`.btn-fav[data-id="${id}"]`);
  if (btn) btn.classList.toggle('is-faved', favorites.has(id));
  // If currently in favorites filter, re-render all
  if (activeFilters.status.has('favorites')) renderCards();
}
```

### Heart Button in Card HTML

Add this inside the card render function, in the `.card-actions` row:

```js
`<button class="btn-fav ${favorites.has(app.id) ? 'is-faved' : ''}"
         data-id="${app.id}"
         onclick="event.stopPropagation(); toggleFavorite('${app.id}')"
         aria-label="Add to favorites">
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
             2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
             C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
             c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
</button>`
```

```css
.btn-fav {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex; align-items: center;
}
.btn-fav svg { fill: transparent; stroke: var(--text-dim); stroke-width: 1.5;
               transition: all 0.2s ease; }
.btn-fav:hover svg { stroke: #ec4899; }
.btn-fav.is-faved {
  background: rgba(236,72,153,0.12);
  border-color: rgba(236,72,153,0.3);
}
.btn-fav.is-faved svg { fill: #ec4899; stroke: #ec4899; }
```

### "My Favorites" Filter Button

Add to the status filter row:

```html
<button class="filter-btn fav-filter-btn" data-type="status" data-val="favorites">
  ♥ Favorites
</button>
```

In `appMatchesFilters()`, add:

```js
const favOk = !activeFilters.status.has('favorites') || favorites.has(app.id);
// Include favOk in the return condition alongside statusOk && catOk && searchOk
```

---

## 8. Voice Search

### Web Speech API Integration

```js
let voiceActive = false;
let recognition;

function initVoiceSearch() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return; // Silently skip on unsupported browsers

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    voiceActive = true;
    document.getElementById('voiceBtn').classList.add('listening');
    document.getElementById('voiceWave').classList.remove('hidden');
    document.getElementById('searchInput').placeholder = 'Listening…';
  };

  recognition.onresult = (e) => {
    const transcript = Array.from(e.results)
      .map(r => r[0].transcript).join('');
    document.getElementById('searchInput').value = transcript;
    searchQuery = transcript;
    renderCards();
  };

  recognition.onend = () => {
    voiceActive = false;
    document.getElementById('voiceBtn').classList.remove('listening');
    document.getElementById('voiceWave').classList.add('hidden');
    document.getElementById('searchInput').placeholder = 'Search apps…';
  };

  recognition.onerror = (e) => {
    console.warn('Voice error:', e.error);
    recognition.onend();
  };
}

function toggleVoice() {
  if (!recognition) return;
  voiceActive ? recognition.stop() : recognition.start();
}

// "Hey Chaos" wake phrase — uses continuous recognition in background
function initWakePhrase() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  const wake = new SR();
  wake.continuous = true;
  wake.interimResults = false;
  wake.lang = 'en-US';
  wake.onresult = (e) => {
    const text = e.results[e.results.length - 1][0].transcript.toLowerCase();
    if (text.includes('hey chaos') || text.includes('hey portal')) {
      toggleVoice();
    }
  };
  // Start wake phrase listener after user interacts with page
  document.addEventListener('click', () => {
    try { wake.start(); } catch(_) {}
  }, { once: true });
}

initVoiceSearch();
initWakePhrase();
```

### Voice Button — add inside `.search-wrap`

```html
<button class="voice-btn" id="voiceBtn" onclick="toggleVoice()"
        title="Voice search (or say 'Hey Chaos')" aria-label="Voice search">
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z"/>
    <path d="M17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08
             c3.39-.49 6-3.39 6-6.92h-2z"/>
  </svg>
</button>

<!-- Waveform visualizer -->
<div class="voice-wave hidden" id="voiceWave">
  <span></span><span></span><span></span><span></span><span></span>
</div>
```

### CSS

```css
.voice-btn {
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 6px 8px;
  color: var(--text-dim);
  cursor: pointer;
  transition: all 0.2s ease;
}
.voice-btn:hover { color: var(--purple); border-color: rgba(139,92,246,0.4); }
.voice-btn.listening {
  color: #ec4899;
  border-color: rgba(236,72,153,0.5);
  background: rgba(236,72,153,0.1);
  animation: voicePulse 1s ease-in-out infinite;
}
@keyframes voicePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(236,72,153,0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(236,72,153,0);  }
}

.voice-wave {
  position: absolute;
  right: 44px; top: 50%;
  transform: translateY(-50%);
  display: flex; align-items: center; gap: 3px;
}
.voice-wave.hidden { display: none; }
.voice-wave span {
  display: block; width: 3px; border-radius: 3px;
  background: #ec4899;
  animation: waveBar 0.7s ease-in-out infinite alternate;
}
.voice-wave span:nth-child(1) { height: 6px;  animation-delay: 0s; }
.voice-wave span:nth-child(2) { height: 12px; animation-delay: 0.1s; }
.voice-wave span:nth-child(3) { height: 18px; animation-delay: 0.2s; }
.voice-wave span:nth-child(4) { height: 12px; animation-delay: 0.3s; }
.voice-wave span:nth-child(5) { height: 6px;  animation-delay: 0.4s; }
@keyframes waveBar {
  from { transform: scaleY(0.4); opacity: 0.5; }
  to   { transform: scaleY(1);   opacity: 1;   }
}
```

---

## 9. App Card Detail Improvements

### 9a — Version Timeline in Detail Drawer

When a card is clicked (or a "Details" button is tapped), open a detail drawer
(separate from the admin drawer, slides from the left or bottom on mobile).

Add a `versions` array to each app object:
```js
// Example app data shape:
{
  id: 'user-1700000000000',
  name: 'Sacred Chaos Invoicer',
  versions: [
    { v: '1.0', date: '2024-01-15', note: 'Initial launch' },
    { v: '1.1', date: '2024-03-02', note: 'Added PDF export' },
    { v: '2.0', date: '2025-06-01', note: 'Supabase auth added' },
  ],
  backends: ['Supabase', 'Cloudflare KV'],
  // … rest of fields
}
```

Version timeline HTML (rendered inside detail drawer):

```html
<div class="version-timeline">
  <h3 class="detail-section-label">Version History</h3>
  <div class="timeline">
    <!-- Repeat per version, newest first -->
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-content">
        <span class="tl-version">v2.0</span>
        <span class="tl-date">Jun 2025</span>
        <p class="tl-note">Supabase auth added</p>
      </div>
    </div>
  </div>
</div>
```

```css
.version-timeline { margin-top: 1.5rem; }
.detail-section-label {
  font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--text-dim); margin-bottom: 0.75rem;
}
.timeline { position: relative; padding-left: 20px; }
.timeline::before {
  content: '';
  position: absolute; left: 7px; top: 4px; bottom: 4px;
  width: 1px; background: rgba(139,92,246,0.3);
}
.tl-item { display: flex; gap: 12px; margin-bottom: 1rem; position: relative; }
.tl-dot {
  position: absolute; left: -16px; top: 3px;
  width: 10px; height: 10px; border-radius: 50%;
  background: #8b5cf6;
  box-shadow: 0 0 8px #8b5cf680;
  flex-shrink: 0;
}
.tl-version { font-weight: 600; color: #c4b5fd; font-size: 0.8rem; }
.tl-date    { font-size: 0.72rem; color: var(--text-dim); margin-left: 0.5rem; }
.tl-note    { font-size: 0.8rem; color: var(--text-dim); margin-top: 2px; }
```

### 9b — Backend Badges

```js
function renderBackendBadges(backends = []) {
  const BACKEND_META = {
    'Supabase':        { color: '#3ecf8e', icon: '⚡' },
    'Cloudflare KV':   { color: '#f6821f', icon: '☁' },
    'Firebase':        { color: '#ffca28', icon: '🔥' },
    'PlanetScale':     { color: '#8b5cf6', icon: '🪐' },
    'Railway':         { color: '#ec4899', icon: '🚂' },
    'Vercel KV':       { color: '#ffffff', icon: '▲' },
  };
  return backends.map(b => {
    const meta = BACKEND_META[b] || { color: '#94a3b8', icon: '⚙' };
    return `<span class="backend-badge" style="--bc:${meta.color}">
              ${meta.icon} ${b}
            </span>`;
  }).join('');
}
```

```css
.backend-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(var(--bc), 0.1);
  border: 1px solid color-mix(in srgb, var(--bc) 40%, transparent);
  color: var(--bc);
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 500;
}
/* Fallback for browsers without color-mix: */
.backend-badge { border-color: rgba(255,255,255,0.15); }
```

### 9c — Copy-Link Button

```js
function copyAppLink(url, btnEl) {
  navigator.clipboard.writeText(url).then(() => {
    btnEl.textContent = '✓ Copied!';
    btnEl.classList.add('copied');
    setTimeout(() => {
      btnEl.textContent = '⎘ Copy Link';
      btnEl.classList.remove('copied');
    }, 2000);
  });
}
```

```html
<button class="btn-copy-link" onclick="copyAppLink('${app.url}', this)">
  ⎘ Copy Link
</button>
```

```css
.btn-copy-link {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-dim);
  padding: 6px 14px; border-radius: 8px;
  font-size: 0.8rem; cursor: pointer;
  transition: all 0.2s ease;
}
.btn-copy-link.copied {
  background: rgba(6,182,212,0.1);
  border-color: rgba(6,182,212,0.4);
  color: var(--teal);
}
```

---

## 10. Transition Animations — View Transitions API

The View Transitions API lets the browser cross-fade (or perform custom
animations) between DOM states without a router. Because this is a single-page
app, use it for: filter changes, sort changes, and opening/closing the detail
drawer.

### Feature Detection Wrapper

```js
function withViewTransition(updateFn) {
  if (!document.startViewTransition) {
    updateFn();
    return;
  }
  document.startViewTransition(updateFn);
}
```

### Apply to renderCards

```js
// Replace every direct call to renderCards() with:
withViewTransition(() => renderCards());
```

### Custom Transition Styles

```css
/* Default cross-fade override — make it more dramatic */
::view-transition-old(root) {
  animation: vtFadeOut 0.22s ease both;
}
::view-transition-new(root) {
  animation: vtFadeIn 0.22s ease both;
}
@keyframes vtFadeOut {
  to { opacity: 0; transform: scale(0.98); }
}
@keyframes vtFadeIn {
  from { opacity: 0; transform: scale(1.02); }
}

/* Per-card transitions — give each card a unique view-transition-name */
/* Apply in renderCards() JS: card.style.viewTransitionName = 'card-' + app.id */
/* Then cards that persist across re-renders will animate in-place */
.card { view-transition-name: none; } /* default off; set per-card via JS */
```

In `renderCards()`, after setting innerHTML, assign names:

```js
document.querySelectorAll('.card[data-id]').forEach(card => {
  card.style.viewTransitionName = `card-${card.dataset.id}`;
});
```

### Detail Drawer Transition

```css
/* Named transition for the detail drawer */
#detailDrawer {
  view-transition-name: detail-drawer;
}
::view-transition-old(detail-drawer) {
  animation: drawerSlideOut 0.3s cubic-bezier(0.16,1,0.3,1) both;
}
::view-transition-new(detail-drawer) {
  animation: drawerSlideIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes drawerSlideOut { to   { transform: translateX(100%); } }
@keyframes drawerSlideIn  { from { transform: translateX(100%); } }
```

---

## 11. Starfield Upgrade — Parallax + Shooting Stars

The existing canvas only twinkes. Two additions that require minimal code:

### Parallax Drift on Mouse/Gyroscope

```js
let mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;  // -1 to 1
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// In the star draw loop, offset each star's draw position by parallax factor:
// Modify the draw() function inside the IIFE:
function draw(t) {
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    const px = s.x + mouseX * s.r * 8;  // deeper (bigger) stars move more
    const py = s.y + mouseY * s.r * 8;
    const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed * 1000 + s.phase));
    ctx.beginPath();
    ctx.arc(px, py, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.color;
    ctx.globalAlpha = a;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

// Gyroscope for mobile (iOS requires user permission):
if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', e => {
    mouseX = (e.gamma || 0) / 45;   // -1 to 1 for ±45° tilt
    mouseY = (e.beta  || 0) / 45;
  });
}
```

### Shooting Stars

```js
const shooters = [];

function spawnShooter() {
  shooters.push({
    x: Math.random() * w,
    y: Math.random() * h * 0.5,
    vx: 4 + Math.random() * 4,
    vy: 1 + Math.random() * 2,
    len: 60 + Math.random() * 80,
    alpha: 1,
    decay: 0.018 + Math.random() * 0.01
  });
}

// In draw(), after drawing stars:
for (let i = shooters.length - 1; i >= 0; i--) {
  const s = shooters[i];
  const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.4);
  grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.beginPath();
  ctx.moveTo(s.x, s.y);
  ctx.lineTo(s.x - s.len, s.y - s.len * 0.4);
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = s.alpha;
  ctx.stroke();
  s.x += s.vx; s.y += s.vy; s.alpha -= s.decay;
  if (s.alpha <= 0) shooters.splice(i, 1);
}
ctx.globalAlpha = 1;

// Spawn a shooter every 4–8 seconds
setInterval(spawnShooter, 4000 + Math.random() * 4000);
```

---

## 12. Recently Viewed History

### State

```js
const MAX_RECENT = 8;
let recentlyViewed = JSON.parse(localStorage.getItem('scRecent') || '[]');

function recordView(appId) {
  recentlyViewed = [appId, ...recentlyViewed.filter(id => id !== appId)].slice(0, MAX_RECENT);
  localStorage.setItem('scRecent', JSON.stringify(recentlyViewed));
  renderRecentBar();
}
```

### Recent Bar HTML — insert above the grid

```html
<div class="recent-bar" id="recentBar" style="display:none">
  <span class="recent-label">Recently Viewed</span>
  <div class="recent-chips" id="recentChips"></div>
</div>
```

### Render

```js
function renderRecentBar() {
  const bar   = document.getElementById('recentBar');
  const chips = document.getElementById('recentChips');
  const apps  = recentlyViewed
    .map(id => allApps.find(a => a.id === id))
    .filter(Boolean);
  if (!apps.length) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';
  chips.innerHTML = apps.map(app =>
    `<button class="recent-chip" onclick="openDetail('${app.id}')">
       <span>${app.emoji || '✦'}</span> ${escHtml(app.name)}
     </button>`
  ).join('');
}
```

### CSS

```css
.recent-bar {
  padding: 0 1.5rem 0.25rem;
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; gap: 0.75rem;
  overflow: hidden;
}
.recent-label {
  font-size: 0.65rem; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--text-dim);
  white-space: nowrap;
}
.recent-chips { display: flex; gap: 0.5rem; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.recent-chips::-webkit-scrollbar { display: none; }
.recent-chip {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 100px;
  padding: 4px 12px;
  font-size: 0.75rem; color: var(--text-dim);
  cursor: pointer; white-space: nowrap;
  transition: all 0.2s ease;
}
.recent-chip:hover {
  background: rgba(139,92,246,0.1);
  border-color: rgba(139,92,246,0.3);
  color: var(--text);
}
```

---

## 13. Implementation Priority Order

Ordered by impact-to-effort ratio:

| # | Feature | Effort | Impact |
|---|---------|--------|--------|
| 1 | Micro-interactions M1–M8 | Low | High — immediate feel upgrade |
| 2 | Card thumbnail gradients + shimmer | Low | High — visual differentiation |
| 3 | Multi-level filter system | Medium | High — core usability |
| 4 | Sort bar | Low | Medium |
| 5 | Favorites system | Medium | High — engagement |
| 6 | Starfield shooting stars + parallax | Low | Medium — delight |
| 7 | Password gate sacred geometry | Medium | High — first impression |
| 8 | Admin wizard | Medium | Medium — mobile UX |
| 9 | View Transitions | Low | Medium — polish |
| 10 | Recently viewed bar | Low | Medium |
| 11 | Voice search | Medium | Low-Medium (browser support varies) |
| 12 | Version timeline + backend badges | Low | Medium — depth |

---

## 14. Design Token Additions

Add these to `:root` alongside existing tokens:

```css
:root {
  /* Existing tokens … */

  /* New: gradient mesh base colors per category */
  --mesh-art:         #8b5cf6, #ec4899;
  --mesh-business:    #06b6d4, #8b5cf6;
  --mesh-fun:         #f59e0b, #ec4899;
  --mesh-spiritual:   #8b5cf6, #06b6d4, #f59e0b;
  --mesh-productivity:#06b6d4, #8b5cf6;

  /* New: spacing */
  --radius-card:      16px;
  --radius-btn:       10px;
  --radius-pill:      100px;

  /* New: animation speeds */
  --dur-fast:   0.15s;
  --dur-mid:    0.3s;
  --dur-slow:   0.6s;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 15. Accessibility Notes

- All new interactive elements need `aria-label` where icon-only
- Voice search button must announce state: `aria-pressed="true/false"`
- Filter chips need `role="group"` and `aria-label` on their container
- The sacred geometry SVG must have `aria-hidden="true"` (already specified above)
- Color alone never conveys state — the active filter buttons use both color and
  a checkmark icon or bold weight
- Respect `prefers-reduced-motion`: wrap all `@keyframes` decorative animations
  in a media query:

```css
@media (prefers-reduced-motion: reduce) {
  .gate-geometry, .geo-line, .gate-glow,
  .thumb-shimmer, .ripple, .voice-wave span,
  ::view-transition-old(root), ::view-transition-new(root) {
    animation: none !important;
    transition: none !important;
  }
}
```

---

*Spec version 1.0 — Sacred Chaos App Portal v2.0 — Funky Black Poppy*

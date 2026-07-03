# Black Poppy Canon

**Version 0.1.1 — The First Bloom**
Author: Rachael Nike

The living Canon of the Black Poppy Universe — a collection of principles, symbols, systems, and stories uncovered through creating.

Live: https://rachaelnike-queen.github.io/blackpoppycanon/

---

## What this is

A vanilla JavaScript Progressive Web App. Single-page application, native ES modules, component-first architecture. No frameworks, **no build step, no npm**. Every path is relative, so it runs from any folder, any subpath, any static host.

- **Responsive** — desktop sidebar collapses to a slide-over menu on mobile
- **Themed** — light by default, dark for the Canon at night; persisted, no flash on load
- **Accessible** — skip link, focus management, aria-current nav, visible focus rings, reduced-motion respected
- **Print-friendly** — pages print like a journal page
- **Offline** — service worker caches the app shell; installable as a PWA

## Structure

```
/
  index.html            App shell entry
  sw.js                 Service worker (offline cache)
  manifest.webmanifest  PWA manifest
  icon.svg              The Seal
  .nojekyll             Tells GitHub Pages not to run Jekyll
  /src
    main.js  app.js  router.js  state.js  theme.js
    /components   sidebar, header, card, icons
    /views        dashboard, library, atelier, search, settings, notfound
    /services     storage
    /styles       variables (design tokens), typography, layout, components, print
```

## Deploying to GitHub Pages

1. All of these files go at the **root of the repository** (index.html must be at the top level, not inside a folder).
2. Repo → Settings → Pages → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
3. Wait ~1 minute, then open https://rachaelnike-queen.github.io/blackpoppycanon/
4. On your phone: open the URL → browser menu → **Add to Home Screen**. The Canon installs like an app and works offline.

To update: change files, commit, push. Pages redeploys automatically.

## Design tokens

All color, type, spacing, and motion decisions live in `src/styles/variables.css`. Palette: black, deep purple, silver, dark rose, full moon white, hot pink, gray. Never gold. Fonts: Bebas Neue (display) + Libre Baskerville (body).

---

*Noli illegitimi carborundum · 11:11*

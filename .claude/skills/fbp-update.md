# FBP Resurrection OS Update Skill

Invoked as `/fbp-update`. Runs a structured audit-and-update cycle on the FBP Resurrection OS single-file app.

## What This Skill Does

1. Reads the current `fbp_resurrection_os_v*.html` file in `/home/user/Alien-Resurrection-FBP/`
2. Audits for common bugs and drift
3. Applies fixes and feature updates based on user priorities
4. Commits and pushes to the dev branch

## Standard Audit Checklist

Run through these on every update cycle:

- **SEASON_MODE** — is `const SEASON_MODE` set to the correct season (`'SS'` or `'FW'`)? Current live season drives pricing, trend keywords, and relist logic.
- **TRENDS object** — do the trend names and keywords match current reselling trends for the current season? Check Depop/Poshmark trending searches.
- **TREND26 map** — keys must use numbered world format (`'01 · Velvet Underground'`) not legacy names. Check trendKw() resolves correctly.
- **DEPOP_CONFIRMED** — verify this array is actually used in `buildHashtags()`, not dead code.
- **Hardcoded dates** — scan for any hardcoded date strings (e.g. "Week of June 2026"). Replace with dynamic `new Date().toLocaleDateString(...)`.
- **AI model** — should be `claude-haiku-4-5-20251001` (cheapest, good enough for comp checks). Do not upgrade to Sonnet unless user requests.
- **Theme toggle** — `toggleTheme()` must exist and be wired to `#themeToggle` button. Light is default, dark persists via `localStorage`.
- **Batch select** — `selectedItems` Set, `toggleSelect()`, `clearSelect()`, `selectAll()`, `batchCopyTitles()`, `batchCopyHashtags()` must all exist and be wired into `mkCard()` and `vAll()`.
- **Duplicate variable declarations** — check `vAll()` for duplicate `const items` / `const filtered` declarations.
- **Card div nesting** — checkbox must be outside the `onclick="openItem()"` wrapper. Closing div count must match.

## File Naming Convention

Output file: `fbp_resurrection_os_v{MAJOR}.{MINOR}.html`

Increment minor for bug fixes + trend updates. Increment major for significant feature additions.

## Dev Branch

Always commit and push to: `claude/sweet-davinci-q4ndvf`

```bash
git add fbp_resurrection_os_v*.html
git commit -m "feat: FBP OS vX.X — <short summary>"
git push -u origin claude/sweet-davinci-q4ndvf
```

## Season Pivot Guide

When switching seasons, update ALL of the following in one pass:

1. `const SEASON_MODE = 'FW'` → `'SS'` (or vice versa)
2. Replace `TRENDS` object with season-appropriate trend names and keywords
3. Update `TREND26` trend tags per world to match new season aesthetics
4. Update relist queue section header labels (SS→FW or FW→SS)
5. Update any pricing multiplier comments that reference season

## FW26 Trends Reference (current)

Dark Coquette, Ballet Punk, Gorpcore, Mob Wife FW, Quiet Luxury Dark, Gothic Academia, Whimsigoth FW, Vintage Denim FW, Moto & Leather FW, Dark Layering

## SS26 Trends Reference (next pivot)

Coastal Grandmother, Ballet Core SS, Sheer & Mesh, Boho Revival, Quiet Luxury Light, Prairie Romantic, Y2K Pastel, Linen & Lace, Garden Party, Mermaidcore

## App Architecture Notes

- Single HTML file, no build step, no bundler, no framework
- All state in memory + `localStorage`
- CSV parsing via custom Vendoo CSV parser
- AI Comp calls go through Netlify proxy at `/.netlify/functions/claude-proxy`
- 20 Style Worlds system with numbered keys (`01 · Velvet Underground` through `20 · ...`)
- Pricing: `category base × brand tier × era × trend × condition`

---
name: grimoire-audit
description: >
  Audit Black Poppy Grimoire HTML files for bugs, accessibility issues, and
  test-readiness. Generates a structured bug report and updates IMPLEMENTATION_GUIDE.md.
  Use when new versions of blackpoppygrimoirev*.html are uploaded.
---

# Grimoire Audit Skill

When invoked with `/grimoire-audit [filepath]`, audit the specified grimoire HTML file
(or the latest uploaded version if no path given) using parallel subagents and produce:

1. A structured bug report (CRITICAL / HIGH / MEDIUM / LOW)
2. Updated `IMPLEMENTATION_GUIDE.md` in the repo root
3. A test-readiness verdict

## Steps

### 1. Locate the file
If no filepath argument given, find the most recently uploaded grimoire HTML:
```bash
ls -t /root/.claude/uploads/**/*.html 2>/dev/null | head -1
```

### 2. Launch three parallel audit agents

Spawn these three agents simultaneously:

**Agent A — HTML & Accessibility Audit**
Prompt: Read the HTML body structure (skip CSS/JS sections). Audit for:
- Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`)
- ARIA labels on interactive elements
- Form `<label>` / `for=` associations
- Alt text on `<img>` elements
- Color contrast: `--accent` (#ff2d8e) on `--paper` (#f0e8d4) = ~2.8:1, fails WCAG AA
- `rel="noopener"` on external links
- View switching `aria-hidden` management
Report: structured list, CRITICAL/HIGH/MEDIUM/LOW, with line numbers.

**Agent B — JavaScript Logic Audit**
Prompt: Read the `<script>` block. Audit for:
- `innerHTML` with user data (XSS — check archive/journal render functions)
- `JSON.parse` without try/catch in `load()` function
- localStorage key mismatches (especially reroll counter keys)
- Missing back-navigation between views
- Duplicate event bindings on reroll buttons
- `window.dailySnapshot` race condition in `saveTodaySnapshot`
- `Math.random()` in stamped labels (re-randomizes on render)
Report: structured list, CRITICAL/HIGH/MEDIUM/LOW, with line numbers.

**Agent C — CSS & Responsive Audit**
Prompt: Read the `<style>` block. Audit for:
- Tablet overflow: `.composition` min-width ~808px but breakpoint at 1180px
- Mobile grid: `.basket-add-row` three-column layout at all widths
- Breakpoint gaps (720px–1180px)
- Undefined CSS custom properties (especially `--pink-loud`)
- Duplicate rules with conflicting values
- `backdrop-filter` performance on mobile
- `prefers-reduced-motion` missing
Report: structured list, CRITICAL/HIGH/MEDIUM/LOW, with line numbers.

### 3. Synthesize results

Combine all three reports into a single output with sections:

```
## CRITICAL (block testing)
## HIGH (fix before QA)
## MEDIUM (fix in sprint)
## LOW (polish/backlog)
## Test Readiness Verdict
```

**Verdict logic:**
- Any CRITICAL → `❌ NOT READY — X critical issues must be fixed first`
- No CRITICAL but HIGH > 3 → `⚠️ CONDITIONAL — address high-priority issues`
- No CRITICAL, HIGH ≤ 3 → `✅ READY FOR TESTING with known caveats`

### 4. Update IMPLEMENTATION_GUIDE.md

If `IMPLEMENTATION_GUIDE.md` exists in the repo root, update the "Audit Findings" section
with findings from this run. Preserve the Phase 1/2/3 fix plan. Add a dated audit log entry
at the top of the Findings section:

```md
### Audit Run: <date>
File: <filename>
Verdict: <verdict>
New issues: <count> | Resolved: <count>
```

### 5. Commit

After updating the guide, commit and push:
```bash
git add IMPLEMENTATION_GUIDE.md
git commit -m "chore: grimoire audit update <date>"
git push -u origin claude/practical-lovelace-7pmg2n
```

## Quick Reference — Known Design Constraints

These are intentional design choices, NOT bugs:
- Hot pink (#ff2d8e) on parchment is intentional ("sacred chaos palette — pink is the scream")
- Gold (`--gold: #8a7350`) is defined but forbidden by design spec — do not flag as unused
- Card rotations (0.15°–0.45°) are intentional organic feel
- `backdrop-filter: blur(1px)` is intentional atmosphere — flag as perf risk but not a bug
- Single-file HTML architecture is intentional — do not suggest splitting into modules
- Base64 embedded images are intentional for self-contained offline use

## Files

| File | Role |
|---|---|
| `blackpoppygrimoirev*.html` | The app (uploaded to `.claude/uploads/`) |
| `IMPLEMENTATION_GUIDE.md` | Design specs + bug tracker (this repo) |
| `.claude/skills/grimoire-audit.md` | This skill |

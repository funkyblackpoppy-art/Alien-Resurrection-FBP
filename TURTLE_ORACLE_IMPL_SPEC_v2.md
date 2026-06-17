# The Turtle Oracle — Implementation Spec v2.0
**App:** `turtle-oracle-reading-v1.x.html`  
**Owner:** Rachael Nike · Black Poppy Magik & Apothecary  
**Status:** Design approved · Ready to build  
**Date:** 2026-06-17  

---

## TLDR

Four changes. Two are free. All four make the reading better.

1. **Streaming** — text flows in live instead of a 45-second wall of silence
2. **Live transits** — real planetary positions injected before Claude writes, no more hallucinated sky
3. **Prompt caching** — cache the system prompt, cut cost ~20% per reading
4. **Voice Master Spec** — the voice lives in a versioned document, never drifts, never gets lost

---

## What This App Is

A single-file HTML tool Rachael opens on her own computer.  
She enters a client's animal (or human) birth data, clicks Generate, and Claude writes a full astrology reading in her exact voice.  
The reading is then copied and sent to the client.

**Current stack:**
- Vanilla JS, no build system
- Anthropic Claude API called directly from browser (key hardcoded, acceptable — local use only)
- RapidAPI astrologer endpoint for natal chart data + SVG chart wheel
- Nominatim/OpenStreetMap for geocoding
- Google Fonts (Cinzel, Cormorant Garamond)

**Not changing:** deployment model, visual design, reading types, the brand.

---

## Change 1 — Streaming (Speed)

### Problem
The user sees a spinner for 30–60 seconds, then the full reading appears at once. For a ~3,000 word reading at Opus speed, that wait is real and anxiety-producing. There is no feedback that anything is happening.

### Solution
Switch the Anthropic API call to streaming (`stream: true`). Use the EventSource/ReadableStream reader to pipe each text delta directly into the DOM as Claude writes it.

### Implementation
```js
// In generateReading(), replace the existing fetch block:

const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
  },
  body: JSON.stringify({
    model: document.getElementById('modelSelect').value,
    max_tokens: getMaxTokens(readingType),
    stream: true,                          // NEW
    system: [{ 
      type: 'text', 
      text: buildSystemPrompt(readingType),
      cache_control: { type: 'ephemeral' } // NEW — see Change 3
    }],
    messages: [{ role: 'user', content: prompt }]
  })
});

// Stream reader:
const reader = res.body.getReader();
const decoder = new TextDecoder();
let rawText = '';
const outputEl = document.getElementById('readingOutput');
outputEl.style.display = 'block';
outputEl.innerHTML = '<div class="reading-text streaming-active"></div>';
const streamEl = outputEl.querySelector('.reading-text');

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  for (const line of chunk.split('\n')) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') continue;
      try {
        const evt = JSON.parse(data);
        if (evt.type === 'content_block_delta' && evt.delta?.text) {
          rawText += evt.delta.text;
          streamEl.textContent = rawText; // live update, plain text during stream
        }
      } catch {}
    }
  }
}

// After stream completes, apply full formatting:
RAW_READING_TEXT = rawText;
outputEl.innerHTML = formatReading(rawText);
```

### CSS addition — streaming cursor
```css
.streaming-active::after {
  content: '▌';
  animation: blink .7s step-end infinite;
  color: var(--rose);
}
@keyframes blink { 50% { opacity: 0; } }
```

### Result
Reading starts appearing within ~2 seconds of clicking Generate. The cursor pulses as Claude writes. Full formatting applies when complete.

---

## Change 2 — Live Transits (Quality)

### Problem
The CURRENT TRANSITS section in the reading asks Claude to recall today's planetary positions from memory. Claude does not have access to live ephemeris data — it generates plausible-sounding positions that are frequently wrong. This is the most factually unreliable section of every reading.

### Solution
Before building the prompt, make one additional call to the RapidAPI astrologer `/api/v5/now` endpoint (already in use for connection testing). Extract the current planetary positions. Inject them into the prompt explicitly so Claude is reporting facts, not inventing them.

### Implementation

```js
// New function — call before buildReadingPrompt():
async function fetchCurrentPlanetPositions() {
  try {
    const r = await fetch('https://astrologer.p.rapidapi.com/api/v5/now', {
      headers: {
        'x-rapidapi-host': 'astrologer.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY
      }
    });
    if (!r.ok) return null;
    const d = await r.json();
    // d.data.planets is an array of { name, sign, degree, retrograde }
    return d.data?.planets || null;
  } catch { return null; }
}

// Format for injection:
function formatCurrentPlanets(planets) {
  if (!planets) return '';
  const lines = planets.map(p =>
    `${p.name}: ${p.degree.toFixed(1)}° ${p.sign}${p.retrograde ? ' ℞' : ''}`
  ).join('\n');
  return `\nTODAY'S ACTUAL PLANETARY POSITIONS (${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}):\n${lines}\n\nUse ONLY these positions for the CURRENT TRANSITS section. Do not infer or estimate — report these exact placements and how they aspect the natal chart.\n`;
}
```

In `generateReading()`, before building the prompt:
```js
const currentPlanets = await fetchCurrentPlanetPositions();
const currentPlanetsText = formatCurrentPlanets(currentPlanets);
// Pass to prompt builder — append to customerNotes or inject in buildReadingPrompt
```

In `buildReadingPrompt()`, inject `currentPlanetsText` near the CURRENT TRANSITS section instruction.

### Cost
One additional RapidAPI call per reading. The `/now` endpoint is lightweight (~0.1 API credit). No meaningful cost increase.

### Result
The CURRENT TRANSITS section becomes factually accurate. When Rachael or a client cross-references the reading against a free chart app, the sky described matches. Trust in the reading increases.

---

## Change 3 — Prompt Caching (Cost)

### Problem
The system prompt is approximately 3,000 tokens. It is almost entirely static — the same text is sent with every reading, incurring full input token cost every time.

On Opus 4.6:
- Input: $15/1M tokens
- 3,000 tokens × $15 = **$0.045 per reading just for the system prompt**
- Across 100 readings/month = $4.50/month wasted on identical text

### Solution
Use Anthropic's prompt caching feature. Mark the system prompt with `cache_control: { type: 'ephemeral' }`. On cache hit:
- Cache write: 125% of normal input cost (one-time)
- Cache read: 10% of normal input cost
- Break-even: 2 readings within 5 minutes

### Implementation
Change the `system` parameter from a string to an array:

```js
// Before (string):
system: buildSystemPrompt(readingType),

// After (array with cache control):
system: [{
  type: 'text',
  text: buildSystemPrompt(readingType),
  cache_control: { type: 'ephemeral' }
}],
```

The cache TTL is 5 minutes. If Rachael generates multiple readings in a session (common), nearly all of them will be cache hits.

### Savings estimate
- Typical session: 5–8 readings
- First reading: cache write (1.25x cost on system prompt)
- Readings 2–8: cache read (0.1x cost on system prompt)
- Net savings per session: ~$0.35–0.40
- Monthly (20 sessions): **~$7–8/month saved**

### Notes
- The reading-type-specific conditional blocks (memorial, family, etc.) change the system prompt slightly. Each unique system prompt variant will be cached separately. This is fine — there are only ~8 variants.
- The dynamic max_tokens helper (also needed for streaming) should be added at the same time:

```js
function getMaxTokens(readingType) {
  const map = {
    moon_phase: 6000,
    solar_return: 8000,
    lunar_return: 8000,
    transit_chart: 8000,
    memorial: 10000,
    single: 12000,
    bond: 12000,
    breeder: 12000,
    family: 16000,
  };
  return map[readingType] || 12000;
}
```

This alone saves 0–4,000 tokens per non-family reading.

---

## Change 4 — Voice Master Spec (Identity)

### Problem
The voice is defined inside a JavaScript string inside an HTML file. It can be:
- Accidentally overwritten when editing prompts
- Lost when the file is refactored
- Impossible to version independently from the code
- Not visible unless you open DevTools and search for it

There is also no way to know if the voice has drifted from the original standard without reading every reading produced and comparing.

### Solution
Extract the voice definition into a standalone document: `TURTLE_ORACLE_VOICE_MASTER.md`. This document:
- Is the canonical, versioned source of truth for Rachael's voice
- Lives in the repository alongside the app
- Is referenced by the system prompt (pasted in, or HTTP-fetched if hosted)
- Has a version number and last-confirmed date
- Can be restored instantly if the prompt drifts

The Voice Master document is separate from this spec — see `TURTLE_ORACLE_VOICE_MASTER.md`.

A companion Claude Code skill — `/turtle-voice` — allows Rachael to:
1. Review the current voice spec
2. Run a test reading to check if the voice matches the standard
3. Regenerate the voice anchors from a known-good reading
4. Flag drift in a generated reading

---

## UI Improvements (Minor)

### Loading state
Replace the static spinner with a section-by-section progress indicator. As Claude writes, detect section headers in the stream and display them as they appear, so the user can see which part of the reading is being written.

```js
// In the stream loop, detect headings:
if (evt.delta?.text?.includes('—') || /^\d+\./.test(evt.delta?.text)) {
  // could flash a "now writing: [section name]" indicator
}
```

### Mobile layout
The form cards stack correctly on mobile but the subject input grid overflows on narrow viewports. Add:
```css
@media (max-width: 600px) {
  .birth-grid { grid-template-columns: 1fr; }
  .cast-btn { font-size: 1rem; padding: .9rem 1.4rem; }
}
```

### Reading output — word count + cost estimate
After generation, show below the reading meta line:
```
~2,847 words · ~3,400 output tokens · estimated cost: $0.68
```
This helps Rachael understand what she's getting per reading.

---

## Build Order

| Step | Change | Effort | Impact |
|------|--------|--------|--------|
| 1 | `getMaxTokens()` helper | 15 min | Cost, Speed |
| 2 | Prompt caching | 10 min | Cost |
| 3 | Streaming | 1 hour | Speed, UX |
| 4 | Live transits fetch + inject | 45 min | Quality |
| 5 | Voice Master Spec doc | 30 min | Identity |
| 6 | `/turtle-voice` skill | 30 min | Identity |
| 7 | UI polish | 30 min | UX |

Total: ~4 hours of focused work to produce v2.0.

---

## What We Are NOT Changing

- The visual design and brand palette
- The reading types and their section structures  
- The system prompt voice (only extracting it, not editing it)
- The API provider choices
- The local-file deployment model
- The key storage approach (local use only, acceptable risk)

---

## Version

Spec: v2.0 · 2026-06-17  
App target: `turtle-oracle-reading-v2.0.html`

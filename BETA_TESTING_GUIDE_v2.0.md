# The Turtle Oracle v2.0 — Beta Testing Guide

**App:** turtle-oracle-reading-v2.0.html  
**Testing window:** [INSERT DATES]  
**Send feedback to:** [INSERT EMAIL / DM]

---

## Thank you for testing

You are helping make sure the new version of The Turtle Oracle works correctly before it goes into production. You do not need to be technical. You just need to run readings the way you normally would and tell us what you notice.

---

## Setup (do this once)

1. Download the file: `turtle-oracle-reading-v2.0.html`
2. Open it in **Chrome or Edge** — not Safari, not Firefox, not inside any other app
3. Open it directly as a file (File → Open, or drag it into the browser)
4. You will need API keys to use it — Rachael will send these to you separately. Paste them in using VS Code or any text editor before opening in the browser.

---

## What's new in v2.0

Three things changed. These are what you're testing.

### 1. The reading streams in live
Instead of waiting 30–60 seconds for the full reading to appear at once, you will now see the text flow onto the screen word by word as Claude writes it. A blinking cursor shows it's actively working.

**What good looks like:** Text starts appearing within a few seconds of clicking Generate. It flows continuously. When it finishes, the full formatted reading appears cleanly.

**What to flag:** Text stops mid-sentence and doesn't resume. Formatting looks broken after streaming ends. It goes blank partway through.

### 2. The current transits section uses real planetary positions
The app now looks up where the planets actually are today before writing the reading. This makes the "Current Transits" section factually accurate instead of estimated.

**What good looks like:** The current transits section names specific planets in specific signs with a sense of "this is what's happening right now." If you cross-reference with a free chart site (astro.com, astro-seek.com), the planetary positions should match.

**What to flag:** Current transits seem vague, generic, or clearly wrong (e.g., a planet in the wrong sign). Or the transit section feels identical to readings you've seen before regardless of today's date.

### 3. Slightly lower cost per reading
Readings generated close together in a session (within about 5 minutes) now cost a little less because the system reuses part of the setup. You won't see this directly — it just happens in the background.

---

## What to test

Run **at least 3 readings** during the beta. Try to vary what you're testing.

### Checklist

**Streaming**
- [ ] Text began appearing within ~5 seconds of clicking Generate
- [ ] The reading streamed continuously without freezing
- [ ] The final formatted reading looked correct after streaming ended
- [ ] The blinking cursor disappeared when the reading was complete

**Current Transits section**
- [ ] The transits section named specific planets in specific signs
- [ ] The sky described felt current and dated (not generic)
- [ ] Cross-referenced at least one reading against astro.com — positions matched

**Reading quality — Rachael's voice**
- [ ] The reading sounded like Rachael, not generic astrology writing
- [ ] At least one sentence made you stop and think "how did she know that"
- [ ] No bullet points anywhere in the reading
- [ ] No phrase "soul contract" or "the universe wants"
- [ ] The closing blessing felt specific to this soul, not copy-paste

**Basic functionality (unchanged from v1.4)**
- [ ] Chart wheels generated correctly
- [ ] Copy reading button worked
- [ ] Print / PDF worked
- [ ] Tried at least one reading type other than Single Soul

---

## How to report feedback

For each issue, tell us:

1. **What reading type** (Single Soul / Household / Memorial / etc.)
2. **What happened** — describe it simply, no tech jargon needed
3. **When it happened** — during streaming? After the reading appeared? On a specific section?
4. **A screenshot or copy-paste** if you can

If the voice sounds off — if a sentence feels borrowed, generic, or not like Rachael — quote the specific sentence. That's the most useful feedback we can get.

**Not a bug:** The app takes 3–5 seconds before text starts appearing. That's normal — it's fetching the planetary positions before writing. You'll see the form go quiet briefly, then the stream begins.

---

## Known limitations

- The app must be opened locally in Chrome or Edge — it will not work inside another app's preview window
- If you get a "rate limited" error, wait one minute and try again
- The API keys will expire eventually — if you get a key error, contact Rachael

---

## Version

Beta: v2.0 · [INSERT DATE]  
Questions: [INSERT CONTACT]

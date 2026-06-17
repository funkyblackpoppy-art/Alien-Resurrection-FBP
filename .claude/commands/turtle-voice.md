# /turtle-voice — Turtle Oracle Voice Guardian

Use this skill to check, verify, or restore Rachael Nike's reading voice for The Turtle Oracle.

## What this skill does

- **Review** the current Voice Master Spec
- **Audit** a reading against the voice standard
- **Flag** drift (generic language, missing planets, wrong tone)
- **Regenerate** the system prompt voice block from the Voice Master Spec
- **Compare** two readings to check consistency

## How to invoke

```
/turtle-voice                        # Show the voice spec summary and current status
/turtle-voice audit [paste reading]  # Check a reading for drift
/turtle-voice regenerate             # Rebuild the system prompt voice block from the spec
/turtle-voice diff [v1] [v2]         # Compare two readings for voice consistency
```

---

## Skill Instructions

When invoked, perform the following based on the arguments:

### No arguments — Status report

1. Read `/home/user/Alien-Resurrection-FBP/TURTLE_ORACLE_VOICE_MASTER.md`
2. Report:
   - Current voice spec version and last-confirmed date
   - The 6 gold standard sentences (list them)
   - The tone anchor paragraph
   - The 8 voice drift warning signs
3. Ask: "Would you like to audit a reading, regenerate the system prompt block, or review a specific section?"

### `audit [reading text]`

Analyze the provided reading text against these criteria from the Voice Master Spec:

**Pass criteria (all must pass):**
- [ ] At least one planet named per section
- [ ] No bullet points anywhere
- [ ] No phrase "soul contract"
- [ ] No phrase "the universe wants/says/knows"
- [ ] No section begins with "In astrology..." or "The [planet] represents..."
- [ ] Opening paragraph names the paradox before building to it
- [ ] Closing blessing does not summarize — it calls forward
- [ ] No section could apply to a generic animal of the same sign (test: would this fit any Scorpio cat?)
- [ ] Customer-shared behaviors are referenced and connected to chart placements

**Output format:**
```
VOICE AUDIT — [Reading subject if identifiable]
Pass: X/9 criteria

PASSED:
✓ [criterion]

FAILED / NEEDS ATTENTION:
✗ [criterion] — [specific sentence or section that triggered this]
  → Suggested fix: [one sentence on how to correct it]

OVERALL: [VOICE IS CLEAN / VOICE HAS DRIFTED — do not deliver]
```

### `regenerate`

1. Read `TURTLE_ORACLE_VOICE_MASTER.md`
2. Produce a new version of the `buildSystemPrompt()` voice block — just the WHO YOU ARE / HOW YOU WRITE sections — formatted as a JavaScript template literal string, ready to paste into the HTML app
3. Note which version of the Voice Master Spec it was generated from
4. Do NOT change the actual spec document — only produce the output for the app

### `diff [reading1] [reading2]`

Compare two readings for voice consistency. Report:
- Shared strengths (what both get right)
- Divergences (where the voice differs between them)
- Which reading is closer to the gold standard and why

---

## Gold Standard Reference (always available)

These six sentences are the origin of the oracle. They are the quality bar:

1. "He looks like a king who decided to be soft."
2. "He didn't just leave. He was released."
3. "When you lost Turtle, you didn't just lose Turtle. You lost the last witness to losing Misha."
4. "That's not weakness. That's the receipt."
5. "The stars didn't just allow this friendship. They built it."
6. "Some souls don't come to stay forever. They come to show you what forever feels like."

Every sentence written for a reading should reach for this quality:
- Short declarations that land like truth
- Paradox named without decoration
- Grief honored without flinching
- Love measured exactly

---

## Files

- Voice Master Spec: `TURTLE_ORACLE_VOICE_MASTER.md`
- Implementation Spec: `TURTLE_ORACLE_IMPL_SPEC_v2.md`
- App: `turtle-oracle-reading-v*.html`

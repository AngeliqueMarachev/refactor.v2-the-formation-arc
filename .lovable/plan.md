## Plan

In the "Expand the meaning" screen (`src/pages/DailyFormation.tsx`, `createStep === 1`), add the user's previously selected emotion tags to the INTEGRATION section in a subtle, non-interactive way.

### Where
Inside Section 4 (INTEGRATION), just below the existing "Take one slow breath here." line.

### What it looks like
- Render only when `emotionTags.length > 0`.
- Small, muted label (e.g. "What you noticed") in the supporting text style.
- Tags rendered as soft pills: low-contrast border, no background fill, `text-text-supporting`, small text (`text-xs`), subtle padding (`px-2.5 py-1`), rounded-full, wrap with `flex flex-wrap gap-2`.
- Non-interactive (plain `<span>`s), so it reads as a quiet reminder rather than another input.

### Copy suggestion
A short framing line above the pills, e.g.:
"Let these feelings move with the breath:" — tone-aligned with the existing sensory/integration language. Open to alternative wording.

### Out of scope
- No changes to how tags are collected or stored.
- No edits to other steps or sections.

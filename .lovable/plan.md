## Goal
Reduce Daily Formation create-anchor flow from 3 steps to 2. Move anchor phrase capture to the bottom of Step 2 ("Expand the meaning") rather than its own screen.

## Changes — `src/pages/DailyFormation.tsx`

1. **Reduce step count**: `totalSteps = 3` → `totalSteps = 2`. The flow becomes:
   - Step 1 (createStep 0): Anchor Recall (unchanged)
   - Step 2 (createStep 1): Expand the meaning + Anchor phrase

2. **Update validation (`canProceed`)** for createStep === 1 to also require `anchorPhrase.trim().length > 0` (merge old step 2 requirement into step 1).

3. **Update CTA button label**: replace `createStep === 2 ? "Save anchor" : "Continue"` with `createStep === 1 ? "Save anchor" : "Continue"`.

4. **Append a 5th pathway section** inside the Step 1 vertical pathway (after the INTEGRATION section, before the closing `<div className="h-8" />`):
   - Same circle/connector pattern as the others (last node, no trailing line).
   - Title: `ANCHOR` (same primary uppercase styling).
   - Subtext: "Create a phrase to update the old template that no longer serves you"
   - Label: "Anchor phrase"
   - Helper text below input (small, muted): "Capture this in a few words to anchor the memory"
   - `<Textarea>` bound to `anchorPhrase` with placeholder `"I thought I was forgotten, but I was not as alone."`, maxLength 500, sanitized via `sanitizeTextInput`.

5. **Delete the entire `{createStep === 2 && ...}` block** ("Anchor this moment" screen, lines ~509–550).

6. **Delete the unused `{createStep === 3 && ...}` block** ("Use your Anchor Phrase", lines ~552–654) since it is no longer reachable and was never part of the live flow.

## Data persistence
No changes needed. `handleSaveAnchor` already saves `anchor_phrase` to `anchor_entries.anchor_phrase`. Triggering save when the user advances past createStep 1 (now the final step) preserves identical persistence and surfacing in Anchor Library / recall flows.

## Out of scope
No routing changes (the screen was internal state, not a route). No DB schema changes.

## Goal

Replace the manual "Keep screen awake" toggle with automatic, Kindle-style wake-lock that activates whenever the user is inside the daily formation flow, and releases when they leave it.

## Scope: which screens stay awake

Auto-enable wake lock on these routes:

- `/daily-formation` — covers "Begin with stability", "Create new associations", step 1 "Return to a moment of safety", and step 2 "Expand meaning" (all rendered inside this page via internal screen state)
- `/reorientation-rehearsal` — "Repetition rewires your system"

All other routes (`/`, `/anchors`, `/knowledge`, `/activated`, `/auth`, `/onboarding`) get normal device sleep behavior.

This is more battery-friendly than keeping the whole authenticated app awake, and matches the actual "reading / practicing" surfaces. If later you want to extend it to more screens, it's a one-line addition.

## Behavior

- Enter a covered route → wake lock requested automatically
- Leave the route (navigate away, close tab, background app) → released automatically
- Return to the route after backgrounding → re-acquired on `visibilitychange` (already handled in the hook)
- No UI: the toggle is removed entirely

## Caveat to communicate

iOS Safari in a regular browser tab does not reliably hold a wake lock — Apple only honors it consistently when the app is launched from the Home Screen as an installed PWA. Low Power Mode also disables it silently. This is a platform limitation, not something we can code around without adding a hidden-video fallback (not in this plan; can be a follow-up if needed).

## Technical changes

1. **New component `AutoWakeLock`** (`src/components/AutoWakeLock.tsx`)
   - Uses `useWakeLockContext()`
   - On mount: calls `enable()`
   - On unmount: calls `disable()`
   - Renders nothing

2. **Mount it on the two pages**
   - `src/pages/DailyFormation.tsx` — add `<AutoWakeLock />` at the top of the returned tree
   - `src/pages/ReorientationRehearsal.tsx` — same

3. **Remove the toggle UI**
   - Delete `src/components/WakeLockToggle.tsx`
   - Remove any imports/usages of `WakeLockToggle` (search the codebase; likely in `DailyFormation.tsx` and/or `ReorientationRehearsal.tsx`)

4. **Keep `WakeLockProvider` and `useWakeLock`** as-is — the existing visibility-change reacquire logic is exactly what we want for backgrounding.

## Out of scope

- iOS Safari hidden-video fallback
- Persisting a user "disable auto wake" preference
- Status indicator showing whether the lock is actually held

Say the word and I'll switch to build mode to ship it.

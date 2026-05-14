## Problem

Wake Lock is acquired by the `useWakeLock` hook inside `DailyFormation.tsx`. The hook releases the wake lock sentinel on unmount. When the user clicks **"I gave this to God"**, the app navigates to `/reorientation-rehearsal`, which unmounts `DailyFormation` → wake lock is released. When the user comes back to `/daily-formation?screen=reframing-story` to find a memory, the page mounts fresh but never re-enables the wake lock automatically (the toggle defaults to `true` in state, but `enable()` is never called on mount).

Result: the screen sleeps mid-flow.

## Fix

Lift wake lock state out of `DailyFormation` so it survives route changes across the entire daily formation flow.

### 1. Create a flow-wide wake lock provider

New file `src/lib/wake-lock-context.tsx`:
- Wraps the existing `useWakeLock` hook in a React context.
- Exports `WakeLockProvider` and `useWakeLockContext()`.
- Mounted once at the app root so the sentinel persists across navigations.

### 2. Wire the provider into `App.tsx`

Add `<WakeLockProvider>` inside `<AuthProvider>` so every route shares the same wake lock instance.

### 3. Update `DailyFormation.tsx`

- Replace `useWakeLock()` with `useWakeLockContext()`.
- On mount of `DailyFormation`, if `wakeLockToggle` is on, call `enable()` (so re-entering the page from `/reorientation-rehearsal` resumes the wake lock).
- Keep the `WakeLockToggle` UI on the reorientation screen (default on).
- On the **Return to today** CTA in the `completion` screen, call `wakeLock.disable()` (already in place — keep).
- Remove the implicit "release on unmount" effect — handled by the provider now.

### 4. No changes needed in `ReorientationRehearsal.tsx`

Since the wake lock now lives at the app level, navigating to `/reorientation-rehearsal` and back will not release it.

## Result

Wake lock stays active across:
`/daily-formation` (reorientation) → `/reorientation-rehearsal` → `/daily-formation?screen=reframing-story` (find a memory) → save anchor → completion → **Return to today** (released).

If the user toggles the switch off, or clicks **Return to today**, the wake lock releases. Visibility-change reacquisition (already in `useWakeLock`) keeps it alive when the user briefly switches tabs.

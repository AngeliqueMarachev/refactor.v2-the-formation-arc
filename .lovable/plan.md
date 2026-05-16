## Goal
When a first-time user is mid-Reorientation on `/activated` and taps **Knowledge** in the bottom nav, the "unsaved reorientation" confirm dialog should send them to `/knowledge` (not `/`) when they choose **Come back later**.

## Current behavior
In `src/components/BottomNav.tsx`:
- Tapping any non-`/activated` tab while on `/activated` without an active reorientation opens the confirm dialog.
- `handleContinue` always navigates to `/`, discarding the originally intended destination.

## Change
Track the pending destination when the dialog opens, and navigate to it on confirm.

### `src/components/BottomNav.tsx`
1. Add state: `const [pendingPath, setPendingPath] = useState<string | null>(null);`
2. In `handleNavigate`, when opening the dialog, also store the target: `setPendingPath(path);` before `setConfirmOpen(true)`.
3. In `handleContinue`, navigate to `pendingPath ?? "/"`, then clear it:
   ```ts
   const target = pendingPath ?? "/";
   setPendingPath(null);
   setConfirmOpen(false);
   navigate(target, { replace: true });
   ```
4. Also clear `pendingPath` when the dialog is dismissed via `onOpenChange(false)` (Stay/overlay), so a later tap doesn't reuse a stale path.

### Routing safety
`/knowledge` is gated by `OrientationGate` (not `ReorientationGate`), so navigating there without an active reorientation works. No `App.tsx` changes needed. Home (`/`) and other locked routes continue to behave as today.

## Out of scope
- No styling, copy, modal, or auth changes.
- Locked Home-card behavior and the Home → `/activated` routing remain unchanged.

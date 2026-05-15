## Problem

Landing and email screens both use `flex min-h-screen ... justify-center` but with different inner content heights (`space-y-8` + 2 buttons + paragraph vs `space-y-6` + form + divider + Google button + Back). Because the whole column is vertically centered, swapping content changes total height, which pushes the logo upward on the email step.

## Fix

Make the two screens share one layout shell so the logo sits at the same Y on both.

### 1. Replace `justify-center` with a fixed top offset

In `src/pages/Auth.tsx`, for both the `landing` and email (default) returns:

- Change outer wrapper from
  `flex min-h-screen flex-col items-center justify-center px-5 pt-10 pb-12`
  to
  `flex min-h-screen flex-col items-center px-5 pb-12 pt-[12vh]`
  (same padding-top on both, no vertical centering, so logo Y is content-independent).

### 2. Unify the inner container

Both screens use:
- `w-full max-w-sm space-y-6` (landing currently uses `space-y-8` — change to `space-y-6` to match the email step rhythm)

### 3. Keep logo block identical

Already identical (`mt-[7px]`, `width: min(85vw, 420px)`). Leave untouched.

### 4. Keep heading block spacing identical

Both already use `space-y-1.5 text-center pt-2`. Leave untouched.

### 5. Auth form content appears beneath logo

With `justify-center` removed and `pt-[12vh]` applied to both, the logo anchors at the same screen Y; landing CTAs and email form simply stack below it without shifting the logo.

## Out of scope

- Code step (`step === "code"`): not part of the landing→email transition the user reported. Leave as-is unless the user asks.
- Typography, button styling, copy: unchanged.

## Files

- `src/pages/Auth.tsx` — outer wrapper className on landing return and email return; `space-y-8` → `space-y-6` on landing inner container.

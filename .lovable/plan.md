Plan to implement guarded navigation for users without a saved Reorientation:

1. Add an unsaved Reorientation reset path
- In the Create Reorientation screen (`/activated`), add a way to reset the in-progress local state back to the beginning:
  - screen: introduction / entry screen
  - phase index: 0
  - selections: empty
  - custom text: empty
  - custom toggles: false
  - reveal/script practice state reset
  - wake lock disabled if active
- This will ensure “Continue” discards partial progress without saving anything.

2. Update bottom navigation interception
- Modify the shared bottom nav component so that when `hasActiveReorientation` is false, any bottom navigation tap opens a confirmation modal instead of navigating immediately.
- This includes tapping Home, Formation, Reorient, Anchors, and any current/active tab.
- Completed users (`hasActiveReorientation === true`) will keep the existing normal navigation behavior.

3. Add the confirmation modal using the existing design system
- Use the app’s existing Alert/Dialog UI components and Button styles.
- Modal message:
  “Your reorientation isn’t saved yet. Leaving now will discard your progress. Do you want to continue?”
- Primary action: “Continue”
- Secondary action: “Stay”
- “Stay” closes the modal and keeps the user on the current screen.
- “Continue” resets in-progress Reorientation state and redirects to the start of `/activated`.

4. Add a safety guard for non-navigation entry points
- Keep route guards in `App.tsx` ensuring users without a saved Reorientation cannot access protected routes like Home, Daily Formation, Anchor Library, or Reorientation practice via direct URL, refresh, saved route restoration, or browser history.
- Adjust the redirect target to explicitly bring them to the start of the Create Reorientation flow, including the introduction screen.

5. Avoid changing the rest of the UI
- No visual redesign beyond the modal.
- No database schema changes are needed, because saved status is already determined from the active saved Reorientation template.

Technical notes
- Likely files to change:
  - `src/components/BottomNav.tsx`
  - `src/pages/Activated.tsx`
  - possibly `src/App.tsx` for route guard precision
- The current app already tracks completion using `hasActiveReorientation` from the auth/onboarding state, so this implementation will build on that rather than adding new persistence.
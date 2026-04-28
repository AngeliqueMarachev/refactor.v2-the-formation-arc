## Plan to restore the preview

The preview is empty because the React app is not mounting. The browser is successfully loading `index.html`, `src/main.tsx`, and `src/index.css`, but the request for `src/App.tsx` is aborting/404ing, so Vite never runs the app. The dark screen you see is only the inline fallback background from `index.html`.

## What I will change

1. **Force the app module to reload cleanly**
   - Make a small safe edit in `src/App.tsx` so Vite/HMR re-emits the module and clears the stale failed request state.
   - Keep the dark themed loading screen, but make it visible enough for visual editing if the app is genuinely loading.

2. **Add a development-visible mount fallback**
   - Add a tiny non-invasive fallback message inside `#root` in `index.html`, styled with the existing dark palette.
   - This gives visual feedback if React fails before mounting instead of leaving a completely blank screen.
   - React will replace it immediately when the app mounts normally.

3. **Make route/loading states less blank**
   - Ensure loading screens include a centered visible `Loading…` message and not just a dark background.
   - Preserve all current route guards and authentication behavior.

4. **Verify the preview path**
   - Reload `/` and confirm the browser no longer reports a failed `/src/App.tsx` request.
   - Confirm the app UI appears again, or at minimum shows the auth/onboarding/home route instead of an empty fallback background.

## Technical notes

- No database changes are needed.
- I will not edit the generated backend client files.
- The previous `index.html` background fallback is not the root cause; it only made the failure less white. The immediate failure is that the app module is not being served/loaded in the preview session.
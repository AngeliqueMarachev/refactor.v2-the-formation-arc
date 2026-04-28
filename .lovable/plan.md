The preview is white because the app’s global stylesheet is failing to load in the browser session. The console shows this failed request:

```text
GET /src/index.css 404 / ERR_ABORTED
```

Since `src/main.tsx` imports `./index.css`, that failed CSS module prevents the normal app styling from applying. The result is a mostly blank white page even though the Vite dev server itself is running.

Plan to fix:

1. Inspect the CSS import path and Vite handling
   - Confirm `src/main.tsx` imports the correct stylesheet.
   - Check whether the preview proxy is treating `/src/index.css` incorrectly.

2. Add a safe styling fallback
   - Ensure the document has the app’s dark background even if the CSS module is delayed or fails.
   - Use a minimal inline fallback in `index.html` or a safe app wrapper so the preview never appears white.

3. Preserve the existing design system
   - Keep the current Tailwind theme, fonts, dark background, and mobile-first layout unchanged.
   - Do not alter the recent Anchor Recall text edits.

4. Re-check the preview after changes
   - Confirm the app renders with the dark background instead of white.
   - Check console/network again for any remaining blocking errors.

Technical details:

- Likely file touched: `index.html` for a minimal non-invasive background fallback.
- Possible file touched: `src/App.tsx` only if a React-level wrapper is needed.
- No database or backend changes are needed.
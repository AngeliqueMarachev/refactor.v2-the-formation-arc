Plan:

1. Update the three selected completion lines in `src/pages/Activated.tsx` so they render as a bulleted list.

2. Preserve the existing vertical spacing:
   - Keep the parent spacing between the bullet group and the text above/below unchanged.
   - Keep the same spacing between the three items as much as possible.

3. Preserve the existing typography and color styling for the text, only adding the bullet presentation.

Technical details:
- Replace the current three `<p>` elements inside the existing `space-y-2.5` container with semantic list markup (`ul`/`li`) or equivalent Tailwind list classes.
- Keep classes like `text-text-body`, `text-base`, and `leading-relaxed` on the bullet text.
- Avoid changing surrounding layout, copy, buttons, or behavior.
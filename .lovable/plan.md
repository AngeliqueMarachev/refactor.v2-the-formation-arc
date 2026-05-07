## Why

The custom `auth-email-hook` magic-link template renders a "Sign in" button using `confirmationUrl` and never shows the `token`. So users receive a magic link (no code), and clicking it auto-signs them in via `/auth/callback` — bypassing the OTP screen entirely.

## Changes

**1. `supabase/functions/_shared/email-templates/magic-link.tsx`**
- Remove the `Button` and `confirmationUrl` prop.
- Add `token: string` prop.
- Render the 6-digit token in a centered, monospace, large display block (subtle `#F1F5F4` background, rounded, letter-spaced).
- Update copy: heading "Your sign-in code", body "Enter this code in The Formation Arc to continue. It expires shortly."
- Keep brand styling (Fraunces heading, Nunito body, `#0C4651`).

**2. `supabase/functions/auth-email-hook/index.ts`**
- `EMAIL_SUBJECTS.magiclink`: `'Your login link'` → `'Your sign-in code'`.
- `SAMPLE_DATA.magiclink`: replace `confirmationUrl` with `token: '123456'` for preview.
- `templateProps` already passes `token: payload.data.token` — no change.

**3. Deploy** the `auth-email-hook` edge function so the new template takes effect.

## Out of scope
- `Auth.tsx` (OTP entry UI is correct)
- `AuthCallback.tsx` (still needed for Google OAuth)
- Other auth templates, DB, RLS

# Switch from magic link to email OTP code

Lovable Cloud Auth supports email OTP natively via `supabase.auth.signInWithOtp` (sends the code) + `supabase.auth.verifyOtp` (verifies it). Google OAuth path is unchanged.

## 1. `src/pages/Auth.tsx` — two-step OTP flow

Two-step state machine: `step: "email" | "code"`.

### Email step (visuals unchanged from today)
- Title: `BEGIN YOUR FORMATION`, subtitle: `Enter your email to continue.`
- CTA: `Send code`
- Submit → `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })` (no `emailRedirectTo` so a code is sent, not a link)
- On success → advance to code step, store `sentTo`, start 30s resend cooldown

### Code step (matches existing dark visual system — NOT the white card in the screenshot, only the OTP slot pattern from it)
- Same dark page layout/logo as email step
- Title: `ENTER YOUR CODE` (same `text-foreground font-sans tracking-[0.12em] text-base font-medium` styling as `BEGIN YOUR FORMATION`)
- Subtitle: `We sent a 6-digit code to <sentTo>` using existing `text-text-supporting text-sm` style
- Custom 6-slot OTP component (see §3) centered
- Inline error message slot under OTP (soft muted tone, `text-muted-foreground` — never destructive red)
- Primary CTA: `Verify` (full-width existing `Button`, disabled until 6 digits entered or while loading)
- Secondary actions row below CTA, vertically stacked, plain text buttons styled like the existing "Use a different email" link:
  - `Resend code` — disabled during 30s cooldown, label becomes `Resend in Ns`; on click re-calls `signInWithOtp`, status: `Code resent. Check your inbox.`
  - `Use a different email` — clears `code`, `codeError`, `sentTo`, `email`, `emailTouched`, `emailError`, `statusMessage`, returns to email step
- Verify call: `supabase.auth.verifyOtp({ email: sentTo, token: code, type: "email" })`
  - Success → `navigate("/", { replace: true })` (existing `OrientationGate` routes new vs returning users)
  - Failure (generic) → `That code didn't work. Check it and try again, or request a new one.`
  - Failure where message contains `expired` OR `?expired=true` query param present on entry → `Your code has expired. Request a new one.`
- Auto-submit: `useEffect` on `code` triggers `handleVerify` once length === 6 and not already loading

### Misc
- Drop `emailRedirectTo` and `getAuthRedirectUrl` import from Auth.tsx (Google still uses `window.location.origin`)
- Resend cooldown via `useState` + `useEffect` interval, cleared on unmount and on `Use a different email`

## 2. `src/pages/AuthCallback.tsx`
No change. Email path no longer hits it; Google OAuth code-flow logic stays as-is.

## 3. New file: `src/components/OtpInput.tsx` — segmented 6-digit input

Single underlying string value, 6 visual square slots. Built on a hidden controlled `<input>` over 6 styled divs (or 6 controlled inputs with shared state — using 6 inputs is simpler for caret behavior).

### Implementation: 6 controlled `<input>` elements
- Props: `value: string`, `onChange: (v: string) => void`, `onComplete?: (v: string) => void`, `error?: boolean`, `autoFocus?: boolean`, `disabled?: boolean`
- Uses `useRef<HTMLInputElement[]>` of length 6
- Each input: `inputMode="numeric"`, `pattern="[0-9]*"`, `maxLength={1}`, `autoComplete="one-time-code"`, `aria-label={`Digit ${i+1}`}`
- onChange: strip non-digits, take last char, update aggregate value, focus next slot if filled; if all 6 filled call `onComplete`
- onKeyDown:
  - `Backspace` on empty slot → focus previous and clear it
  - `ArrowLeft` / `ArrowRight` → move focus
- onPaste on any slot: read clipboard, extract digits, take first 6, fill all slots, focus the slot after the last filled digit (or last slot), trigger `onComplete` if 6 digits
- `autoFocus` on first slot when prop true (mount)

### Styling (matches existing dark system, not the screenshot's white card)
- Container: `flex justify-center gap-2 sm:gap-3`
- Each slot: `h-12 w-12 rounded-md text-center text-lg font-medium text-foreground transition-all duration-200 focus:outline-none`
- Inline `style` mirroring existing `Input` component:
  - `border: 1px solid rgba(168, 192, 168, 0.35)`
  - `backgroundColor: rgba(12, 70, 81, 0.35)`
- Focus state: border `rgba(168, 192, 168, 0.6)` (matches Input.tsx focus)
- Filled but not focused: same default border (digit visible)
- Error state: border `rgba(168, 192, 168, 0.6)` + slightly elevated background `rgba(12, 70, 81, 0.55)` — never destructive red. Error message below in `text-sm text-muted-foreground text-center`
- Disabled: `opacity-50 pointer-events-none`
- `text-base` minimum so iOS doesn't zoom (per project memory)

## Out of scope
- No backend / email template changes (default Supabase magic-link email already includes the OTP token)
- No DB / RLS changes
- `src/components/ui/input-otp.tsx` (shadcn wrapper) is left untouched — using a purpose-built component to avoid the chained-border default look and stay on-brand

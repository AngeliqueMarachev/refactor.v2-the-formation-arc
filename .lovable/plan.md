## Goal
When a logged-out user opens the app, the auth screen should default to the "Create an account" view instead of "Sign in".

## Change
**File:** `src/pages/Auth.tsx` (line 36)

Change the initial state of `isSignUp` from `false` to `true`:

```ts
const [isSignUp, setIsSignUp] = useState(true);
```

## What this affects
- Heading shows "CREATE AN ACCOUNT" by default
- Toggle prompt reads "Already have an account? Sign in"
- Submit button reads "Create account"
- Password field is shown (forgot-password flow remains opt-in)
- The "Forgot password?" link stays hidden by default (only visible in sign-in mode), which matches expected behavior for a sign-up–first entry

## What stays the same
- Email confirmation flow (`?confirmed=true`) still forces sign-in mode via the existing effect
- Duplicate-account detection still switches the user to sign-in mode
- Google sign-in button, validation, and all styling are untouched

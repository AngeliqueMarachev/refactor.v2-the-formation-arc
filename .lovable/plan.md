I found the cause: the reset-password page was updated, but the toast in your screenshot is coming from the forgot-password flow on `Auth.tsx`, not `ResetPassword.tsx`.

Specifically, `Auth.tsx` still imports `useToast`, creates `const { toast } = useToast()`, and calls this after a successful reset-link request:

```ts
toast({ title: "Check your email", description: "We sent you a password reset link." });
```

That is why the bottom-right toast still appears.

Plan:

1. Remove forgot-password toast logic from `Auth.tsx`
   - Delete the `useToast` import.
   - Delete `const { toast } = useToast();`.
   - Remove the toast call inside the `isForgotPassword` submit branch.

2. Add calm inline success feedback for forgot password
   - Add a dedicated inline message state for the forgot-password screen.
   - On successful reset-link request, set: `We sent you a password reset link.`
   - On failure, use a calm inline message instead of a toast, matching the existing muted message style.

3. Place the message in the form flow
   - Render the forgot-password message below the email input and above the `Send Reset Link` button, or above the button if that best matches the current spacing.
   - Do not render it at the top of the screen.
   - Do not leave empty containers or layout gaps when there is no message.

4. Match the existing error-message visual language
   - Use the same muted inline treatment shown in screenshot 2: bordered, subtle, centered text where appropriate.
   - Avoid red/destructive styling.
   - Keep `Back to sign in` flowing naturally under the button.

5. Preserve existing sign-in/create-account behavior
   - Leave the existing sign-in inline error message behavior intact.
   - Keep the forgot-password screen free of toast notifications entirely.
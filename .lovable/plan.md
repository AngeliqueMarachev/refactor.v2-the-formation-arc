## Goal
Change the From address on outgoing auth emails (signup, password reset, magic link, etc.) from `noreply@theformationarc.com` to `hello@theformationarc.com`.

## Good news about Proton Mail
Your Proton Mail setup is unaffected and no DNS changes are required.

- Lovable sends mail through a delegated subdomain (`notify.theformationarc.com`) using its own SPF/DKIM there.
- The `From:` header just *displays* `@theformationarc.com` — Lovable does not need to receive mail at that address.
- Proton Mail owns the MX records on the root `theformationarc.com`, so replies to `hello@theformationarc.com` will land in your Proton inbox as long as that address exists in Proton (create it as an address/alias if you haven't already).

So the only requirement on your side: make sure `hello@theformationarc.com` exists in Proton Mail so users who reply get through.

## Code change
One line in `supabase/functions/auth-email-hook/index.ts`:

```
from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
```
becomes
```
from: `${SITE_NAME} <hello@${FROM_DOMAIN}>`,
```

Then redeploy the `auth-email-hook` edge function so the change takes effect.

## Steps
1. Update the `from` field in `supabase/functions/auth-email-hook/index.ts`.
2. Redeploy the `auth-email-hook` edge function.
3. (On your side, outside Lovable) Confirm `hello@theformationarc.com` exists in Proton so replies are received.

## Not included
- No DNS changes.
- No changes to transactional/app emails (none are scaffolded).
- No change to the display name "theformationarc" — let me know if you'd also like to update that.

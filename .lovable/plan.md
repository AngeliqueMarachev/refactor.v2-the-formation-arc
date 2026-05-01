## Goal

Configure Resend as the auth email provider so signup confirmation and password reset emails are reliably delivered for The Formation Arc.

## Important context

Lovable Cloud (Supabase) does **not** expose a UI for configuring custom SMTP from the agent side. There are two viable paths:

### Path A — Resend SMTP via Supabase Auth (recommended, simplest)

Supabase Auth has a built-in "Custom SMTP" setting that, once enabled, makes ALL auth emails (signup confirmation, password reset, magic links, email change) go through Resend's SMTP relay using your verified Resend domain. No edge function code, no template scaffolding, no queue infrastructure.

**What I'll do in code:** nothing — there is no code change required for this path. Auth emails continue to use Supabase's default templates but are delivered via Resend instead of the shared Lovable sender.

**What you need to do once (manual, ~5 min):**
1. In Resend: verify a sending domain (e.g. `theformationarc.com` or `mail.theformationarc.com`) by adding the SPF/DKIM/MX DNS records Resend gives you.
2. In Resend: create an SMTP credential (Settings → SMTP) — gives you host `smtp.resend.com`, port `465`, username `resend`, password = your API key.
3. In the Lovable Cloud → Users → Auth Settings → SMTP Settings panel, enter:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: your Resend API key
   - Sender email: e.g. `noreply@theformationarc.com` (must be on the verified domain)
   - Sender name: `The Formation Arc`
4. Save. Done — confirmation and reset emails now flow through Resend.

**Pros:** Zero code, zero ongoing maintenance, uses Supabase's standard auth templates, immediately fixes deliverability.
**Cons:** Emails use default Supabase template styling (plain, functional). Sender name shows as "The Formation Arc" but the visual design is generic.

### Path B — Resend via API + custom branded templates (more work)

Build an edge function that intercepts auth email events and sends through Resend's HTTP API using branded React Email templates matching The Formation Arc's dark theme (Fraunces, #082E36, etc.).

**What I'd do in code:**
- Connect the Resend connector (`standard_connectors--connect` with `resend`) so the API key is stored as a project secret.
- Create `supabase/functions/auth-email-hook/index.ts` that handles Supabase auth webhook events and calls Resend's `/emails` endpoint.
- Create branded React Email templates for: signup confirmation, password recovery, magic link, email change.
- Deploy the edge function.
- You then enable the auth hook in Supabase pointing to that function.

**Pros:** Fully branded emails matching app aesthetic; full control over copy, layout, logo.
**Cons:** More moving parts; no automatic retry/queue (sends inline during the auth webhook); you still need a verified Resend domain + SMTP/API setup; requires the `auth-email-hook` to be wired up correctly in Supabase.

## Recommendation

Start with **Path A**. It solves the actual problem (users not receiving emails) immediately with zero code risk, and you can layer Path B's branded templates on top later if/when you want the visual polish. The deliverability win comes from Resend's reputation + your verified domain, not from the template design.

## What I need from you

Tell me which path:
- **A** — I'll give you the exact values to paste into Cloud → Users → Auth Settings → SMTP Settings (no code changes from me).
- **B** — I'll connect the Resend connector, scaffold the edge function and branded templates, and deploy.

Either way, you'll need to verify a sending domain in Resend first (DNS records at your registrar) — that's the prerequisite both paths share.

## Goal
Remove the unused `check-account-exists` edge function. It is not referenced anywhere in the frontend (`src/`) and provides no active functionality.

## Steps
1. Delete the local folder `supabase/functions/check-account-exists/`.
2. Call the Supabase delete-edge-functions tool with `["check-account-exists"]` to remove the deployed function from Lovable Cloud.

## Result
- Cloud will show only two edge functions: `auth-email-hook` and `process-email-queue` (both required for branded auth emails).
- No frontend or backend behavior changes, since nothing currently calls `check-account-exists`.
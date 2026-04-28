CREATE OR REPLACE FUNCTION public.email_has_registered_account(email_input text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE lower(email) = lower(btrim(email_input))
      AND deleted_at IS NULL
  );
$$;

GRANT EXECUTE ON FUNCTION public.email_has_registered_account(text) TO anon, authenticated;
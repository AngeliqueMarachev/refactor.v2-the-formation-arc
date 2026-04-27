-- Ensure profile rows can be tied to authenticated accounts and removed with them
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Keep profile access scoped to the signed-in user only
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Automatically create a profile and usage stats row whenever a new account is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  resolved_display_name text;
BEGIN
  resolved_display_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data ->> 'display_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'name', '')
  );

  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, resolved_display_name)
  ON CONFLICT (id) DO UPDATE
  SET display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name);

  INSERT INTO public.usage_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing accounts that are missing them
INSERT INTO public.profiles (id, display_name)
SELECT
  u.id,
  COALESCE(
    NULLIF(u.raw_user_meta_data ->> 'display_name', ''),
    NULLIF(u.raw_user_meta_data ->> 'full_name', ''),
    NULLIF(u.raw_user_meta_data ->> 'name', '')
  )
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
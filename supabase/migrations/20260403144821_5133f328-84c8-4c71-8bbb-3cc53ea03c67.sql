
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.anchor_entries
  DROP CONSTRAINT IF EXISTS anchor_entries_user_id_fkey,
  ADD CONSTRAINT anchor_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.reorient_templates
  DROP CONSTRAINT IF EXISTS reorient_templates_user_id_fkey,
  ADD CONSTRAINT reorient_templates_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.usage_stats
  DROP CONSTRAINT IF EXISTS usage_stats_user_id_fkey,
  ADD CONSTRAINT usage_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

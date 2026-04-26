-- Ensure one usage_stats row per user
ALTER TABLE public.usage_stats
ADD CONSTRAINT usage_stats_user_id_key UNIQUE (user_id);

-- Make stat increments resilient when a usage_stats row is missing
CREATE OR REPLACE FUNCTION public.increment_stat(stat_name text, user_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF stat_name NOT IN ('reorient_return_count', 'anchors_created', 'anchor_recall_count') THEN
    RAISE EXCEPTION 'Invalid stat name: %', stat_name;
  END IF;

  INSERT INTO public.usage_stats (
    user_id,
    reorient_return_count,
    anchors_created,
    anchor_recall_count,
    last_active_at
  )
  VALUES (user_id_input, 0, 0, 0, NULL)
  ON CONFLICT (user_id) DO NOTHING;

  EXECUTE format(
    'UPDATE public.usage_stats SET %I = %I + 1, last_active_at = now() WHERE user_id = $1',
    stat_name, stat_name
  ) USING user_id_input;
END;
$$;
CREATE OR REPLACE FUNCTION public.increment_stat(stat_name text, user_id_input uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> user_id_input THEN
    RAISE EXCEPTION 'Not authorized to update this usage statistic';
  END IF;

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
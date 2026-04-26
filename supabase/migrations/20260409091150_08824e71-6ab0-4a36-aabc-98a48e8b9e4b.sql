
-- Add last_active_at column
ALTER TABLE public.usage_stats
ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Update increment_stat to also set last_active_at
CREATE OR REPLACE FUNCTION public.increment_stat(stat_name text, user_id_input uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF stat_name NOT IN ('reorient_return_count', 'anchors_created', 'anchor_recall_count') THEN
    RAISE EXCEPTION 'Invalid stat name: %', stat_name;
  END IF;

  EXECUTE format(
    'UPDATE public.usage_stats SET %I = %I + 1, last_active_at = now() WHERE user_id = $1',
    stat_name, stat_name
  ) USING user_id_input;
END;
$function$;

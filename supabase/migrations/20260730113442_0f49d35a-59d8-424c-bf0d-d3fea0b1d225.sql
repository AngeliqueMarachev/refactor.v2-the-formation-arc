ALTER TABLE public.reorient_templates ADD COLUMN IF NOT EXISTS line_7 text;

CREATE OR REPLACE FUNCTION public.validate_reorient_template_input()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  line_value text;
BEGIN
  NEW.line_1 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_1, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_2 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_2, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_3 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_3, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_4 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_4, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_5 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_5, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_6 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_6, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_7 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_7, ''), '[[:cntrl:]]', '', 'g')), 500), '');

  FOREACH line_value IN ARRAY ARRAY[NEW.line_1, NEW.line_2, NEW.line_3, NEW.line_4, NEW.line_5, NEW.line_6, NEW.line_7]
  LOOP
    IF line_value IS NOT NULL AND length(line_value) > 500 THEN
      RAISE EXCEPTION 'Reorientation lines must be 500 characters or fewer';
    END IF;
  END LOOP;

  RETURN NEW;
END;
$function$;
CREATE OR REPLACE FUNCTION public.validate_reorient_template_input()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  line_value text;
BEGIN
  NEW.line_1 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_1, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_2 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_2, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_3 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_3, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_4 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_4, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_5 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_5, ''), '[[:cntrl:]]', '', 'g')), 500), '');
  NEW.line_6 := NULLIF(left(trim(regexp_replace(coalesce(NEW.line_6, ''), '[[:cntrl:]]', '', 'g')), 500), '');

  FOREACH line_value IN ARRAY ARRAY[NEW.line_1, NEW.line_2, NEW.line_3, NEW.line_4, NEW.line_5, NEW.line_6]
  LOOP
    IF line_value IS NOT NULL AND length(line_value) > 500 THEN
      RAISE EXCEPTION 'Reorientation lines must be 500 characters or fewer';
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_reorient_template_input_trigger ON public.reorient_templates;
CREATE TRIGGER validate_reorient_template_input_trigger
BEFORE INSERT OR UPDATE ON public.reorient_templates
FOR EACH ROW
EXECUTE FUNCTION public.validate_reorient_template_input();

CREATE OR REPLACE FUNCTION public.validate_anchor_entry_input()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.anchor_title := NULLIF(left(trim(regexp_replace(coalesce(NEW.anchor_title, ''), '[[:cntrl:]]', '', 'g')), 60), '');
  NEW.scene_text := left(trim(regexp_replace(coalesce(NEW.scene_text, ''), '[[:cntrl:]]', '', 'g')), 5000);
  NEW.meaning_conclusion := NULLIF(left(trim(regexp_replace(coalesce(NEW.meaning_conclusion, ''), '[[:cntrl:]]', '', 'g')), 2000), '');
  NEW.widened_meaning := NULLIF(left(trim(regexp_replace(coalesce(NEW.widened_meaning, ''), '[[:cntrl:]]', '', 'g')), 2000), '');
  NEW.anchor_phrase := left(trim(regexp_replace(coalesce(NEW.anchor_phrase, ''), '[[:cntrl:]]', '', 'g')), 500);
  NEW.where_is_god := NULLIF(left(trim(regexp_replace(coalesce(NEW.where_is_god, ''), '[[:cntrl:]]', '', 'g')), 2000), '');

  IF NEW.scene_text = '' THEN
    RAISE EXCEPTION 'Scene text is required';
  END IF;

  IF NEW.anchor_phrase = '' THEN
    RAISE EXCEPTION 'Anchor phrase is required';
  END IF;

  IF NEW.communion_awareness IS NOT NULL AND (NEW.communion_awareness < 0 OR NEW.communion_awareness > 10) THEN
    RAISE EXCEPTION 'Communion awareness must be between 0 and 10';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_anchor_entry_input_trigger ON public.anchor_entries;
CREATE TRIGGER validate_anchor_entry_input_trigger
BEFORE INSERT OR UPDATE ON public.anchor_entries
FOR EACH ROW
EXECUTE FUNCTION public.validate_anchor_entry_input();
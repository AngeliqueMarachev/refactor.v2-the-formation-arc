ALTER TABLE public.reorient_templates
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

UPDATE public.reorient_templates
SET is_active = true
WHERE is_active IS DISTINCT FROM true;

CREATE UNIQUE INDEX IF NOT EXISTS reorient_templates_one_active_per_user
ON public.reorient_templates (user_id)
WHERE is_active = true;
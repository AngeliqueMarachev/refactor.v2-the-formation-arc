
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create reorient_templates table
CREATE TABLE public.reorient_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  line_1 TEXT,
  line_2 TEXT,
  line_3 TEXT,
  line_4 TEXT,
  line_5 TEXT,
  line_6 TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reorient_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own templates" ON public.reorient_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own templates" ON public.reorient_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own templates" ON public.reorient_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own templates" ON public.reorient_templates FOR DELETE USING (auth.uid() = user_id);

-- Create anchor_entries table
CREATE TABLE public.anchor_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scene_text TEXT NOT NULL,
  emotion_tags JSONB DEFAULT '[]'::jsonb,
  meaning_conclusion TEXT,
  widened_meaning TEXT,
  anchor_phrase TEXT NOT NULL,
  communion_awareness INTEGER,
  where_is_god TEXT,
  session_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.anchor_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own anchors" ON public.anchor_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own anchors" ON public.anchor_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own anchors" ON public.anchor_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own anchors" ON public.anchor_entries FOR DELETE USING (auth.uid() = user_id);

-- Create usage_stats table
CREATE TABLE public.usage_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  reorient_return_count INTEGER NOT NULL DEFAULT 0,
  anchors_created INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats" ON public.usage_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON public.usage_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stats" ON public.usage_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-create profile and usage_stats on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  INSERT INTO public.usage_stats (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

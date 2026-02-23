CREATE TABLE drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  raw_input TEXT NOT NULL,
  model_a_name TEXT NOT NULL,
  model_a_text TEXT,
  model_b_name TEXT NOT NULL,
  model_b_text TEXT,
  model_c_name TEXT NOT NULL,
  model_c_text TEXT,
  selected_model TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own drafts"
  ON drafts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own drafts"
  ON drafts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own drafts"
  ON drafts FOR UPDATE USING (auth.uid() = user_id);

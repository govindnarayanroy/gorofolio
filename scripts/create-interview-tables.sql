-- Interview Database Setup for GoRoFolio
-- Copy and paste this entire script into your Supabase SQL Editor and run it

-- 1. Create interview_sessions table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  job_description TEXT,
  custom_job_position TEXT,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  overall_score INTEGER,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create interview_questions table
CREATE TABLE IF NOT EXISTS interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  category TEXT,
  difficulty_level TEXT DEFAULT 'medium',
  generated_by TEXT DEFAULT 'llm',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create interview_answers table
CREATE TABLE IF NOT EXISTS interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  transcript TEXT NOT NULL,
  score INTEGER,
  feedback JSONB,
  audio_duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_answers ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for interview_sessions
CREATE POLICY "Users can manage their own interview sessions"
  ON interview_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Create RLS Policies for interview_questions
CREATE POLICY "Users can manage questions from their sessions"
  ON interview_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_questions.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_questions.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- 7. Create RLS Policies for interview_answers
CREATE POLICY "Users can manage answers from their sessions"
  ON interview_answers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_answers.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_answers.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created_at ON interview_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_questions_session_id ON interview_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_session_id ON interview_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_question_id ON interview_answers(question_id);

-- 9. Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create triggers for automatic timestamp updates
CREATE TRIGGER update_interview_sessions_updated_at
    BEFORE UPDATE ON interview_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_answers_updated_at
    BEFORE UPDATE ON interview_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Setup complete! 🎉 
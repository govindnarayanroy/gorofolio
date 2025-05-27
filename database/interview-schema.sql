-- Interview Sessions Database Schema
-- Run this in your Supabase SQL Editor

-- Create interview_sessions table
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

-- Create interview_questions table
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

-- Create interview_answers table
CREATE TABLE IF NOT EXISTS interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  transcript TEXT NOT NULL,
  score INTEGER,
  feedback JSONB, -- Store tips and detailed feedback
  audio_duration INTEGER, -- Duration in seconds
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_answers ENABLE ROW LEVEL SECURITY;

-- Policies for interview_sessions
DROP POLICY IF EXISTS "Users can read their own interview sessions" ON interview_sessions;
DROP POLICY IF EXISTS "Users can insert their own interview sessions" ON interview_sessions;
DROP POLICY IF EXISTS "Users can update their own interview sessions" ON interview_sessions;
DROP POLICY IF EXISTS "Users can delete their own interview sessions" ON interview_sessions;

CREATE POLICY "Users can read their own interview sessions"
  ON interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interview sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview sessions"
  ON interview_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview sessions"
  ON interview_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for interview_questions
DROP POLICY IF EXISTS "Users can read questions from their sessions" ON interview_questions;
DROP POLICY IF EXISTS "Users can insert questions to their sessions" ON interview_questions;
DROP POLICY IF EXISTS "Users can update questions in their sessions" ON interview_questions;

CREATE POLICY "Users can read questions from their sessions"
  ON interview_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_questions.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert questions to their sessions"
  ON interview_questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_questions.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions in their sessions"
  ON interview_questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_questions.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- Policies for interview_answers
DROP POLICY IF EXISTS "Users can read answers from their sessions" ON interview_answers;
DROP POLICY IF EXISTS "Users can insert answers to their sessions" ON interview_answers;
DROP POLICY IF EXISTS "Users can update answers in their sessions" ON interview_answers;

CREATE POLICY "Users can read answers from their sessions"
  ON interview_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_answers.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert answers to their sessions"
  ON interview_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_answers.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update answers in their sessions"
  ON interview_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM interview_sessions 
      WHERE interview_sessions.id = interview_answers.session_id 
      AND interview_sessions.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_created_at ON interview_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_questions_session_id ON interview_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_session_id ON interview_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_interview_answers_question_id ON interview_answers(question_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_interview_sessions_updated_at ON interview_sessions;
CREATE TRIGGER update_interview_sessions_updated_at
    BEFORE UPDATE ON interview_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_interview_answers_updated_at ON interview_answers;
CREATE TRIGGER update_interview_answers_updated_at
    BEFORE UPDATE ON interview_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 
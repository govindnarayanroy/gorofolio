-- Fix interview_answers table to make question_id nullable
-- Run this in your Supabase SQL Editor

ALTER TABLE interview_answers 
ALTER COLUMN question_id DROP NOT NULL;

-- Verify the change
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'interview_answers' 
AND column_name = 'question_id'; 
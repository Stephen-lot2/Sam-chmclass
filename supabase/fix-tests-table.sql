-- ============================================
-- FIX TESTS TABLE - Add Missing Columns
-- Run this in Supabase SQL Editor
-- ============================================

-- First, check if tests table exists
DO $$ 
BEGIN
  -- Add description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tests' AND column_name = 'description'
  ) THEN
    ALTER TABLE tests ADD COLUMN description TEXT;
  END IF;

  -- Add total_questions column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tests' AND column_name = 'total_questions'
  ) THEN
    ALTER TABLE tests ADD COLUMN total_questions INTEGER DEFAULT 0;
  END IF;

  -- Add questions column (JSONB) if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tests' AND column_name = 'questions'
  ) THEN
    ALTER TABLE tests ADD COLUMN questions JSONB;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tests' AND column_name = 'status'
  ) THEN
    ALTER TABLE tests ADD COLUMN status TEXT DEFAULT 'active';
  END IF;

  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tests' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE tests ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Update existing tests table structure to match our needs
ALTER TABLE tests 
  ALTER COLUMN description SET DEFAULT NULL,
  ALTER COLUMN total_questions SET DEFAULT 0,
  ALTER COLUMN status SET DEFAULT 'active';

-- Create index on teacher_id for faster queries
CREATE INDEX IF NOT EXISTS idx_tests_teacher_id ON tests(teacher_id);

-- Create index on course_id for faster queries
CREATE INDEX IF NOT EXISTS idx_tests_course_id ON tests(course_id);

-- Create index on due_date for faster queries
CREATE INDEX IF NOT EXISTS idx_tests_due_date ON tests(due_date);

-- Verify the structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tests'
ORDER BY ordinal_position;

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE 'Tests table structure updated successfully!';
  RAISE NOTICE 'Columns added: description, total_questions, questions (JSONB), status, created_at';
END $$;

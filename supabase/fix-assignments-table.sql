-- ============================================
-- FIX ASSIGNMENTS TABLE - Add Missing Columns
-- Run this in Supabase SQL Editor
-- ============================================

-- First, check if assignments table exists
DO $$ 
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assignments' AND column_name = 'status'
  ) THEN
    ALTER TABLE assignments ADD COLUMN status TEXT DEFAULT 'active';
  END IF;

  -- Add created_at column if it doesn't exist (should already exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assignments' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE assignments ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Update existing assignments table structure
ALTER TABLE assignments 
  ALTER COLUMN status SET DEFAULT 'active';

-- Create index on teacher_id for faster queries
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON assignments(teacher_id);

-- Create index on course_id for faster queries
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);

-- Create index on due_date for faster queries
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);

-- Verify the structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'assignments'
ORDER BY ordinal_position;

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE 'Assignments table structure updated successfully!';
  RAISE NOTICE 'Columns verified: status, created_at';
END $$;

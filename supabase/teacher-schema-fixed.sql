-- Update profiles table to add teacher-specific fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS qualifications TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_students INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_courses INTEGER DEFAULT 0;

-- Update courses table to add teacher fields
ALTER TABLE courses ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Update live_classes table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'live_classes') THEN
    ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id);
    ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Update tests table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
    ALTER TABLE tests ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Create teacher_students table (for tracking teacher-student relationships)
CREATE TABLE IF NOT EXISTS teacher_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  UNIQUE(teacher_id, student_id)
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  max_score INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignment_submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  score INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  graded_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late')),
  UNIQUE(assignment_id, student_id)
);

-- Create course_materials table
CREATE TABLE IF NOT EXISTS course_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE teacher_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Teachers can manage their courses" ON courses;
DROP POLICY IF EXISTS "Teachers can manage their live classes" ON live_classes;
DROP POLICY IF EXISTS "Teachers can manage their tests" ON tests;
DROP POLICY IF EXISTS "Students can view published courses" ON courses;

-- Teachers can manage their own content
CREATE POLICY "Teachers can manage their courses" ON courses
  FOR ALL USING (teacher_id = auth.uid() OR instructor_id = auth.uid());

CREATE POLICY "Students can view published courses" ON courses
  FOR SELECT USING (is_published = true);

-- Policies for live_classes (only if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'live_classes') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Teachers can manage their live classes" ON live_classes';
    EXECUTE 'DROP POLICY IF EXISTS "Students can view live classes" ON live_classes';
    
    EXECUTE 'CREATE POLICY "Teachers can manage their live classes" ON live_classes
      FOR ALL USING (teacher_id = auth.uid())';
    
    EXECUTE 'CREATE POLICY "Students can view live classes" ON live_classes
      FOR SELECT USING (is_public = true OR teacher_id = auth.uid())';
  END IF;
END $$;

-- Policies for tests (only if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tests') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Teachers can manage their tests" ON tests';
    EXECUTE 'DROP POLICY IF EXISTS "Students can view their tests" ON tests';
    
    EXECUTE 'CREATE POLICY "Teachers can manage their tests" ON tests
      FOR ALL USING (teacher_id = auth.uid())';
    
    EXECUTE 'CREATE POLICY "Students can view their tests" ON tests
      FOR SELECT USING (
        course_id IN (
          SELECT course_id FROM enrollments WHERE user_id = auth.uid()
        )
      )';
  END IF;
END $$;

-- Policies for new tables
CREATE POLICY "Teachers can manage announcements" ON announcements
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view announcements" ON announcements
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage assignments" ON assignments
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view assignments" ON assignments
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view all submissions" ON assignment_submissions
  FOR SELECT USING (
    assignment_id IN (
      SELECT id FROM assignments WHERE teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can grade submissions" ON assignment_submissions
  FOR UPDATE USING (
    assignment_id IN (
      SELECT id FROM assignments WHERE teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit assignments" ON assignment_submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can view their submissions" ON assignment_submissions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can manage materials" ON course_materials
  FOR ALL USING (
    course_id IN (
      SELECT id FROM courses WHERE teacher_id = auth.uid() OR instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view materials" ON course_materials
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_announcements_teacher ON announcements(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_teacher_students ON teacher_students(teacher_id, student_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_course ON course_materials(course_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assignments_updated_at ON assignments;
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

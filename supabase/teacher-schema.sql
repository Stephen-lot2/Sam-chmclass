-- Add role to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS qualifications TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_students INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_courses INTEGER DEFAULT 0;

-- Add teacher_id to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Add teacher_id to live_classes table
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id);

-- Add teacher_id to tests table
ALTER TABLE tests ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES auth.users(id);

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

-- Add RLS policies for teachers
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own content
CREATE POLICY "Teachers can manage their courses" ON courses
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage their live classes" ON live_classes
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage their tests" ON tests
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage announcements" ON announcements
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can manage assignments" ON assignments
  FOR ALL USING (teacher_id = auth.uid());

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

-- Students can view published content
CREATE POLICY "Students can view published courses" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Students can view their enrolled classes" ON live_classes
  FOR SELECT USING (
    id IN (
      SELECT live_class_id FROM class_registrations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their tests" ON tests
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can submit assignments" ON assignment_submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can view their submissions" ON assignment_submissions
  FOR SELECT USING (student_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_teacher ON live_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_tests_teacher ON tests(teacher_id);
CREATE INDEX IF NOT EXISTS idx_announcements_teacher ON announcements(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_teacher_students ON teacher_students(teacher_id, student_id);

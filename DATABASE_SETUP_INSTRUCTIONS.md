# 🗄️ Database Setup Instructions

## Quick Setup (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to: https://vdurubjfcydizfehvxoh.supabase.co
2. Log in to your Supabase account
3. Click on your project

### Step 2: Run the Complete Setup Script
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button
3. Copy the ENTIRE contents of `supabase/complete-setup.sql`
4. Paste it into the SQL editor
5. Click **"Run"** button (or press Ctrl+Enter)

### Step 3: Verify Setup
After running the script, you should see:
- ✅ Success message
- ✅ No errors in the output

### Step 4: Test the Application
1. Refresh your application
2. The 500 error should be gone
3. All features should work with the database

## What This Script Does

### Creates 14 Tables:
1. **profiles** - User profiles (students & teachers)
2. **courses** - Course information
3. **enrollments** - Student course enrollments
4. **lessons** - Course lessons/modules
5. **live_classes** - Live class sessions
6. **tests** - Exams and quizzes
7. **assignments** - Course assignments
8. **assignment_submissions** - Student submissions
9. **announcements** - Teacher announcements
10. **messages** - Direct messaging
11. **teacher_students** - Teacher-student relationships
12. **notifications** - User notifications
13. **student_activity** - Activity tracking
14. **lesson_progress** - Lesson completion tracking

### Sets Up Security:
- ✅ Row Level Security (RLS) policies
- ✅ User authentication policies
- ✅ Teacher/Student access control
- ✅ Data privacy protection

### Creates Storage:
- ✅ Avatar image storage bucket
- ✅ Upload/download policies

### Adds Automation:
- ✅ Auto-create profile on signup
- ✅ Auto-update timestamps
- ✅ Trigger functions

## Troubleshooting

### If you see "relation already exists" errors:
This is NORMAL! It means some tables already exist. The script uses `IF NOT EXISTS` to safely skip existing tables.

### If you see permission errors:
1. Make sure you're logged in as the project owner
2. Check that you're in the correct project
3. Try running the script again

### If tables are created but app still shows 500 error:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh the page (Ctrl+F5)
3. Check browser console for specific error
4. Open `test-database.html` to diagnose

### If you want to start fresh:
```sql
-- WARNING: This deletes ALL data!
-- Only run if you want to completely reset

DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS student_activity CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS teacher_students CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS tests CASCADE;
DROP TABLE IF EXISTS live_classes CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Then run complete-setup.sql again
```

## Verification

### Check Tables Exist:
```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

You should see all 14 tables listed.

### Check Policies:
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

You should see multiple policies for each table.

### Test Data Access:
```sql
-- This should work without errors
SELECT COUNT(*) FROM courses;
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM live_classes;
```

## Next Steps After Setup

1. **Create a test user:**
   - Go to Authentication > Users
   - Click "Add User"
   - Create a student and a teacher account

2. **Test the application:**
   - Login as student
   - Login as teacher
   - Verify all features work

3. **Add sample data (optional):**
   - Run `supabase/seed.sql` for demo data
   - Or create courses manually through the UI

## Support

If you encounter any issues:
1. Open `test-database.html` in browser
2. Click "Run All Tests"
3. Share the error messages
4. Check browser console (F12)

## Security Notes

- ✅ RLS is enabled on all tables
- ✅ Users can only access their own data
- ✅ Teachers can only manage their own courses
- ✅ Students can only view published content
- ✅ Messages are private between sender/recipient

Your database is now production-ready! 🎉

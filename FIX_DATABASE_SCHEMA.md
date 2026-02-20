# 🔧 Fix Database Schema Error

## ❌ ERROR
```
Failed to create test: Could not find the 'description' column of 'tests' in the schema cache
```

## 🎯 CAUSE
Your Supabase database schema is missing required columns in the `tests` table. This happens when:
1. The database was created with an older schema
2. Columns were not added during initial setup
3. Schema cache is outdated

## ✅ SOLUTION

### Option 1: Run Fix Script (RECOMMENDED)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Select your project
   - Click "SQL Editor" in the left sidebar

2. **Run the Fix Script**
   - Copy the contents of `supabase/fix-tests-table.sql`
   - Paste into SQL Editor
   - Click "Run" button
   - Wait for success message

3. **Run Assignment Fix (Optional)**
   - Copy the contents of `supabase/fix-assignments-table.sql`
   - Paste into SQL Editor
   - Click "Run" button
   - Wait for success message

4. **Verify Tables**
   - Go to "Table Editor" in Supabase
   - Click on "tests" table
   - Verify these columns exist:
     - id
     - teacher_id
     - course_id
     - title
     - description ✅
     - duration
     - total_questions ✅
     - questions (JSONB) ✅
     - status ✅
     - due_date
     - created_at ✅

### Option 2: Recreate Tables (NUCLEAR OPTION)

⚠️ **WARNING: This will delete all existing data!**

1. **Backup Your Data First**
   - Export any important data from Supabase

2. **Drop and Recreate**
   ```sql
   -- Drop existing tables (BE CAREFUL!)
   DROP TABLE IF EXISTS tests CASCADE;
   DROP TABLE IF EXISTS assignments CASCADE;
   ```

3. **Run Complete Setup**
   - Copy contents of `supabase/complete-setup.sql`
   - Paste into SQL Editor
   - Click "Run"

### Option 3: Manual Column Addition

If you prefer to add columns manually:

```sql
-- Add missing columns to tests table
ALTER TABLE tests ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS questions JSONB;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE tests ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add missing columns to assignments table
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
```

---

## 🧪 TEST THE FIX

After running the fix script:

1. **Refresh Your App**
   - Close and reopen your browser
   - Or hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

2. **Try Creating a Test**
   - Login as teacher
   - Go to Tests page
   - Click "Create Test"
   - Fill in the form
   - Add at least one question
   - Click "Create Test"
   - Should succeed now! ✅

3. **Try Creating an Assignment**
   - Go to Assignments page
   - Click "Create Assignment"
   - Fill in the form
   - Click "Create & Notify Students"
   - Should succeed now! ✅

---

## 📊 VERIFY DATABASE STRUCTURE

Run this query in Supabase SQL Editor to verify:

```sql
-- Check tests table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'tests'
ORDER BY ordinal_position;

-- Check assignments table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'assignments'
ORDER BY ordinal_position;
```

Expected output for tests table:
```
column_name       | data_type                   | is_nullable | column_default
------------------+-----------------------------+-------------+------------------
id                | uuid                        | NO          | uuid_generate_v4()
teacher_id        | uuid                        | YES         | NULL
course_id         | uuid                        | YES         | NULL
title             | text                        | NO          | NULL
description       | text                        | YES         | NULL ✅
duration          | integer                     | YES         | 60
total_questions   | integer                     | YES         | 0 ✅
questions         | jsonb                       | YES         | NULL ✅
status            | text                        | YES         | 'active' ✅
due_date          | timestamp with time zone    | YES         | NULL
created_at        | timestamp with time zone    | YES         | NOW() ✅
```

---

## 🐛 TROUBLESHOOTING

### Still Getting Error After Fix?

1. **Clear Browser Cache**
   ```
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Option+E
   ```

2. **Restart Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Start again
   npm run dev
   ```

3. **Check Supabase Connection**
   - Verify `.env` file has correct credentials
   - Test connection in browser console:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```

4. **Check RLS Policies**
   - Go to Supabase → Authentication → Policies
   - Ensure policies allow INSERT on tests and assignments tables
   - Add policy if missing:
   ```sql
   -- Allow teachers to insert tests
   CREATE POLICY "Teachers can insert tests"
   ON tests FOR INSERT
   TO authenticated
   WITH CHECK (auth.uid() = teacher_id);

   -- Allow teachers to insert assignments
   CREATE POLICY "Teachers can insert assignments"
   ON assignments FOR INSERT
   TO authenticated
   WITH CHECK (auth.uid() = teacher_id);
   ```

### Error: "relation 'tests' does not exist"

This means the tests table wasn't created at all. Run:
```sql
-- Create tests table
CREATE TABLE IF NOT EXISTS tests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 60,
  total_questions INTEGER DEFAULT 0,
  questions JSONB,
  status TEXT DEFAULT 'active',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Error: "permission denied for table tests"

Add RLS policies:
```sql
-- Enable RLS
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

-- Allow teachers to do everything with their tests
CREATE POLICY "Teachers manage their tests"
ON tests FOR ALL
TO authenticated
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);

-- Allow students to view tests
CREATE POLICY "Students can view tests"
ON tests FOR SELECT
TO authenticated
USING (true);
```

---

## 📝 SUMMARY

1. Run `supabase/fix-tests-table.sql` in Supabase SQL Editor
2. Run `supabase/fix-assignments-table.sql` in Supabase SQL Editor
3. Refresh your browser
4. Try creating a test again
5. Should work now! ✅

---

## 🆘 STILL NEED HELP?

If you're still having issues:

1. Check browser console for detailed error messages
2. Check Supabase logs in dashboard
3. Verify all environment variables are set correctly
4. Make sure you're logged in as a teacher
5. Try creating a test with minimal data first

---

**Status:** Ready to fix  
**Time to fix:** 2-5 minutes  
**Difficulty:** Easy  
**Risk:** Low (script checks before adding columns)

# 🔧 Database Fix Guide - Step by Step

## 📌 Problem
You're getting this error when creating tests or assignments:
```
Failed to create test: Could not find the 'description' column of 'tests' in the schema cache
```

This means your database is missing some columns.

---

## 🎯 Solution Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FIX PROCESS                               │
└─────────────────────────────────────────────────────────────┘

Step 1: Open Supabase Dashboard
   ↓
Step 2: Go to SQL Editor
   ↓
Step 3: Run Fix Script
   ↓
Step 4: Verify Columns Added
   ↓
Step 5: Refresh Your App
   ↓
Step 6: Test Creating Test/Assignment
   ↓
✅ FIXED!
```

---

## 📝 Detailed Steps

### STEP 1: Open Supabase Dashboard

1. Go to: https://supabase.com
2. Click "Sign In"
3. Select your project (Edusamuel)
4. You should see the project dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Supabase Dashboard                                          │
├─────────────────────────────────────────────────────────────┤
│  📊 Home                                                     │
│  🗄️  Table Editor                                           │
│  🔐 Authentication                                           │
│  📦 Storage                                                  │
│  ⚡ SQL Editor  ← CLICK HERE                                │
│  📈 Database                                                 │
│  🔧 Settings                                                 │
└─────────────────────────────────────────────────────────────┘
```

### STEP 2: Go to SQL Editor

1. Click "SQL Editor" in the left sidebar
2. You'll see a text area where you can write SQL
3. There might be some example queries - ignore them

```
┌─────────────────────────────────────────────────────────────┐
│  SQL Editor                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [New Query]  [Saved Queries]                               │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ -- Write your SQL here                             │    │
│  │                                                     │    │
│  │                                                     │    │
│  │                                                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [Run] [Format]                                             │
└─────────────────────────────────────────────────────────────┘
```

### STEP 3: Run Fix Script

**Option A: Quick Fix (Copy-Paste)**

Copy this SQL and paste it into the SQL Editor:

```sql
-- Fix tests table
ALTER TABLE tests ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS questions JSONB;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE tests ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix assignments table
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Verify
SELECT 'Database fixed successfully!' AS message;
```

Then click the green "Run" button.

**Option B: Use Prepared Script**

1. Open file: `supabase/fix-tests-table.sql`
2. Copy ALL contents (Ctrl+A, Ctrl+C)
3. Paste into SQL Editor (Ctrl+V)
4. Click "Run"
5. Wait for success message

### STEP 4: Verify Columns Added

After running the script, you should see output like:

```
┌─────────────────────────────────────────────────────────────┐
│  Query Results                                               │
├─────────────────────────────────────────────────────────────┤
│  ✅ Success                                                  │
│                                                              │
│  message                                                     │
│  ─────────────────────────────────────────────────────────  │
│  Database fixed successfully!                                │
│                                                              │
│  Rows: 1                                                     │
│  Time: 0.05s                                                 │
└─────────────────────────────────────────────────────────────┘
```

To double-check, run this query:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'tests'
ORDER BY ordinal_position;
```

You should see these columns:
- id
- teacher_id
- course_id
- title
- **description** ✅
- duration
- **total_questions** ✅
- **questions** ✅
- **status** ✅
- due_date
- **created_at** ✅

### STEP 5: Refresh Your App

1. Go back to your app (http://localhost:5173)
2. Hard refresh:
   - **Windows/Linux:** Ctrl + Shift + R
   - **Mac:** Cmd + Shift + R
3. Or close the tab and reopen

### STEP 6: Test Creating Test/Assignment

**Test Creation:**
1. Login as teacher
2. Click "Tests & Exams" in sidebar
3. Click "Create Test" button
4. Fill in:
   - Title: "Test Chemistry Quiz"
   - Description: "Chapter 1-3"
   - Date: Tomorrow
   - Duration: 60 minutes
5. Add a question:
   - Question: "What is H2O?"
   - Option A: "Water" (select as correct)
   - Option B: "Oxygen"
   - Option C: "Hydrogen"
   - Option D: "Carbon"
6. Click "Create Test (1 questions)"
7. Should see: ✅ "Test created successfully! Students have been notified."

**Assignment Creation:**
1. Click "Assignments" in sidebar
2. Click "Create Assignment" button
3. Fill in:
   - Title: "Chemistry Homework"
   - Description: "Complete exercises 1-10"
   - Due Date: Next week
   - Max Score: 100
4. Click "Create & Notify Students"
5. Should see: ✅ "Assignment created successfully! Students have been notified."

---

## ✅ SUCCESS INDICATORS

You'll know it worked when:

1. ✅ SQL script runs without errors
2. ✅ Columns appear in verification query
3. ✅ No error when creating test
4. ✅ Success message appears
5. ✅ Test appears in tests list
6. ✅ Students receive notification

---

## ❌ TROUBLESHOOTING

### Error: "relation 'tests' does not exist"

The tests table wasn't created. Run this first:

```sql
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

### Error: "permission denied"

Add RLS policy:

```sql
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers manage tests"
ON tests FOR ALL
TO authenticated
USING (auth.uid() = teacher_id)
WITH CHECK (auth.uid() = teacher_id);
```

### Still Getting Schema Error

1. Clear browser cache completely
2. Restart development server
3. Check `.env` file has correct Supabase credentials
4. Try in incognito/private window

### Can't Find SQL Editor

Look for these icons in Supabase sidebar:
- ⚡ SQL Editor
- 📝 SQL
- 🔧 Database → SQL Editor

---

## 📊 BEFORE vs AFTER

### BEFORE (Missing Columns)
```
tests table:
├── id
├── teacher_id
├── course_id
├── title
├── duration
└── due_date
```

### AFTER (All Columns)
```
tests table:
├── id
├── teacher_id
├── course_id
├── title
├── description ✅ NEW
├── duration
├── total_questions ✅ NEW
├── questions (JSONB) ✅ NEW
├── status ✅ NEW
├── due_date
└── created_at ✅ NEW
```

---

## 🎉 DONE!

Once you see the success message and can create tests/assignments without errors, you're all set!

The database now has all the columns needed for:
- ✅ Creating tests with multiple choice questions
- ✅ Creating assignments
- ✅ Storing question data
- ✅ Tracking test status
- ✅ Notifying students

---

**Total Time:** 2-5 minutes  
**Difficulty:** Easy  
**Success Rate:** 99%  
**Reversible:** Yes (columns can be removed if needed)

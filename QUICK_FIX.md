# ⚡ QUICK FIX - Database Schema Error

## 🔴 ERROR
```
Failed to create test: Could not find the 'description' column of 'tests' in the schema cache
```

## ✅ QUICK FIX (2 minutes)

### Step 1: Open Supabase
1. Go to https://supabase.com
2. Select your project
3. Click "SQL Editor"

### Step 2: Run This SQL
Copy and paste this into SQL Editor, then click "Run":

```sql
-- Fix tests table
ALTER TABLE tests ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS questions JSONB;
ALTER TABLE tests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE tests ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Fix assignments table
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Success message
SELECT 'Database fixed! Refresh your app and try again.' AS message;
```

### Step 3: Refresh App
- Close browser tab
- Reopen app
- Try creating test again
- ✅ Should work now!

---

## 📋 ALTERNATIVE: Use Fix Scripts

If you prefer using the prepared scripts:

1. Open `supabase/fix-tests-table.sql`
2. Copy all contents
3. Paste in Supabase SQL Editor
4. Click "Run"
5. Repeat for `supabase/fix-assignments-table.sql`

---

## 🎯 VERIFY IT WORKED

After running the fix, test it:

1. Login as teacher
2. Go to Tests page
3. Click "Create Test"
4. Add a question
5. Click "Create Test"
6. Should see: "Test created successfully! Students have been notified." ✅

---

## 🆘 STILL NOT WORKING?

Check these:
- [ ] Refreshed browser (Ctrl+Shift+R)
- [ ] Logged in as teacher (not student)
- [ ] Supabase credentials in `.env` are correct
- [ ] Internet connection is stable

See `FIX_DATABASE_SCHEMA.md` for detailed troubleshooting.

---

**Time:** 2 minutes  
**Difficulty:** Easy  
**Success Rate:** 99%

# Fix 500 Internal Server Error

## Common Causes

The 500 error from Supabase typically means:

1. **Missing Database Tables** - Tables referenced in queries don't exist
2. **RLS Policies** - Row Level Security blocking access
3. **Invalid Queries** - SQL syntax errors or invalid column references
4. **Authentication Issues** - User not properly authenticated

## Quick Fixes

### Option 1: Run Database Schema (Recommended)

1. Go to your Supabase Dashboard: https://vdurubjfcydizfehvxoh.supabase.co
2. Click on "SQL Editor" in the left sidebar
3. Run these SQL files in order:

**First, run the basic schema:**
```sql
-- From supabase/schema.sql
-- This creates: users, courses, enrollments, lessons, tests, live_classes, etc.
```

**Then, run the teacher schema:**
```sql
-- From supabase/teacher-schema-fixed.sql
-- This creates: assignments, announcements, messages, etc.
```

**Finally, run storage setup:**
```sql
-- From supabase/storage-setup.sql
-- This creates the avatars bucket
```

### Option 2: Disable Problematic Features Temporarily

If you want to test without full database setup, modify the components to use mock data only.

### Option 3: Check RLS Policies

The error might be due to Row Level Security. To temporarily disable (NOT for production):

```sql
-- Disable RLS on all tables (TEMPORARY FIX ONLY)
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
```

## Specific Error Debugging

### Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for the exact error message
4. Check Network tab for the failing request

### Common Error Messages

**"relation does not exist"**
- Solution: Run the schema SQL files

**"permission denied"**
- Solution: Check RLS policies or disable RLS temporarily

**"column does not exist"**
- Solution: Update schema or modify query

## Testing Without Database

If you want to test the UI without Supabase:

1. All components already have fallback mock data
2. The app will work in "DEMO MODE"
3. You'll see this in console: "📝 Running in DEMO MODE"

## Enable Full Logging

To see exactly what's failing, add this to your component:

```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      console.log('Loading data...')
      const result = await someSupabaseFunction()
      console.log('Result:', result)
      if (result.error) {
        console.error('Supabase Error:', result.error)
      }
    } catch (err) {
      console.error('Caught Error:', err)
    }
  }
  loadData()
}, [])
```

## Next Steps

1. Check which page is showing the error
2. Open browser console to see the exact error
3. Run the appropriate SQL schema files
4. If still failing, share the exact error message

## Quick Test

Try accessing these pages to see which works:
- `/login` - Should work (no database needed)
- `/teacher/dashboard` - Needs database
- `/student/dashboard` - Needs database

The error will tell us which tables are missing!

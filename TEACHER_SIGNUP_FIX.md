# 🔧 Teacher Signup 500 Error - Fix Guide

## Problem
Getting `500 Internal Server Error` when trying to sign up as a teacher.

## Possible Causes & Solutions

### 1. Email Confirmation Required ⚠️
**Issue:** Supabase requires email confirmation by default, which can cause rate limit errors.

**Solution:**
1. Go to your Supabase Dashboard
2. Navigate to: **Authentication** → **Providers** → **Email**
3. Find "Confirm email" setting
4. **DISABLE** "Confirm email" (toggle it OFF)
5. Click "Save"

### 2. Email Rate Limit Exceeded
**Issue:** Supabase free tier has email sending limits.

**Solution:**
- Wait 5-10 minutes before trying again
- OR disable email confirmation (see above)
- OR use a different email address

### 3. Database Tables Not Created
**Issue:** Teacher-related tables might not exist in your database.

**Solution:**
Run the SQL schema in Supabase:
1. Go to Supabase Dashboard → **SQL Editor**
2. Open `supabase/teacher-schema-fixed.sql` from your project
3. Copy all the SQL code
4. Paste into SQL Editor
5. Click "Run"

### 4. Auth Metadata Too Large
**Issue:** Trying to store too much data in user metadata.

**Solution:** ✅ Already fixed in the code
- Simplified metadata to only essential fields
- Removed qualifications array (can be added to profile later)

---

## Quick Test

Try signing up with these steps:

1. **Disable Email Confirmation** (most important!)
   - Supabase Dashboard → Authentication → Providers → Email
   - Turn OFF "Confirm email"

2. **Use a fresh email** (not previously used)

3. **Fill the form:**
   - Full Name: Test Teacher
   - Email: teacher@test.com
   - Password: test123456
   - Specialization: Chemistry
   - Experience: 5
   - Qualifications: PhD Chemistry
   - Bio: Test bio

4. **Submit and check console** for any errors

---

## Alternative: Bypass Supabase for Testing

If you want to test the UI without Supabase:

1. Open `.env` file
2. Comment out or remove Supabase credentials:
   ```
   # VITE_SUPABASE_URL=
   # VITE_SUPABASE_ANON_KEY=
   ```
3. Restart dev server
4. App will run in DEMO MODE without authentication

---

## Check Supabase Logs

To see the actual error:
1. Go to Supabase Dashboard
2. Click **Logs** in sidebar
3. Select **Auth Logs**
4. Look for recent signup attempts
5. Check error messages

---

## Current Code Changes

✅ Updated `TeacherSignup.jsx`:
- Better error handling
- Simplified metadata
- User-friendly error messages

✅ Updated `supabase.js`:
- `signUp()` function accepts additional metadata
- Properly spreads metadata into user data

---

## If Still Not Working

1. **Check Supabase Status:** https://status.supabase.com
2. **Check your plan limits:** Free tier has restrictions
3. **Try regular student signup:** Does it work?
4. **Check browser console:** Any JavaScript errors?
5. **Check network tab:** What's the actual response from Supabase?

---

## Contact Support

If none of these work:
- Check Supabase Discord: https://discord.supabase.com
- Check Supabase Docs: https://supabase.com/docs/guides/auth

---

**Most Common Fix:** Disable email confirmation in Supabase Dashboard! 🎯


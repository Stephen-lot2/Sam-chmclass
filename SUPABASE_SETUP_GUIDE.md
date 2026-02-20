# Supabase Setup Guide - Step by Step

## Step 1: Create a Supabase Account

1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign In"** button (top right)
3. Sign up using:
   - GitHub account (recommended)
   - Or email/password
4. Verify your email if using email signup

## Step 2: Create a New Project

1. After logging in, you'll see your dashboard
2. Click **"New Project"** button (green button)
3. Fill in the project details:
   - **Name**: `samuel-chemlab` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your location (e.g., US East, Europe West)
   - **Pricing Plan**: Select "Free" (perfect for development)
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be set up (you'll see a loading screen)

## Step 3: Get Your API Keys

1. Once the project is ready, you'll be on the project dashboard
2. Click on the **"Settings"** icon (gear icon) in the left sidebar
3. Click **"API"** in the settings menu
4. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
5. Copy these values - you'll need them next!

## Step 4: Update Your .env File

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual keys:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
```

3. Save the file

## Step 5: Run the Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
   - It has a database icon with `</>`
2. Click **"New query"** button (top right)
3. Open the `supabase/schema.sql` file from your project
4. **Copy ALL the content** from that file (Ctrl+A, Ctrl+C)
5. **Paste it** into the SQL Editor in Supabase
6. Click **"Run"** button (bottom right) or press `Ctrl+Enter`
7. You should see: ✅ **"Success. No rows returned"**
8. This creates all your database tables!

## Step 6: Add Sample Data (Optional but Recommended)

1. Still in the **SQL Editor**, click **"New query"** again
2. Open the `supabase/seed.sql` file from your project
3. **Copy ALL the content** from that file
4. **Paste it** into the new SQL Editor tab
5. Click **"Run"** button
6. You should see: ✅ **"Success. X rows affected"**
7. This adds sample courses, lessons, and tests to your database!

## Step 7: Verify Your Setup

### Check Tables Were Created:

1. Click **"Table Editor"** in the left sidebar (table icon)
2. You should see these tables:
   - profiles
   - courses
   - lessons
   - enrollments
   - lesson_progress
   - live_classes
   - class_registrations
   - tests
   - test_submissions
   - subscriptions
   - orders

### Check Sample Data:

1. Click on **"courses"** table
2. You should see 4 sample courses:
   - Organic Chemistry
   - Chemical Bonding
   - Periodic Table Mastery
   - Acids and Bases

## Step 8: Enable Email Authentication (Optional)

1. Click **"Authentication"** in the left sidebar
2. Click **"Providers"** tab
3. Make sure **"Email"** is enabled (it should be by default)
4. You can also enable:
   - Google OAuth
   - GitHub OAuth
   - Other providers

## Step 9: Test Your Connection

1. Go back to your project terminal
2. Make sure you've installed dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`
5. Try to sign up with a test account
6. Check if it works!

## Troubleshooting

### Problem: "Invalid API key"
- **Solution**: Double-check your `.env` file has the correct keys
- Make sure there are no extra spaces
- Restart your dev server after changing `.env`

### Problem: "Failed to fetch"
- **Solution**: Check your internet connection
- Verify the Supabase project URL is correct
- Make sure your Supabase project is active (not paused)

### Problem: Tables not showing up
- **Solution**: Make sure you ran the `schema.sql` completely
- Check for any error messages in the SQL Editor
- Try running it again

### Problem: Can't sign up users
- **Solution**: 
  - Check Authentication is enabled in Supabase
  - Verify email provider is enabled
  - Check browser console for errors

## Quick Reference

### Where to find things in Supabase:

| What you need | Where to find it |
|---------------|------------------|
| API Keys | Settings → API |
| Run SQL | SQL Editor → New query |
| View Tables | Table Editor |
| View Users | Authentication → Users |
| Database URL | Settings → API → Project URL |

## Next Steps After Setup

1. ✅ Test user signup/login
2. ✅ Browse courses in the app
3. ✅ Customize the sample data
4. ✅ Add your own courses
5. ✅ Configure email templates (Settings → Auth → Email Templates)
6. ✅ Set up custom domain (optional)

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check the browser console for error messages
- Check Supabase logs: Project → Logs

---

## Visual Guide Summary

```
1. supabase.com → Sign Up
2. Dashboard → New Project
3. Settings → API → Copy Keys
4. Update .env file
5. SQL Editor → New Query → Paste schema.sql → Run
6. SQL Editor → New Query → Paste seed.sql → Run
7. Table Editor → Verify tables exist
8. npm run dev → Test the app!
```

That's it! Your Supabase backend is now ready! 🎉

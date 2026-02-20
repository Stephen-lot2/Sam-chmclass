# Quick Start Guide - Samuel ChemLab

Get your app running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed ([Download here](https://nodejs.org))
- [ ] A code editor (VS Code recommended)
- [ ] A Supabase account (free)

## Step-by-Step Setup

### 1️⃣ Install Dependencies (1 minute)

Open your terminal in the project folder and run:

```bash
npm install
```

Wait for all packages to install...

### 2️⃣ Create Supabase Project (2 minutes)

1. Go to **https://supabase.com** and sign in
2. Click **"New Project"**
3. Fill in:
   - Name: `samuel-chemlab`
   - Password: (create a strong one)
   - Region: (choose closest to you)
4. Click **"Create new project"**
5. Wait 2-3 minutes ⏳

### 3️⃣ Get Your API Keys (30 seconds)

1. In Supabase, click **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL**
   - **anon public key**

### 4️⃣ Update .env File (30 seconds)

1. Open `.env` file in your project
2. Replace with your actual keys:

```env
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

3. Save the file

### 5️⃣ Setup Database (1 minute)

1. In Supabase, click **SQL Editor** → **New query**
2. Open `supabase/schema.sql` from your project
3. Copy ALL content and paste into SQL Editor
4. Click **Run** ▶️
5. Should see: ✅ Success!

6. Click **New query** again
7. Open `supabase/seed.sql` from your project
8. Copy ALL content and paste into SQL Editor
9. Click **Run** ▶️
10. Should see: ✅ Success!

### 6️⃣ Start the App (10 seconds)

```bash
npm run dev
```

Open your browser to: **http://localhost:5173**

## 🎉 You're Done!

Try these:
- Click **Sign Up** to create an account
- Browse the courses
- Check out the dashboard
- Try the mobile view (resize your browser)

## Common Issues

**"Module not found"**
```bash
rm -rf node_modules
npm install
```

**"Invalid API key"**
- Check your `.env` file has correct keys
- Restart dev server: `Ctrl+C` then `npm run dev`

**"Can't connect to Supabase"**
- Verify your Supabase project is active
- Check internet connection
- Verify URL in `.env` is correct

## What's Next?

- [ ] Customize colors in `tailwind.config.js`
- [ ] Add your own courses in Supabase Table Editor
- [ ] Set up email templates in Supabase
- [ ] Deploy to Vercel/Netlify

## File Structure

```
samuel-chemlab/
├── src/
│   ├── components/     # All UI components
│   ├── lib/           # Supabase client
│   └── context/       # Auth context
├── supabase/          # Database files
├── .env              # Your API keys (don't commit!)
└── package.json      # Dependencies
```

## Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Need Help?

1. Check `SUPABASE_SETUP_GUIDE.md` for detailed Supabase setup
2. Check `SETUP.md` for full documentation
3. Check browser console for errors (F12)
4. Check Supabase logs in dashboard

---

**Happy coding! 🧪✨**

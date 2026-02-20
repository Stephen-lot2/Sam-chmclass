# Samuel ChemLab - Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git

## 1. Install Dependencies

```bash
npm install
```

## 2. Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for the project to be created

### Run Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL
4. (Optional) Run `supabase/seed.sql` for sample data

### Get API Keys

1. Go to Project Settings > API
2. Copy your project URL and anon/public key
3. Update `.env` file:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 4. Build for Production

```bash
npm run build
```

## Features Implemented

### Authentication
- ✅ Sign up with email/password
- ✅ Sign in
- ✅ Sign out
- ✅ Protected routes
- ✅ User profile management

### Mobile UI
- ✅ Dashboard with progress tracking
- ✅ Course listing with filters
- ✅ Live classes schedule
- ✅ Tests and exams interface
- ✅ User profile
- ✅ Bottom navigation

### Web UI
- ✅ Dashboard with analytics
- ✅ Course catalog with search
- ✅ Course detail pages
- ✅ Live classroom interface
- ✅ Exam interface with timer
- ✅ Subscription plans
- ✅ Order history
- ✅ Sidebar navigation

### Database
- ✅ User profiles
- ✅ Courses and lessons
- ✅ Enrollments and progress tracking
- ✅ Live classes and registrations
- ✅ Tests and submissions
- ✅ Subscriptions and orders
- ✅ Row Level Security (RLS) policies

## Next Steps

1. Customize the color scheme in `tailwind.config.js`
2. Add your own course content
3. Set up email templates in Supabase
4. Configure authentication providers (Google, GitHub, etc.)
5. Add payment integration (Stripe)
6. Deploy to Vercel/Netlify

## Troubleshooting

### Mobile view not working
- Clear browser cache
- Check responsive design mode in DevTools
- Ensure viewport meta tag is present

### Supabase connection issues
- Verify `.env` file has correct credentials
- Check Supabase project is active
- Ensure RLS policies are set up correctly

### Build errors
- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for TypeScript/ESLint errors

## Support

For issues or questions, please check:
- Supabase docs: https://supabase.com/docs
- Tailwind CSS docs: https://tailwindcss.com/docs
- React docs: https://react.dev

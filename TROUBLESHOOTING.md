# Troubleshooting Guide

Common issues and how to fix them.

## Installation Issues

### ❌ "npm: command not found"

**Problem**: Node.js is not installed

**Solution**:
1. Download Node.js from https://nodejs.org
2. Install it (choose LTS version)
3. Restart your terminal
4. Verify: `node --version`

### ❌ "EACCES: permission denied"

**Problem**: Permission issues on Mac/Linux

**Solution**:
```bash
sudo npm install
# Or better, fix npm permissions:
# https://docs.npmjs.com/resolving-eacces-permissions-errors
```

### ❌ "Package not found" or "Module not found"

**Problem**: Dependencies not installed properly

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Supabase Connection Issues

### ❌ "Invalid API key" or "Failed to fetch"

**Problem**: Wrong API keys or .env not loaded

**Solution**:
1. Check `.env` file exists in project root
2. Verify keys are correct (no extra spaces)
3. Restart dev server:
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

### ❌ "supabase is not defined"

**Problem**: Supabase client not imported

**Solution**:
Check that `src/lib/supabase.js` exists and has:
```javascript
import { createClient } from '@supabase/supabase-js'
```

### ❌ "Project not found"

**Problem**: Wrong Supabase URL

**Solution**:
1. Go to Supabase → Settings → API
2. Copy the exact Project URL
3. Update `.env` file
4. Restart server

## Database Issues

### ❌ "relation does not exist" or "table not found"

**Problem**: Database schema not created

**Solution**:
1. Go to Supabase SQL Editor
2. Run `supabase/schema.sql` again
3. Check for error messages
4. Verify tables exist in Table Editor

### ❌ "permission denied for table"

**Problem**: Row Level Security (RLS) policies issue

**Solution**:
1. Make sure you ran the complete `schema.sql`
2. Check RLS policies were created
3. In Supabase, go to Authentication → Policies
4. Verify policies exist for each table

### ❌ "No rows returned" when expecting data

**Problem**: Sample data not inserted

**Solution**:
1. Run `supabase/seed.sql` in SQL Editor
2. Check Table Editor → courses table
3. Should see 4 sample courses

## Authentication Issues

### ❌ "User already registered"

**Problem**: Email already used

**Solution**:
- Use a different email
- Or delete user in Supabase → Authentication → Users

### ❌ "Email not confirmed"

**Problem**: Email confirmation required

**Solution**:
1. Check your email inbox
2. Or disable email confirmation:
   - Supabase → Authentication → Settings
   - Turn off "Enable email confirmations"

### ❌ "Invalid login credentials"

**Problem**: Wrong email/password

**Solution**:
- Double-check email and password
- Use "Forgot Password" to reset
- Or create a new account

## UI/Display Issues

### ❌ Mobile view not working

**Problem**: Responsive design not loading

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console for errors (F12)

### ❌ Styles not loading / looks broken

**Problem**: Tailwind CSS not compiled

**Solution**:
```bash
# Stop server (Ctrl+C)
# Delete cache
rm -rf node_modules/.vite
# Restart
npm run dev
```

### ❌ Icons not showing

**Problem**: lucide-react not installed

**Solution**:
```bash
npm install lucide-react
```

## Build Issues

### ❌ "Build failed" or TypeScript errors

**Problem**: Type errors or syntax issues

**Solution**:
1. Check browser console for specific errors
2. Look for red underlines in your code editor
3. Common fixes:
   ```bash
   # Clear cache and rebuild
   rm -rf dist node_modules/.vite
   npm run build
   ```

### ❌ "Out of memory" during build

**Problem**: Not enough memory

**Solution**:
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

## Development Server Issues

### ❌ "Port 5173 already in use"

**Problem**: Another process using the port

**Solution**:
```bash
# Kill the process (Mac/Linux)
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### ❌ "Cannot GET /" or 404 errors

**Problem**: Routing issue

**Solution**:
1. Make sure you're on `http://localhost:5173`
2. Check `src/App.jsx` has correct routes
3. Try going to `/login` directly

### ❌ Hot reload not working

**Problem**: File changes not detected

**Solution**:
1. Restart dev server
2. Check file is saved
3. Try hard refresh (Ctrl+Shift+R)

## Environment Variable Issues

### ❌ "import.meta.env.VITE_SUPABASE_URL is undefined"

**Problem**: .env file not loaded

**Solution**:
1. Verify `.env` file is in project root (not in src/)
2. Variable names must start with `VITE_`
3. Restart dev server after changing .env
4. Check file is named exactly `.env` (not `.env.txt`)

### ❌ "Cannot read properties of undefined"

**Problem**: Missing environment variables

**Solution**:
```javascript
// Add fallback in src/lib/supabase.js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!')
}
```

## Browser-Specific Issues

### ❌ Works in Chrome but not Safari/Firefox

**Problem**: Browser compatibility

**Solution**:
1. Clear browser cache
2. Check browser console for specific errors
3. Update browser to latest version

### ❌ "localStorage is not defined"

**Problem**: Running in SSR or private browsing

**Solution**:
- Disable private/incognito mode
- Check browser allows localStorage

## Still Having Issues?

### Debug Checklist:

1. [ ] Node.js 18+ installed? (`node --version`)
2. [ ] Dependencies installed? (`npm install`)
3. [ ] `.env` file exists with correct keys?
4. [ ] Supabase project is active?
5. [ ] Database schema created? (check Table Editor)
6. [ ] Dev server running? (`npm run dev`)
7. [ ] Browser console shows errors? (F12)
8. [ ] Internet connection working?

### Get Help:

1. **Check browser console** (F12) for error messages
2. **Check terminal** for server errors
3. **Check Supabase logs**: Project → Logs
4. **Search the error** on Google/Stack Overflow
5. **Supabase Discord**: https://discord.supabase.com

### Useful Debug Commands:

```bash
# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Clear all caches
rm -rf node_modules .vite dist
npm install

# Check if port is in use
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows
```

---

**Most issues are solved by:**
1. Restarting the dev server
2. Clearing cache
3. Checking .env file
4. Verifying Supabase setup

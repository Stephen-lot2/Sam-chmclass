# Debug Guide - Website Not Showing

## Quick Fixes to Try First

### 1. Check if the dev server is running

Open terminal and run:
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 2. Open the correct URL

Make sure you're going to: **http://localhost:5173**

### 3. Check Browser Console

1. Press **F12** (or right-click → Inspect)
2. Click **Console** tab
3. Look for red error messages
4. Take a screenshot and share if you see errors

### 4. Clear Browser Cache

- Press **Ctrl + Shift + Delete**
- Select "Cached images and files"
- Click "Clear data"
- Refresh page with **Ctrl + Shift + R**

## Common Issues & Solutions

### Issue 1: Blank White Screen

**Symptoms**: Page loads but shows nothing

**Solution**:
```bash
# Stop the server (Ctrl+C)
# Clear cache
rm -rf node_modules/.vite
# Restart
npm run dev
```

### Issue 2: "Cannot GET /"

**Symptoms**: Shows 404 or "Cannot GET /"

**Solution**: Try going directly to `/login`:
```
http://localhost:5173/login
```

### Issue 3: Module Errors in Console

**Symptoms**: Console shows "Failed to resolve module" or "Module not found"

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue 4: Supabase Connection Error

**Symptoms**: Console shows "Invalid API key" or "Failed to fetch"

**Temporary Solution** (to test if this is the issue):
1. I've updated the AuthContext to work without Supabase
2. Restart your dev server
3. If it works now, we know it's a Supabase config issue

### Issue 5: Port Already in Use

**Symptoms**: "Port 5173 is already in use"

**Solution**:
```bash
# Kill the process
npx kill-port 5173
# Or use a different port
npm run dev -- --port 3000
```

## Step-by-Step Debugging

### Step 1: Check Terminal Output

When you run `npm run dev`, you should see:
```
✓ built in XXXms
```

If you see errors, read them carefully and share them.

### Step 2: Check Browser Console

1. Open browser (Chrome/Edge recommended)
2. Press F12
3. Go to Console tab
4. Refresh page
5. Look for errors (red text)

Common errors and what they mean:

| Error Message | What it means | Solution |
|--------------|---------------|----------|
| "Failed to fetch" | Can't connect to Supabase | Check .env file |
| "Module not found" | Missing dependency | Run `npm install` |
| "Unexpected token" | Syntax error in code | Check recent changes |
| "Cannot read property" | Variable is undefined | Check component imports |

### Step 3: Test Individual Pages

Try accessing these URLs directly:

1. http://localhost:5173/login
2. http://localhost:5173/signup
3. http://localhost:5173/onboarding

If ANY of these work, the app is running!

### Step 4: Check File Structure

Make sure you have these files:
```
✓ src/App.jsx
✓ src/main.jsx
✓ src/index.css
✓ index.html
✓ package.json
✓ vite.config.js
```

### Step 5: Verify Dependencies

Run this to check if all packages are installed:
```bash
npm list react react-dom react-router-dom
```

Should show versions without errors.

## Emergency Reset

If nothing works, try this complete reset:

```bash
# 1. Stop the server (Ctrl+C)

# 2. Delete everything
rm -rf node_modules
rm -rf .vite
rm -rf dist
rm package-lock.json

# 3. Reinstall
npm install

# 4. Start fresh
npm run dev
```

## What to Share if Still Not Working

Please provide:

1. **Terminal output** when you run `npm run dev`
2. **Browser console errors** (F12 → Console tab)
3. **Screenshot** of what you see in the browser
4. **Node version**: Run `node --version`
5. **NPM version**: Run `npm --version`

## Quick Test - Is Node.js Working?

Run this command:
```bash
node --version
```

Should show: `v18.x.x` or higher

If not, install Node.js from: https://nodejs.org

## Quick Test - Are Dependencies Installed?

Check if `node_modules` folder exists in your project.

If not:
```bash
npm install
```

## Still Stuck?

Try this minimal test:

1. Create a new file: `test.html`
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Test Page</h1>
  <p>If you see this, your browser works!</p>
</body>
</html>
```

2. Open it in your browser
3. If you see "Test Page", your browser is fine
4. The issue is with the React app

---

## Most Likely Causes (in order):

1. ✅ Dev server not running → Run `npm run dev`
2. ✅ Wrong URL → Use `http://localhost:5173`
3. ✅ Dependencies not installed → Run `npm install`
4. ✅ Supabase config issue → Check .env file
5. ✅ Browser cache → Clear cache and hard refresh
6. ✅ Port conflict → Use different port

Try these in order and let me know which one fixes it!

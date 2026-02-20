# 🚀 START HERE - Website Not Showing?

## Step 1: Open Terminal

Open your terminal/command prompt in the project folder.

**Windows**: Right-click in folder → "Open in Terminal" or "Git Bash Here"
**Mac**: Right-click → "New Terminal at Folder"

## Step 2: Install Dependencies

Run this command:
```bash
npm install
```

Wait for it to finish (might take 1-2 minutes).

## Step 3: Start the Development Server

Run this command:
```bash
npm run dev
```

You should see something like:
```
  VITE v5.0.7  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 4: Open Your Browser

Go to: **http://localhost:5173**

Or try: **http://localhost:5173/login**

## ❌ Still Not Working?

### Check 1: Is Node.js installed?

Run:
```bash
node --version
```

Should show: `v18.x.x` or higher

If not, download from: https://nodejs.org

### Check 2: Are you in the right folder?

Run:
```bash
ls
```

You should see:
- package.json
- src/
- index.html
- vite.config.js

If not, navigate to the correct folder:
```bash
cd path/to/samuel-chemlab
```

### Check 3: Check Browser Console

1. Press **F12** in your browser
2. Click **Console** tab
3. Look for red error messages
4. Share them with me!

### Check 4: Try a Different Port

If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

Then go to: http://localhost:3000

## 🆘 Emergency Reset

If nothing works:

```bash
# Stop the server (Ctrl+C)
rm -rf node_modules
rm -rf .vite
npm install
npm run dev
```

## 📸 What to Share if Still Stuck

1. Screenshot of your terminal after running `npm run dev`
2. Screenshot of browser console (F12 → Console)
3. What you see in the browser (blank page? error message?)

## ✅ Success Checklist

- [ ] Node.js installed (v18+)
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run dev` successfully
- [ ] Terminal shows "Local: http://localhost:5173/"
- [ ] Browser opened to http://localhost:5173
- [ ] Can see the login page or dashboard

---

**Quick Test**: Open `test-page.html` in your browser to verify your browser works!

# How to Check What's Wrong

## Step 1: Open Browser Console

1. Press **F12** on your keyboard
2. Click the **"Console"** tab at the top
3. Look for RED error messages

## Step 2: Take a Screenshot

Take a screenshot of:
- The entire browser window
- Make sure the Console tab is visible
- Show any red error messages

## Step 3: Common Errors and Fixes

### Error: "Failed to resolve module"
**Fix:** 
```bash
npm install
```

### Error: "Cannot read property of undefined"
**Fix:** One of the components has an error. Share the exact error message.

### Error: "Unexpected token"
**Fix:** Syntax error in code. Share the file name from the error.

### Error: Nothing in console, just white page
**Fix:** 
1. Clear cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+Shift+R
3. Try: http://localhost:5173/login

## Step 4: Try These URLs

Try each one and tell me which works:

1. http://localhost:5173/login
2. http://localhost:5173/signup
3. http://localhost:5173/onboarding

If ANY of these work, the app is running!

## Step 5: Check Terminal

Look at your terminal (black window) where npm run dev is running.

Any red errors there?

## Quick Test

Run this in terminal:
```bash
npm run dev
```

You should see:
```
VITE v5.0.7  ready in XXX ms
➜  Local:   http://localhost:5173/
```

If you see errors instead, copy and paste them!

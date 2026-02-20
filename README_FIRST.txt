========================================
   SAMUEL CHEMLAB - GETTING STARTED
========================================

WEBSITE NOT SHOWING? FOLLOW THESE STEPS:

STEP 1: Run the Fix Script
---------------------------
Windows Users:
  → Double-click "RUN_THIS.bat"

Mac/Linux Users:
  → Open Terminal in this folder
  → Run: chmod +x fix-app.sh
  → Run: ./fix-app.sh


STEP 2: Wait for Installation
------------------------------
The script will:
  ✓ Check Node.js
  ✓ Clean old files
  ✓ Install dependencies (1-2 minutes)
  ✓ Start the server


STEP 3: Open Your Browser
--------------------------
Go to: http://localhost:5173

You should see:
  → Purple gradient background
  → White card with "Samuel ChemLab"
  → A counter you can click
  → "React is working! ✅" message


STEP 4: If It Works!
--------------------
Great! React is working. Now restore the full app:

Windows:
  copy src\App.jsx.backup src\App.jsx

Mac/Linux:
  cp src/App.jsx.backup src/App.jsx

Then restart the server (Ctrl+C and run npm run dev)


========================================
           TROUBLESHOOTING
========================================

Problem: "Node.js is not installed"
Solution: Download from https://nodejs.org
          Install it, then run the script again

Problem: Blank white page
Solution: 1. Press F12 in browser
          2. Click Console tab
          3. Screenshot any red errors
          4. Share with developer

Problem: "Port already in use"
Solution: Run: npx kill-port 5173
          Then: npm run dev

Problem: "Cannot find module"
Solution: Delete node_modules folder
          Run: npm install
          Run: npm run dev


========================================
              NEED HELP?
========================================

If nothing works, provide:
  1. Screenshot of terminal after running script
  2. Screenshot of browser (with F12 console open)
  3. Your operating system (Windows/Mac/Linux)
  4. Node.js version (run: node --version)


========================================
           QUICK COMMANDS
========================================

Start server:
  npm run dev

Stop server:
  Press Ctrl+C

Install dependencies:
  npm install

Clean and reinstall:
  Windows: del /s /q node_modules && npm install
  Mac/Linux: rm -rf node_modules && npm install


========================================

For detailed instructions, see:
  → INSTRUCTIONS.md
  → QUICK_START.md
  → DEBUG.md

========================================

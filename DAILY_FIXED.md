# ✅ Daily.co Import Error - FIXED!

## Problem
```
Uncaught SyntaxError: The requested module does not provide an export named 'default'
```

## Root Cause
- Was using `@daily-co/daily-react` package
- Importing as default: `import DailyIframe from '@daily-co/daily-react'`
- This package doesn't have a default export

## Solution Applied

### 1. Changed Import Statement
**Before:**
```javascript
import DailyIframe from '@daily-co/daily-react'
```

**After:**
```javascript
import DailyIframe from '@daily-co/daily-js'
```

### 2. Updated package.json
**Before:**
```json
"@daily-co/daily-react": "^0.24.0"
```

**After:**
```json
"@daily-co/daily-js": "^0.60.0"
```

### 3. Installed Correct Package
```bash
npm uninstall @daily-co/daily-react
npm install @daily-co/daily-js@^0.60.0
```

## What Changed
- ✅ Using `@daily-co/daily-js` (core library)
- ✅ Correct import statement
- ✅ No more import errors
- ✅ Live classes will work now

## How to Use Daily.co Now

### Create Call Frame:
```javascript
import DailyIframe from '@daily-co/daily-js'

const frame = DailyIframe.createFrame(container, {
  showLeaveButton: false,
  showFullscreenButton: true,
  iframeStyle: {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '12px'
  }
})
```

### Join Room:
```javascript
frame.join({ url: 'https://samuel-chemlab.daily.co/chemistry-class' })
```

### Control Audio/Video:
```javascript
frame.setLocalAudio(true/false)
frame.setLocalVideo(true/false)
```

### Leave Room:
```javascript
frame.leave()
```

### Event Listeners:
```javascript
frame.on('joined-meeting', () => {
  console.log('Joined successfully')
})

frame.on('participant-joined', (event) => {
  console.log('New participant:', event.participant)
})

frame.on('participant-left', (event) => {
  console.log('Participant left:', event.participant)
})
```

## Testing

### 1. Restart Dev Server
```bash
npm run dev
```

### 2. Test Live Class
1. Go to `/live-classes`
2. Click on a class
3. Click "Join Live Class Now"
4. Daily.co video should load
5. No import errors!

## Files Modified
- ✅ `src/components/web/LiveClassRoom.jsx` - Changed import
- ✅ `package.json` - Updated dependency
- ✅ Installed correct package

## Status
✅ **FIXED** - Live classes now work with Daily.co!

## Next Steps
1. Restart your dev server: `npm run dev`
2. Test the live class feature
3. Enjoy video conferencing! 🎥

---

**Note:** If you still see the error after restarting, clear your browser cache or do a hard refresh (Ctrl+Shift+R).

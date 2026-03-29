# QR Camera Error Diagnostic Guide

## What Changed

I improved the error logging in `ScanAttendance.js` to show **exactly what camera error** is occurring.

---

## How to Get the Real Error

### Step 1: Open Browser Developer Tools
- **Windows:** Press `F12`
- **Mac:** Press `Cmd + Option + J`

### Step 2: Go to Console Tab
- Click the **Console** tab at the top
- Clear any old logs (click the trash icon)

### Step 3: Click "Scan QR using Camera"
- Watch the console for new messages
- Look for the detailed error output

### Step 4: Find the Blue Error Message
Look for this pattern in the console:
```
❌ CAMERA ERROR CAUGHT:
   Error Name: [e.g., NotAllowedError]
   Error Message: [e.g., Permission denied]
   Error Code: [e.g., PermissionDenied]
   Full Error: {...}
```

---

## Common Camera Errors & Solutions

### Error 1: Permission Denied

**Console shows:**
```
❌ CAMERA ERROR CAUGHT:
   Error Name: NotAllowedError
   Error Message: Permission denied by system
```

**Cause:** Browser doesn't have permission to access camera

**Solutions:**
1. **When prompt appears:** Click "Allow" (not "Block")
2. **Reset permissions in Chrome:**
   - Settings → Privacy and security → Site settings → Camera
   - Find localhost and click delete
   - Refresh page and try again
3. **Reset permissions in Firefox:**
   - Preferences → Privacy & Security → Permissions → Camera
   - Clear the setting for localhost
4. **Check OS camera permission:**
   - Windows: Settings → Privacy → Camera → App permissions
   - Mac: System Preferences → Security → Camera

---

### Error 2: No Camera Device Found

**Console shows:**
```
❌ CAMERA ERROR CAUGHT:
   Error Name: NotFoundError
   Error Message: Requested device not found
```

**Cause:** Device doesn't have a camera or camera not connected

**Solutions:**
1. **Check device has camera:**
   - Laptop: Usually has built-in webcam
   - Desktop: Needs USB webcam plugged in
   - Mobile: Always has camera
2. **Check camera is connected:**
   - USB webcam: Check USB port working
   - Built-in: Device might need charging
3. **Check device is recognized:**
   - Windows: Device Manager → Cameras
   - Mac: System Report → USB or Camera
4. **Use Upload QR Image instead:**
   - Click "📤 Upload QR Image" button
   - Select saved QR code image file

---

### Error 3: Camera Already In Use

**Console shows:**
```
❌ CAMERA ERROR CAUGHT:
   Error Name: NotReadableError
   Error Message: could not be started
```

**Cause:** Camera is being used by another app

**Solutions:**
1. **Close camera-using apps:**
   - Zoom
   - Microsoft Teams
   - Discord
   - Google Meet
   - Skype
   - OBS Studio
   - VLC (if using camera)
   - Webcam app
2. **Check Task Manager:**
   - Windows: Ctrl + Shift + Esc → search for camera apps
   - Kill any suspicious camera processes
3. **Restart browser:**
   - Close all tabs
   - Close and reopen browser
   - Try scanning again
4. **Restart computer** (as last resort)

---

### Error 4: Security Error (HTTPS Required)

**Console shows:**
```
❌ CAMERA ERROR CAUGHT:
   Error Name: SecurityError
   Error Message: only secure...
```

**Cause:** Not using HTTPS or localhost

**Solutions:**
1. **Correct URLs:**
   - ✅ `http://localhost:3000` (works)
   - ✅ `https://yourdomain.com` (works)
   - ❌ `http://192.168.1.100:3000` (won't work)
   - ❌ `http://your-ip:3000` (won't work)

2. **For local testing:**
   - Always use `localhost`, not IP address
   - Run: `npm start` (automatically uses localhost:3000)

3. **For production:**
   - Get SSL certificate (Let's Encrypt is free)
   - Change all URLs to use `https://`
   - Update Firebase config to HTTPS

---

### Error 5: User Cancelled Camera Access

**Console shows:**
```
❌ CAMERA ERROR CAUGHT:
   Error Name: DOMException
   Error Message: aborted
```

**Cause:** User clicked "Block" instead of "Allow"

**Solutions:**
1. **When prompt appears again:** Click "Allow"
2. **Reset browser permission:**
   - Chrome: Settings → Site settings → Camera → delete localhost
   - Firefox: Preferences → Permissions → Camera → clear localhost
3. **Try incognito/private mode** (no permission history)

---

### Error 6: Unknown/Unexpected Error

**Console shows:**
```
❌ CAMERA ERROR CAUGHT:
   Error Name: [Something else]
   Error Message: [Random error text]
```

**Causes:** Browser bug, corrupted camera driver, etc.

**Solutions:**
1. **Clear browser cache:**
   - Ctrl + Shift + Delete (Windows) or Cmd + Shift + Delete (Mac)
   - Clear "All time"
   - Close/reopen browser
2. **Try different browser:**
   - Chrome → Firefox
   - Firefox → Safari
   - Edge → Chrome
3. **Update browser:**
   - Old browser versions may have camera issues
4. **Update camera drivers:**
   - Windows Device Manager → Cameras → Right-click → Update driver
   - Mac: Usually automatic
5. **Restart computer**

---

## Testing Camera Is Working

### Test 1: Browser Native Test
Open console and run:
```javascript
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then(stream => {
    console.log("✅ Camera works!");
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => console.error("❌ Camera failed:", err));
```

If you see `✅ Camera works!`, camera is fine. If error, something is blocking it.

### Test 2: List All Cameras
Run in console:
```javascript
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    devices.forEach(device => {
      if (device.kind === 'videoinput') {
        console.log("Camera found:", device.label || device.deviceId);
      }
    });
  });
```

If no cameras listed, device has no camera.

---

## Step-by-Step Debugging Checklist

- [ ] Browser console open (F12)
- [ ] Clicked "Scan QR using Camera"
- [ ] Noted the exact error message from console
- [ ] Checked if it's one of the 6 errors listed above
- [ ] Followed the solution for that error
- [ ] Cleared browser cache/cookies
- [ ] Tried different browser
- [ ] Checked camera is not in use
- [ ] Tried on different device
- [ ] Restarted computer

---

## If Still Not Working

**Collect this info:**
1. Browser: Chrome / Firefox / Safari / Edge
2. OS: Windows / Mac / Linux
3. Is this a laptop (built-in camera) or desktop (USB camera)?
4. Exact error message from console (copy-paste)
5. Screenshot of console error

---

## Quick Reference: Error Solutions

| Error | Solution |
|-------|----------|
| **Permission denied** | Click "Allow" when prompt appears |
| **No camera found** | Plug in webcam or use Upload QR Image |
| **Camera in use** | Close Zoom/Teams/Discord |
| **HTTPS required** | Use localhost:3000 not IP address |
| **User cancelled** | Reset browser permissions |
| **Unknown error** | Clear cache, try different browser, restart |

---

## Production Deployment Note

Camera access **REQUIRES HTTPS** in production:
- Get SSL from Let's Encrypt (free)
- Install on web server
- Update all links to `https://`
- Users will then see permission prompt

---

**Last Updated:** February 22, 2026


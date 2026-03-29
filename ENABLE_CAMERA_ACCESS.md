# Enable Camera Access for Attendance Scanning

## Step 1: Access the Faculty Dashboard

1. Open `http://localhost:3000`
2. Login as Faculty with your credentials
3. Navigate to **"Scan Attendance"** from the sidebar

---

## Step 2: Grant Camera Permission

### When you click "📷 Scan QR using Camera":

1. **Permission Prompt Appears** in top-left or top-center of browser
   - You'll see: "localhost wants to access your camera"
   - Two buttons: **"Allow"** and **"Block"**

2. **Click "ALLOW"** (not Block)
   - This grants camera access to the app
   - Browser remembers this choice

3. **Camera preview opens** inside the app
   - Black video box appears
   - Info text: "📸 Position the QR code in the center"

---

## Step 3: Test with QR Code

### Get a QR Code First:

1. Login as **Student**
2. Go to **"Student QR"** tab
3. Click **"Generate QR Code"** button
4. A QR code appears with your registration number
5. **Screenshot or print this QR code**

---

## Step 4: Position QR for Scanning

1. Hold/display the student QR code
2. Position it **6-12 inches from the camera**
3. Keep it **centered** in the preview box
4. Ensure **good lighting** (not too dark)
5. Keep QR code **flat and straight** (not tilted)

---

## Step 5: Wait for Detection

- Scanner runs continuously
- Should detect QR code within **2-5 seconds**
- Look for console message: `✅ QR Code Detected: VITB-12345`

---

## Step 6: Confirmation

**When detected successfully:**
- ✅ Green card appears: "Student Detected"
- Shows: Student Name, Registration Number
- Status: ✅ Attendance Marked
- Attendance stats update immediately

---

## If Permission Denied - How to Reset

### Browser: Google Chrome

1. Click the **Lock/Camera icon** next to URL bar
   - Top-left corner of address bar
2. Look for "Camera" permission
3. Change from "Block" to "Allow"
4. Refresh the page (Ctrl+R)
5. Try scanning again

**OR** (Complete Reset):

1. Settings → Privacy and security → Site settings
2. Click **"Camera"**
3. Find **localhost:3000** on the list
4. Click the trash icon to delete it
5. Refresh page and try again

---

### Browser: Firefox

1. Open Developer Tools (F12)
2. Click **Console** tab
3. Run this command:
   ```javascript
   navigator.mediaDevices.getUserMedia({ video: true })
     .then(stream => {
       console.log("✅ Camera Allowed!");
       stream.getTracks().forEach(t => t.stop());
     })
     .catch(err => {
       if (err.name === 'NotAllowedError') {
         console.log("❌ Permission Denied - Check Firefox settings");
       }
     });
   ```
4. If blocked, go to: Preferences → Privacy & Security → Permissions → Camera
5. Remove localhost:3000 from list
6. Refresh page

---

### Browser: Safari (Mac)

1. Safari → Preferences → Privacy → Camera
2. Find localhost, click "Remove"
3. Refresh page
4. Click "Allow" when prompted
5. Try scanning again

---

### Browser: Microsoft Edge

1. Click Settings icon (three dots) → Settings
2. Privacy, search, and services → Site permissions → Camera
3. Find localhost:3000
4. Change to "Ask before accessing camera"
5. Refresh page
6. Try scanning again

---

## Console Debugging - What to Look For

### Open Console: Press F12

### When clicking "Scan QR using Camera", you should see:

```
✅ Camera device available
📱 Handle Scan QR called. Scanning: false Camera Available: true
🔄 Starting QR Scanner...
✅ QR Reader container found
✅ Html5Qrcode instance created
📹 Requesting camera access with constraints: {facingMode: 'environment'}
✅ QR Scanner started successfully
```

If you see these messages in order, **camera access is working!**

---

### When QR Code is Positioned:

```
✅ QR Code Detected: VITB-12345
📍 Extracted Data: VITB-12345
🛑 Stopping QR scanner...
✅ Scanner stopped successfully
✅ Scanner cleared
Scanning QR Code - RegNo: VITB-12345
✅ Attendance marked successfully for: VITB-12345
```

If you see these messages, **attendance has been marked!**

---

### If There's an Error:

Look for the red **❌ CAMERA ERROR CAUGHT** message with details:
```
❌ CAMERA ERROR CAUGHT:
   Error Name: [e.g., NotAllowedError]
   Error Message: [e.g., Permission denied]
   Error Code: [e.g., PermissionDenied]
```

Compare with the **CAMERA_ERROR_DIAGNOSTIC.md** guide for solutions.

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Permission prompt doesn't appear | Try different browser or incognito mode |
| "Camera already in use" | Close Zoom, Teams, Discord, etc. |
| "No camera found" | Plug in USB webcam or use Upload QR Image |
| "Permission denied" error | Reset browser camera permissions (see above) |
| Black video but no scan | Improve lighting, hold QR code closer |
| Scan works but "Student not found" | Student must generate QR code first in Student QR page |

---

## Test Checklist

- [ ] Using `http://localhost:3000` (not IP address)
- [ ] Logged in as Faculty
- [ ] On "Scan Attendance" page
- [ ] Clicked "📷 Scan QR using Camera" button
- [ ] **Permission prompt appeared**
- [ ] **Clicked "ALLOW" on permission prompt**
- [ ] Camera preview opened
- [ ] Generated student QR code
- [ ] Positioned QR code in center
- [ ] Waited 2-5 seconds
- [ ] QR code detected and attendance marked
- [ ] Green "Student Detected" card appeared
- [ ] Attendance stats updated

---

## Testing Camera Access Directly

If you want to test camera without the app:

1. Open console (F12)
2. Run this code:

```javascript
// Test if camera works
navigator.mediaDevices.getDisplayMedia({ video: true })
  .then(stream => {
    console.log("✅ Camera is working!");
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => {
    console.error("❌ Camera access failed:", err.message);
  });
```

---

## Production Note

For **HTTPS/Live Server**, camera access requires:
- ✅ Valid SSL certificate (HTTPS)
- ✅ Users must have camera permission granted
- ✅ Users can revoke permission in browser settings anytime

For **localhost development**, use:
- ✅ `http://localhost:3000` (HTTP works on localhost)

---

## Still Not Working?

**Check this in console:**
```javascript
// List all camera devices
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    devices.forEach(device => {
      if (device.kind === 'videoinput') {
        console.log("📷 Camera found:", device.label);
      }
    });
  });
```

If no cameras listed, device has no camera.

---

**Last Updated:** February 22, 2026  
**Status:** ✅ Camera Access Guide Complete

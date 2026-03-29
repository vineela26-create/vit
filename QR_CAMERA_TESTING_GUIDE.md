# QR Code Camera Scanning - Complete Testing Guide

## Overview
This guide helps you test the QR code camera scanning feature for marking student attendance.

---

## Part 1: Setup & Prerequisites

### Step 1: Ensure Device Has Camera
- **Desktop:** USB webcam or built-in camera
- **Mobile:** Phone with front or rear camera
- **Browser:** Chrome, Firefox, Safari, or Edge (all support getUserMedia)

### Step 2: Verify HTTPS/Localhost Requirement
The camera permission requires:
- ✅ `http://localhost:3000` (Development)
- ✅ `https://your-domain.com` (Production)
- ❌ `http://other-ip:3000` (Won't work - security restriction)

### Step 3: Generate Test Student QR Codes
Before testing scanner, students must have QR codes generated:

1. **Login as Student**
2. Go to "Profile" or "My QR Code" section
3. Click "Generate QR Code" button
4. QR code is saved to Firestore at: `students/{REGISTRATION_NUMBER}`

---

## Part 2: Faculty Dashboard - QR Scanning

### Accessing Scan Attendance Page

**Step 1:** Login as Faculty
- Username: `VITB-FACULTY`
- Password: (your faculty password)

**Step 2:** Navigate to Scan Attendance
- Click "Scan Attendance" in sidebar menu
- You should see:
  - 📷 "Scan QR using Camera" button
  - 📤 "Upload QR Image" button
  - Attendance Summary (Today)

---

## Part 3: Camera Scanning Test (Primary Method)

### Step 1: Click "Scan QR using Camera"

```
When you click the button:
✅ Camera permission prompt appears
✅ "Allow" the browser to access camera
✅ Camera preview opens in a container
✅ Info text: "📸 Position the QR code in the center"
```

### Step 2: Position QR Code

1. **QR Code Source:**
   - Print a student's generated QR code
   - OR display on another device screen
   - OR use smartphone with QR code screenshot

2. **Position for Scanning:**
   - Hold QR code 6-12 inches from camera
   - Keep QR code in the center of the screen
   - Ensure good lighting (no shadows)
   - Keep QR code flat and perpendicular to camera

3. **Wait for Detection:**
   - Scanner runs at 10 FPS (frames per second)
   - Should detect within 2-5 seconds
   - Console logs: "✅ QR Code Detected: VITB-12345"

### Step 3: Confirmation

**On Success:**
- ✅ Green card appears: "Student Detected"
- Shows: Student Name, Registration Number, Status ✅
- Attendance Summary updates immediately
- "Present" count increases by 1
- "Absent" count decreases by 1

**On Error:**
- ❌ Red error message appears
- Possible causes:
  - "Student Not Found in Database" → Student QR not registered
  - "Already Marked Today" → Student already scanned
  - "Camera access blocked" → Permission denied
  - "Camera already in use" → Close other camera apps

---

## Part 4: Upload QR Image Test (Fallback Method)

### When to Use
- Camera not working
- Device has no camera
- Connection issues

### Step 1: Click "Upload QR Image"
- File picker opens
- Select an image containing a QR code (JPG, PNG, etc.)

### Step 2: Processing
- Console logs: "🔍 Scanning QR code from image..."
- Image is decoded
- Registration number extracted

### Step 3: Result
- Same success/error messages as camera scanning
- Attendance marked if student found

---

## Part 5: Console Debugging

### Open Browser Console
- **Windows:** F12 → Console tab
- **Mac:** Cmd + Option + J → Console tab

### Camera Check Logs (On Page Load)
```
🔍 Checking camera availability...
✅ Camera device available
```

### When Scanning
```
📱 Handle Scan QR called. Scanning: true Camera Available: true
🔄 Starting QR Scanner...
✅ QR Reader container found
✅ Html5Qrcode instance created
📹 Requesting camera access with constraints: {...}
✅ QR Scanner started successfully
```

### When QR Detected
```
✅ QR Code Detected: VITB-12345
📍 Extracted Data: VITB-12345
🛑 Stopping QR scanner...
✅ Scanner stopped successfully
✅ Scanner cleared
Scanning QR Code - RegNo: VITB-12345
```

### When Attendance Marked
```
✅ Attendance marked successfully for: VITB-12345
```

### Error Logs
```
❌ Camera Error Details: {
  name: "NotAllowedError",
  message: "Permission denied",
  code: "PermissionDenied"
}
```

---

## Part 6: Troubleshooting

### Issue: "Camera Not Available" Warning

**Causes:**
1. Device has no camera
2. Browser doesn't support getUserMedia
3. Camera is disabled in OS settings

**Solutions:**
- Use "Upload QR Image" button instead
- Try different browser
- Check Device Manager → enable camera
- Use mobile device with built-in camera

---

### Issue: Permission Denied / "Allow" Button Not Appearing

**Causes:**
1. Using `http://` instead of `localhost` or `https://`
2. Browser permission blocked permanently
3. Camera in use by another application

**Solutions:**
1. Use `http://localhost:3000` (not IP address)
2. Reset browser permissions:
   - Chrome: Settings → Privacy → Site Settings → Camera → Clear all
   - Firefox: Preferences → Privacy → Permissions → reset Camera
3. Close other camera apps (Zoom, Discord, etc.)
4. Restart browser

---

### Issue: QR Code Not Detected (Endless Scanning)

**Causes:**
1. QR code too small or too far away
2. Poor lighting (too dark or too bright)
3. QR code angle wrong (tilted)
4. Camera focus not on QR code
5. Invalid/corrupted QR code

**Solutions:**
1. Move QR code closer (6-12 inches from camera)
2. Improve lighting - use lamp or natural light
3. Keep QR code straight and flat perpendicular to camera
4. Let camera auto-focus (wait 1-2 seconds)
5. Regenerate QR code if corrupted

---

### Issue: "Student Not Found in Database"

**Causes:**
1. Student QR code not registered in Firestore
2. Student registration number case mismatch
3. Student record deleted

**Solutions:**
1. Verify student has generated QR code in profile
2. Check Firestore: `students` collection
3. Ensure student registration number stored in UPPERCASE
4. Re-register student if needed

---

### Issue: "Already Marked Today"

**Causes:**
1. Student scanned multiple times
2. Trying to scan same QR code again

**Solutions:**
1. This is expected behavior (prevents duplicate attendance)
2. Move to next student
3. Reset attendance for specific student in admin panel if needed

---

## Part 7: End-to-End Test Checklist

- [ ] Device has working camera
- [ ] Using `http://localhost:3000`
- [ ] Student QR code generated and saved to Firestore
- [ ] Faculty login successful
- [ ] Navigated to "Scan Attendance" page
- [ ] "Scan QR using Camera" button visible
- [ ] Browser permission prompt appears on click
- [ ] Permission granted successfully
- [ ] Camera preview opens
- [ ] QR code scanned successfully
- [ ] "Student Detected" green card appears
- [ ] Attendance Summary updates (Present ↑, Absent ↓)
- [ ] Console shows "✅ Attendance marked successfully"
- [ ] Can scan multiple students today
- [ ] Already-marked students show "⚠️ Already Marked Today"

---

## Part 8: Production Deployment

### HTTPS Requirement
Camera access **requires HTTPS** in production:
```
✅ https://yourdomain.com
❌ http://yourdomain.com (won't work)
```

### SSL Certificate
- Get free SSL from Let's Encrypt
- Install on web server
- Update all URLs to `https://`

### Camera Permissions
- Users see permission prompt on first camera access
- Permission remembered per device/browser
- Users can revoke in settings anytime

---

## Part 9: Faculty QR Attendance Features

### 1. Real-Time Statistics
- Total students in class
- Present count (updates instantly)
- Absent count (calculated: total - present)
- Refreshes every 5 seconds

### 2. Duplicate Prevention
- Same QR scanned twice = "Already Marked Today" message
- Prevents accidental duplicate attendance
- Reset attendance by date in admin panel if needed

### 3. Multiple Scanning Methods
- **Camera:** Primary method (fastest)
- **Upload:** Fallback if camera fails

### 4. Error Handling
All error cases handled with user-friendly messages:
- Permission denied
- Camera in use
- No QR code found
- Student not registered
- Invalid QR format

---

## Part 10: Student Profile Setup (For QR Generation)

### Student Must Complete:

1. **Login to Dashboard**
2. **Go to Student Profile**
3. **Fill Information:**
   - Name
   - Registration Number (UPPERCASE, e.g., VITB-12345)
   - Email
   - Phone
   - Department
   - Profile Photo (optional)
4. **Click "Generate QR Code"**
5. **QR Code Generated** with embedded registration number
6. **Saved to Firestore** at: `students/{REGISTRATION_NUMBER}`

### Check in Firestore:
```
Collection: students
Document: VITB-12345
Fields:
  - name: "John Doe"
  - regNo: "VITB-12345"
  - email: "john@vit.edu"
  - phone: "9876543210"
  - qrData: "VITB-12345"
```

---

## Part 11: Common QR Code Data Formats

The QR code contains the registration number:
- Format: `VITB-12345`
- All UPPERCASE
- Examples:
  - `VITB-20001`
  - `VITB-21050`
  - `CSE-12345`

---

## Part 12: Testing Different Scenarios

### Test 1: First-Time Scan
1. Faculty: Scan new student QR
2. Expected: ✅ Attendance marked
3. Verify: Present count increases

### Test 2: Duplicate Scan
1. Scan same student again immediately
2. Expected: ⚠️ "Already Marked Today"
3. Verify: Present count doesn't increase again

### Test 3: Multiple Students
1. Scan 5-10 different students
2. Expected: Each marked successfully
3. Verify: Present count = number of unique scans

### Test 4: Invalid Student
1. Create QR with unregistered student ID
2. Expected: ❌ "Student Not Found"
3. Verify: Attendance NOT marked

### Test 5: Upload Fallback
1. Save generated QR as image
2. Click "Upload QR Image"
3. Select the image file
4. Expected: Same result as camera scan

---

## Part 13: Performance Notes

- Scanning FPS: 10 (good balance between speed and accuracy)
- Detection time: Usually 2-5 seconds
- Works with various QR codes (generated, printed, digital displays)
- Handles different lighting conditions reasonably well

---

## Part 14: Support & Reporting Issues

### If Camera Still Doesn't Work:

1. **Check Browser Compatibility:**
   - Chrome ✅ (best support)
   - Firefox ✅
   - Safari ✅
   - Edge ✅

2. **Check Device:**
   - Run: `navigator.mediaDevices.getUserMedia` in console
   - Should return `Promise` (not undefined)

3. **Check Firestore:**
   - Verify students collection exists
   - Verify test student has proper registration number (UPPERCASE)

4. **Check Network:**
   - Ensure Firebase connection working
   - Check Firestore rules allow read/write access

5. **Enable Debug Logging:**
   - All logs visible in browser console (F12)
   - Watch for specific error messages
   - Report errors with console screenshots

---

## Quick Start Command

```bash
# Terminal 1: Start Development Server
npm start

# Open browser
http://localhost:3000

# Login as Faculty
# Navigate to "Scan Attendance"
# Click "Scan QR using Camera"
# Select camera in permission prompt
# Position student QR code
# Wait for detection (2-5 seconds)
# ✅ Attendance marked!
```

---

**Last Updated:** February 22, 2026  
**Status:** ✅ Production Ready  
**Supported Browsers:** Chrome, Firefox, Safari, Edge  
**Requirements:** Camera device + HTTPS/Localhost + Firestore

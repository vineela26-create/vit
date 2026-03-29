a# QR Camera Not Working - Step-by-Step Debugging

## STEP 1: Open Browser Console

### Windows:
- Press **F12** on keyboard
- Click **Console** tab at the top

### Mac:
- Press **Cmd + Option + J**
- Should open Console immediately

---

## STEP 2: Clear Old Logs

1. In Console, click the **trash/circle icon** to clear logs
2. You should see an empty console now

---

## STEP 3: Refresh the Page

1. Press **Ctrl+R** (Windows) or **Cmd+R** (Mac)
2. Wait for page to fully load
3. You should see a few messages in console

---

## STEP 4: Go to Scan Attendance Page

1. Login as Faculty (if not already logged in)
2. Click **"Scan Attendance"** in sidebar
3. Wait for page to load
4. Look at console - you should see:

```
🔍 Checking camera availability...
✅ Camera device available
```

**IMPORTANT:** Take a screenshot or copy these messages from console

---

## STEP 5: Click "Scan QR using Camera" Button

1. On Scan Attendance page, click the **📷 Scan QR using Camera** button
2. **Watch the Console carefully** - new messages will appear
3. Write down or screenshot ALL messages you see

---

## STEP 6: Report What You See

### Tell me EXACTLY what appears in console:

**Option A - If it works:**
```
✅ QR Scanner started successfully
```
(Then it's waiting for QR code)

**Option B - If it shows an error:**
```
❌ CAMERA ERROR CAUGHT:
   Error Name: [WHAT IS THIS?]
   Error Message: [WHAT IS THIS?]
   Error Code: [WHAT IS THIS?]
```

**Option C - If nothing happens:**
- No new messages appear in console
- Tell me this

**Option D - If permission prompt appears:**
- Screenshot the permission prompt
- Tell me what buttons you see

---

## STEP 7: Common Issues & Quick Fixes

### Issue: No permission prompt appears

**Try this:**
1. Close browser completely
2. Open fresh browser window
3. Go to `http://localhost:3000`
4. Login to Faculty
5. Go to Scan Attendance
6. Click Scan QR button
7. Permission should appear now

---

### Issue: Permission says "Block"

**Try this:**
1. Click address bar lock icon (left of URL)
2. Find Camera permission
3. Click dropdown, change to "Allow"
4. Refresh page
5. Try scanning again

---

### Issue: Dark/black video but no detection

**Try this:**
1. Improve lighting (turn on lamp)
2. Get QR code closer to camera
3. Hold QR code steady for 5 seconds
4. Check console for: `✅ QR Code Detected`

---

### Issue: "Already Marked Today" appears

**This is NORMAL!**
- Student can only be marked once per day
- Try with different student QR code

---

## STEP 8: Send Me This Information

**Copy-paste from your console and tell me:**

1. Browser you're using: Chrome / Firefox / Safari / Edge
2. Device: Windows PC / Mac / Laptop / Desktop
3. Do you have a camera? Yes / No (plug in USB if no camera)
4. When you click "Scan QR" button, what appears in console?

**Copy the EXACT error message or messages you see**

---

## STEP 9: Test Camera is Working

**Run this in console** (copy-paste the code):

```javascript
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then(stream => {
    console.log("✅✅✅ CAMERA WORKS! ✅✅✅");
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => {
    console.error("❌❌❌ CAMERA FAILED:", err.name, "-", err.message);
  });
```

**Tell me:**
- Do you see ✅ CAMERA WORKS message?
- Or do you see ❌ error message?
- What is the exact error?

---

## STEP 10: List All Cameras

**Run this in console**:

```javascript
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    console.log("🎥 All Devices:");
    devices.forEach(device => {
      console.log("Type:", device.kind, "| Label:", device.label || "unknown");
    });
  });
```

**Tell me:**
- What devices are listed?
- Is there a camera in the list?
- If no camera, you need USB webcam

---

## STEP 11: Check URL is Correct

**In address bar, you should see:**
- ✅ `http://localhost:3000`
- ❌ NOT `http://192.168.x.x:3000`
- ❌ NOT `http://127.0.0.1:3000`

If using wrong URL, that's why camera doesn't work!

**Fix:** Go to exactly: `http://localhost:3000`

---

## STEP 12: Generate Test Student QR

Before testing scan:

1. Login as **Student**
2. Go to **"Student QR"** page
3. Click **"Generate QR Code"** button
4. QR code appears on screen
5. **Take a screenshot** of the QR code

Now use this to test faculty scanning.

---

## Final Checklist

- [ ] F12 console open and cleared
- [ ] Page refreshed
- [ ] Using `http://localhost:3000` (exact URL)
- [ ] Logged in as Faculty
- [ ] On "Scan Attendance" page
- [ ] Console shows: `✅ Camera device available`
- [ ] Have a student QR code ready (from Student QR section)
- [ ] Ready to click Scan QR button and report what happens

---

## What to Do Now

1. **Follow Steps 1-6 above** carefully
2. **Copy the exact error message** from console
3. **Tell me:**
   - What error appears?
   - Browser name?
   - Device type?
4. **I will fix it** based on your error

---

**Reply with the console error message and I'll help you fix it!**


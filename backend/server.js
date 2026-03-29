const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// POST /api/create-session
app.post('/api/create-session', async (req, res) => {
  try {
    const { facultyId, subject } = req.body;
    if (!facultyId) {
      return res.status(400).json({ success: false, message: 'facultyId is required' });
    }

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const createdAt = admin.firestore.FieldValue.serverTimestamp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.collection('sessions').doc(sessionId).set({
      facultyId,
      subject: subject || 'General',
      status: 'active',
      createdAt,
      expiresAt,
      sessionId,
    });

    return res.json({ success: true, sessionId, expiresAt });
  } catch (error) {
    console.error('Error creating session:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/mark-attendance
app.post('/api/mark-attendance', async (req, res) => {
  try {
    const { studentId, sessionId } = req.body;

    if (!studentId || !sessionId) {
      return res.status(400).json({ success: false, message: 'studentId and sessionId are required' });
    }

    const normalizedStudentId = studentId.trim().toUpperCase();

    const sessionRef = db.collection('sessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return res.status(400).json({ success: false, message: 'Invalid or expired QR' });
    }

    const sessionData = sessionSnap.data();
    const expiresAt = sessionData.expiresAt ? sessionData.expiresAt.toDate ? sessionData.expiresAt.toDate() : new Date(sessionData.expiresAt) : null;

    if (!expiresAt || expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired QR' });
    }

    const studentRef = db.collection('students').doc(normalizedStudentId);
    const studentSnap = await studentRef.get();

    if (!studentSnap.exists) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const attendanceRef = db.collection('attendance').doc(sessionId);
    const attendanceSnap = await attendanceRef.get();
    const presentList = attendanceSnap.exists ? attendanceSnap.data().presentList || [] : [];

    const alreadyMarked = presentList.some((entry) => entry.studentId === normalizedStudentId);

    if (alreadyMarked) {
      return res.status(409).json({ success: false, message: 'Already marked attendance' });
    }

    const studentData = studentSnap.data();
    const now = new Date();

    await attendanceRef.set(
      {
        sessionId,
        markedAt: admin.firestore.FieldValue.serverTimestamp(),
        presentList: admin.firestore.FieldValue.arrayUnion({
          studentId: normalizedStudentId,
          name: studentData.name || 'Unknown',
          time: now.toLocaleTimeString(),
          status: 'present',
        }),
      },
      { merge: true }
    );

    return res.json({ success: true, message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance via API:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/attendance/:sessionId
app.get('/api/attendance/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId is required' });
    }

    const sessionRef = db.collection('sessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const sessionData = sessionSnap.data();
    const attendanceRef = db.collection('attendance').doc(sessionId);
    const attendanceSnap = await attendanceRef.get();

    const attendanceList = attendanceSnap.exists ? attendanceSnap.data().presentList || [] : [];

    return res.json({
      success: true,
      session: {
        ...sessionData,
        expiresAt: sessionData.expiresAt ? (sessionData.expiresAt.toDate ? sessionData.expiresAt.toDate() : sessionData.expiresAt) : null,
      },
      attendance: attendanceList,
    });
  } catch (error) {
    console.error('Error fetching attendance via API:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/attendance/session/:sessionId (faculty view, list students in session)
app.get('/api/attendance/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }

    const sessionRef = db.collection('sessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();
    if (!sessionSnap.exists) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const attendanceRef = db.collection('attendance').doc(sessionId);
    const attendanceSnap = await attendanceRef.get();
    const attendanceList = attendanceSnap.exists ? attendanceSnap.data().presentList || [] : [];

    return res.json({
      success: true,
      session: sessionSnap.data(),
      attendance: attendanceList,
    });
  } catch (error) {
    console.error('Error fetching session attendance:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/attendance/mark
// Mark attendance for a student (QR payload or manual sessionId)
app.post('/api/attendance/mark', async (req, res) => {
  try {
    const { studentId, qrData, qrString, sessionId: manualSessionId } = req.body;

    if (!studentId) {
      return res.status(401).json({ success: false, message: 'Student not logged in. Please login first.' });
    }

    const normalizedStudentId = studentId.trim().toUpperCase();

    let sessionId = null;
    let busId = null;
    let date = null;
    let expiryTime = null;

    if (qrData) {
      sessionId = qrData.sessionId || qrData.session_id;
      busId = qrData.busId || qrData.bus_id;
      date = qrData.date;
      expiryTime = qrData.expiryTime || qrData.expiry_time;
    } else if (qrString) {
      try {
        const parsed = JSON.parse(qrString);
        sessionId = parsed.sessionId || parsed.session_id;
        busId = parsed.busId || parsed.bus_id;
        date = parsed.date;
        expiryTime = parsed.expiryTime || parsed.expiry_time;
      } catch (e) {
        sessionId = qrString.trim();
      }
    }

    sessionId = sessionId || manualSessionId;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required.' });
    }

    const sessionRef = db.collection('sessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return res.status(400).json({ success: false, message: 'Invalid or expired QR code' });
    }

    const sessionData = sessionSnap.data();

    if (!expiryTime) {
      const expiresAt = sessionData.expiresAt ? (sessionData.expiresAt.toDate ? sessionData.expiresAt.toDate() : new Date(sessionData.expiresAt)) : null;
      expiryTime = expiresAt ? expiresAt.toISOString() : null;
    }

    if (!expiryTime) {
      return res.status(400).json({ success: false, message: 'Invalid or expired QR code' });
    }

    const expiryDate = new Date(expiryTime);
    if (Number.isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired QR code' });
    }

    const studentRef = db.collection('students').doc(normalizedStudentId);
    const studentSnap = await studentRef.get();

    if (!studentSnap.exists) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const attendanceRef = db.collection('attendance').doc(sessionId);
    const attendanceSnap = await attendanceRef.get();
    const presentList = attendanceSnap.exists ? attendanceSnap.data().presentList || [] : [];

    const alreadyMarked = presentList.some((entry) => (entry.studentId || entry.regNo || '').toUpperCase() === normalizedStudentId);

    if (alreadyMarked) {
      return res.status(409).json({ success: false, message: 'Already marked attendance for this session' });
    }

    const studentData = studentSnap.data();
    const now = new Date();

    await attendanceRef.set(
      {
        sessionId,
        busId: busId || sessionData.busId || sessionData.bus_id || 'unknown',
        date: date || sessionData.date || new Date().toISOString().split('T')[0],
        markedAt: admin.firestore.FieldValue.serverTimestamp(),
        presentList: admin.firestore.FieldValue.arrayUnion({
          studentId: normalizedStudentId,
          name: studentData.name || 'Unknown',
          time: now.toISOString(),
          displayTime: now.toLocaleTimeString(),
          status: 'present'
        })
      },
      { merge: true }
    );

    return res.json({ success: true, message: '✅ Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/faculty/attendance/session/:session_id
// Get attendance list for a specific session
app.get('/api/faculty/attendance/session/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Get session data
    const sessionRef = db.collection('sessions').doc(session_id);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const sessionData = sessionSnap.data();

    // Get today's attendance
    const today = new Date().toISOString().split('T')[0];
    const attendanceRef = db.collection('attendance').doc(today);
    const attendanceSnap = await attendanceRef.get();

    if (!attendanceSnap.exists) {
      return res.json({
        success: true,
        session: sessionData,
        attendance: []
      });
    }

    const attendanceData = attendanceSnap.data();
    const sessionAttendance = attendanceData.presentList?.filter(
      student => student.sessionId === session_id
    ) || [];

    res.json({
      success: true,
      session: sessionData,
      attendance: sessionAttendance
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bus Attendance API is running' });
});

app.listen(PORT, () => {
  console.log(`Bus Attendance API server running on port ${PORT}`);
});
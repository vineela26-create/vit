// Optional MongoDB / Mongoose schema for Attendance if you migrate from Firestore to MongoDB
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true, uppercase: true, trim: true },
  sessionId: { type: String, required: true, trim: true },
  busId: { type: String, required: true, trim: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
}, {
  collection: 'attendance'
});

module.exports = mongoose.model('Attendance', AttendanceSchema);

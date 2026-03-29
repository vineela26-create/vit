import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./faculty/Sidebar";
import Topbar from "./faculty/Topbar";
import FacultyDashboard from "./faculty/FacultyDashboard";
import ScanAttendance from "./faculty/ScanAttendance";
import AttendanceRecords from "./faculty/AttendanceRecords";
import AuthPage from "./auth/AuthPage";
import Home from "./Home";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDashboard from "./student/StudentDashboard";
import "./faculty/faculty.css";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Landing Page First */}
        <Route path="/" element={<Home />} />

        {/* ✅ Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Faculty */}
        <Route
          path="/faculty/*"
          element={
            <ProtectedRoute>
              <div className="dashboard-wrapper">
                <Topbar />
                <Sidebar />

                <div className="faculty-main-content">
                  <Routes>
                    <Route path="dashboard" element={<FacultyDashboard />} />
                    <Route path="scan" element={<ScanAttendance />} />
                    <Route path="records" element={<AttendanceRecords />} />
                    <Route path="*" element={<FacultyDashboard />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}
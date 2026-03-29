import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase"; 
import { doc, getDoc } from "firebase/firestore";

export default function Sidebar() {
  const [userName, setUserName] = useState("Faculty User");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.name || user.displayName || "Faculty User");
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="faculty-sidebar">
      <div className="profile-section">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2f66e0&color=fff&size=120&bold=true`}
          alt="Profile"
          className="profile-img"
        />
        <h3>{userName}</h3>
        <p className="faculty-label">Faculty</p>
        <p className="faculty-id">ID: VITB-FACULTY</p>
      </div>

      <nav className="sidebar-menu">
        <NavLink 
          to="/faculty/dashboard" 
          className={({isActive}) => isActive ? "sidebar-btn active" : "sidebar-btn"}
        >
          <span className="icon">🏠</span>
          <span className="label">Dashboard</span>
          <span className="arrow">›</span>
        </NavLink>
        
        <NavLink 
          to="/faculty/scan" 
          className={({isActive}) => isActive ? "sidebar-btn active" : "sidebar-btn"}
        >
          <span className="icon">📷</span>
          <span className="label">Scan Attendance</span>
          <span className="arrow">›</span>
        </NavLink>
        
        <NavLink 
          to="/faculty/records" 
          className={({isActive}) => isActive ? "sidebar-btn active" : "sidebar-btn"}
        >
          <span className="icon">📊</span>
          <span className="label">Attendance Records</span>
          <span className="arrow">›</span>
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span className="icon">🚪</span>
        <span className="label">Logout</span>
      </button>
    </div>
  );
}
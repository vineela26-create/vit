import React from "react";
import logo from "../assets/vitb.png";
import "../faculty/faculty.css";

export default function Topbar() {
  return (
    <div className="faculty-topbar">
      <img src={logo} alt="VITB Logo" />
      <h2>Vishnu Institute of Technology and Business</h2>
    </div>
  );
}


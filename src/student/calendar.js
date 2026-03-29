// Calendar.js
import React from "react";
import "./student.css"

export default function Calendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = today.toLocaleString("default", { month: "long" });

  const blanks = Array.from({ length: firstDay });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="right-panel">
      <div className="calendar-box">
        <h3>{monthName} {year}</h3>

        <div className="calendar-grid">

          {/* Week Days */}
          <div className="day-name">Sun</div>
          <div className="day-name">Mon</div>
          <div className="day-name">Tue</div>
          <div className="day-name">Wed</div>
          <div className="day-name">Thu</div>
          <div className="day-name">Fri</div>
          <div className="day-name">Sat</div>

          {/* Empty slots */}
          {blanks.map((_, i) => (
            <div key={"blank" + i}></div>
          ))}

          {/* Dates */}
          {days.map((day) => (
            <div
              key={day}
              className={day === today.getDate() ? "today" : ""}
            >
              {day}
            </div>
          ))}
        </div>

        <p className="today-text">
          Today: <strong>{today.toDateString()}</strong>
        </p>
      </div>
    </div>
  );
}
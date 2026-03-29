import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AttendanceRecords() {
  const [list, setList] = useState([]);
  // searchQuery is the committed term used to filter records
  const [searchQuery, setSearchQuery] = useState("");
  // searchInput is the text currently in the textbox; only when Enter is pressed
  // do we update searchQuery.
  const [searchInput, setSearchInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "attendance", selectedDate));
      if (snap.exists()) {
        setList(snap.data().presentList || []);
      } else {
        setList([]);
      }
      // clear search when new date is selected
      setSearchInput("");
      setSearchQuery("");
      setCurrentPage(1); // Reset to first page when date changes
    };
    fetch();
  }, [selectedDate]);

  const filteredList = list.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.regNo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = filteredList.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="attendance-records-page">
      <h1>Attendance Records</h1>
      
      <div className="records-date-header">
        <h2>{formatDate(selectedDate)}</h2>
      </div>

      <div className="total-attendance-card">
        <div className="total-attendance-content">
          <span className="total-icon">👥</span>
          <div>
            <h3>Total Attendance Today</h3>
            <p className="total-count">{list.length}</p>
          </div>
          <span className="check-icon">✅</span>
        </div>
      </div>

      <div className="records-filters">
        <input
          type="text"
          placeholder="Search student (press Enter)"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearchQuery(searchInput);
              setCurrentPage(1);
            }
          }}
          className="search-input"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-filter"
        />
      </div>

      <div className="records-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Register Number</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">No attendance records found</td>
              </tr>
            ) : (
              paginatedList.map((s, i) => (
                <tr key={i}>
                  <td>{startIndex + i + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.regNo}</td>
                  <td>{s.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <div className="pagination-controls">
            <button
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
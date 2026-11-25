import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AttendanceForm from "../components/attendanceform";
import API from "../services/api";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Edit State
  const [editAttendance, setEditAttendance] = useState(null);

  // Search State
  const [search, setSearch] = useState("");

  // ================= FETCH ATTENDANCE =================
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance");
      setAttendance(res.data.attendance || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ================= AFTER ADD / UPDATE =================
  const handleAttendanceAdded = async () => {
    await fetchAttendance();
    setShowForm(false);
    setEditAttendance(null);
  };

  // ================= EDIT =================
  const handleEdit = (record) => {
    setEditAttendance(record);
    setShowForm(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/attendance/${id}`);

      alert("Attendance deleted successfully!");

      fetchAttendance();
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  // ================= SEARCH =================
  const filteredAttendance = attendance.filter((record) =>
    record.memberName.toLowerCase().includes(search.toLowerCase()) ||
    record.trainerName.toLowerCase().includes(search.toLowerCase()) ||
    record.status.toLowerCase().includes(search.toLowerCase()) ||
    new Date(record.date)
      .toLocaleDateString()
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
        <Layout>
          <h2>Attendance</h2>
          <hr />

          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              setEditAttendance(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Close Form" : "Mark Attendance"}
          </button>

          {/* Search */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Member, Trainer, Status or Date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {showForm && (
            <AttendanceForm
              onAttendanceAdded={handleAttendanceAdded}
              editAttendance={editAttendance}
            />
          )}

          <table className="table table-bordered table-striped mt-4">
            <thead className="table-dark">
              <tr>
                <th>Member</th>
                <th>Trainer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.length > 0 ? (
                filteredAttendance.map((record) => (
                  <tr key={record._id}>
                    <td>{record.memberName}</td>
                    <td>{record.trainerName}</td>
                    <td>
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td>{record.status}</td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(record)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(record._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Attendance Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
    </Layout>
  );
}

export default Attendance;
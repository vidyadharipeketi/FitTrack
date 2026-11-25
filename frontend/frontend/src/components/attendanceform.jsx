import { useState, useEffect } from "react";
import API from "../services/api";

function AttendanceForm({ onAttendanceAdded, editAttendance }) {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const [formData, setFormData] = useState({
    memberName: "",
    trainerName: "",
    date: "",
    status: "Present",
  });

  // ================= FETCH MEMBERS =================
  useEffect(() => {
    fetchMembers();
    fetchTrainers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await API.get("/members");
      setMembers(res.data.members || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrainers = async () => {
    try {
      const res = await API.get("/trainers");
      setTrainers(res.data.trainers || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= LOAD DATA FOR EDIT =================
  useEffect(() => {
    if (editAttendance) {
      setFormData({
        memberName: editAttendance.memberName || "",
        trainerName: editAttendance.trainerName || "",
        date: editAttendance.date
          ? editAttendance.date.substring(0, 10)
          : "",
        status: editAttendance.status || "Present",
      });
    } else {
      setFormData({
        memberName: "",
        trainerName: "",
        date: "",
        status: "Present",
      });
    }
  }, [editAttendance]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editAttendance) {
        await API.put(`/attendance/${editAttendance._id}`, formData);
        alert("Attendance updated successfully!");
      } else {
        await API.post("/attendance", formData);
        alert("Attendance marked successfully!");
      }

      setFormData({
        memberName: "",
        trainerName: "",
        date: "",
        status: "Present",
      });

      if (onAttendanceAdded) {
        await onAttendanceAdded();
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  return (
    <form className="card p-4 shadow mb-4" onSubmit={handleSubmit}>
      <h3 className="mb-4">
        {editAttendance ? "Edit Attendance" : "Mark Attendance"}
      </h3>

      {/* Member */}
      <div className="mb-3">
        <label className="form-label">Member</label>

        <select
          name="memberName"
          className="form-select"
          value={formData.memberName}
          onChange={handleChange}
          required
        >
          <option value="">Select Member</option>

          {members.map((member) => (
            <option key={member._id} value={member.fullName}>
              {member.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Trainer */}
      <div className="mb-3">
        <label className="form-label">Trainer</label>

        <select
          name="trainerName"
          className="form-select"
          value={formData.trainerName}
          onChange={handleChange}
          required
        >
          <option value="">Select Trainer</option>

          {trainers.map((trainer) => (
            <option key={trainer._id} value={trainer.fullName}>
              {trainer.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div className="mb-3">
        <label className="form-label">Date</label>

        <input
          type="date"
          name="date"
          className="form-control"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      {/* Status */}
      <div className="mb-3">
        <label className="form-label">Status</label>

        <select
          name="status"
          className="form-select"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      <button type="submit" className="btn btn-success">
        {editAttendance ? "Update Attendance" : "Mark Attendance"}
      </button>
    </form>
  );
}

export default AttendanceForm;
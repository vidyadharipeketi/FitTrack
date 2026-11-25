import { useState, useEffect } from "react";
import API from "../services/api";

function TrainerForm({ onTrainerAdded, editTrainer }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    salary: "",
  });

  // ================= LOAD TRAINER DATA FOR EDIT =================
  useEffect(() => {
    if (editTrainer) {
      setFormData({
        fullName: editTrainer.fullName || "",
        email: editTrainer.email || "",
        phone: editTrainer.phone || "",
        specialization: editTrainer.specialization || "",
        experience: editTrainer.experience || "",
        salary: editTrainer.salary || "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        salary: "",
      });
    }
  }, [editTrainer]);

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
      if (editTrainer) {
        // UPDATE TRAINER
        await API.put(`/trainers/${editTrainer._id}`, formData);

        alert("Trainer updated successfully!");
      } else {
        // ADD TRAINER
        await API.post("/trainers", formData);

        alert("Trainer added successfully!");
      }

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        salary: "",
      });

      if (onTrainerAdded) {
        await onTrainerAdded();
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
        {editTrainer ? "Edit Trainer" : "Add Trainer"}
      </h3>

      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          name="fullName"
          className="form-control"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input
          type="text"
          name="phone"
          className="form-control"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Specialization</label>
        <input
          type="text"
          name="specialization"
          className="form-control"
          value={formData.specialization}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Experience (Years)</label>
        <input
          type="number"
          name="experience"
          className="form-control"
          value={formData.experience}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Salary</label>
        <input
          type="number"
          name="salary"
          className="form-control"
          value={formData.salary}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-success">
        {editTrainer ? "Update Trainer" : "Save Trainer"}
      </button>
    </form>
  );
}

export default TrainerForm;
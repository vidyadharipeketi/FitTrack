import { useState, useEffect } from "react";
import API from "../services/api";

function MembershipForm({ onMembershipAdded, editMembership }) {
  const [formData, setFormData] = useState({
    planName: "",
    duration: "",
    price: "",
    description: "",
  });

  // ================= LOAD MEMBERSHIP FOR EDIT =================
  useEffect(() => {
    if (editMembership) {
      setFormData({
        planName: editMembership.planName || "",
        duration: editMembership.duration || "",
        price: editMembership.price || "",
        description: editMembership.description || "",
      });
    } else {
      setFormData({
        planName: "",
        duration: "",
        price: "",
        description: "",
      });
    }
  }, [editMembership]);

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
      if (editMembership) {
        // UPDATE MEMBERSHIP
        await API.put(
          `/memberships/${editMembership._id}`,
          formData
        );

        alert("Membership Plan updated successfully!");
      } else {
        // ADD MEMBERSHIP
        await API.post("/memberships", formData);

        alert("Membership Plan added successfully!");
      }

      setFormData({
        planName: "",
        duration: "",
        price: "",
        description: "",
      });

      if (onMembershipAdded) {
        await onMembershipAdded();
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
        {editMembership ? "Edit Membership Plan" : "Add Membership Plan"}
      </h3>

      <div className="mb-3">
        <label className="form-label">Plan Name</label>
        <input
          type="text"
          name="planName"
          className="form-control"
          value={formData.planName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Duration</label>
        <input
          type="text"
          name="duration"
          className="form-control"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-success">
        {editMembership ? "Update Membership" : "Save Membership"}
      </button>
    </form>
  );
}

export default MembershipForm;
import { useState, useEffect } from "react";
import API from "../services/api";

function MemberForm({ onMemberAdded, editMember }) {
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    membershipPlan: "",
    trainerName: "",
    joiningDate: "",
  });

  // ================= FETCH TRAINERS =================
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await API.get("/trainers");
        setTrainers(res.data.trainers || []);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchPlans = async () => {
      try {
        const res = await API.get("/memberships");
        setPlans(res.data.memberships || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTrainers();
    fetchPlans();
  }, []);

  // ================= EDIT MEMBER =================
  useEffect(() => {
    if (editMember) {
      setFormData({
        fullName: editMember.fullName || "",
        email: editMember.email || "",
        phone: editMember.phone || "",
        gender: editMember.gender || "",
        age: editMember.age || "",
        membershipPlan: editMember.membershipPlan || "",
        trainerName: editMember.trainerName || "",
        joiningDate: editMember.joiningDate
          ? editMember.joiningDate.substring(0, 10)
          : "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
        membershipPlan: "",
        trainerName: "",
        joiningDate: "",
      });
    }
  }, [editMember]);

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

    console.log(formData); // Check trainerName in console

    try {
      if (editMember) {
        await API.put(`/members/${editMember._id}`, formData);
        alert("Member updated successfully!");
      } else {
        await API.post("/members", formData);
        alert("Member added successfully!");
      }

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
        membershipPlan: "",
        trainerName: "",
        joiningDate: "",
      });

      if (onMemberAdded) {
        onMemberAdded();
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
    <form onSubmit={handleSubmit}>
      <h4>{editMember ? "Edit Member" : "Add Member"}</h4>

      <input
        className="form-control mb-3"
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <input
        className="form-control mb-3"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        className="form-control mb-3"
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <select
        className="form-select mb-3"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <input
        className="form-control mb-3"
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        required
      />

      <select
        className="form-select mb-3"
        name="membershipPlan"
        value={formData.membershipPlan}
        onChange={handleChange}
        required
      >
        <option value="">Select Membership</option>

        {plans.map((plan) => (
          <option key={plan._id} value={plan.planName}>
            {plan.planName}
          </option>
        ))}
      </select>

      <select
        className="form-select mb-3"
        name="trainerName"
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

      <input
        className="form-control mb-3"
        type="date"
        name="joiningDate"
        value={formData.joiningDate}
        onChange={handleChange}
        required
      />

      <button className="btn btn-success" type="submit">
        {editMember ? "Update Member" : "Save Member"}
      </button>
    </form>
  );
}

export default MemberForm;
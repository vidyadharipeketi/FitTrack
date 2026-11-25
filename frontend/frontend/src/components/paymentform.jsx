import { useState, useEffect } from "react";
import API from "../services/api";

function PaymentForm({ onPaymentAdded, editPayment }) {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);

  const [formData, setFormData] = useState({
    memberName: "",
    membershipPlan: "",
    amount: "",
    paymentDate: "",
    paymentMethod: "",
    paymentStatus: "Paid",
  });

  // Fetch Members & Membership Plans
  useEffect(() => {
    fetchMembers();
    fetchPlans();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await API.get("/members");
      setMembers(res.data.members || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await API.get("/memberships");
      setPlans(res.data.memberships || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Load data for Edit
  useEffect(() => {
    if (editPayment) {
      setFormData({
        memberName: editPayment.memberName || "",
        membershipPlan: editPayment.membershipPlan || "",
        amount: editPayment.amount || "",
        paymentDate: editPayment.paymentDate
          ? editPayment.paymentDate.substring(0, 10)
          : "",
        paymentMethod: editPayment.paymentMethod || "",
        paymentStatus: editPayment.paymentStatus || "Paid",
      });
    } else {
      setFormData({
        memberName: "",
        membershipPlan: "",
        amount: "",
        paymentDate: "",
        paymentMethod: "",
        paymentStatus: "Paid",
      });
    }
  }, [editPayment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editPayment) {
        await API.put(`/payments/${editPayment._id}`, formData);
        alert("Payment updated successfully!");
      } else {
        await API.post("/payments", formData);
        alert("Payment added successfully!");
      }

      if (onPaymentAdded) {
        await onPaymentAdded();
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
        {editPayment ? "Edit Payment" : "Add Payment"}
      </h3>

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

      <div className="mb-3">
        <label className="form-label">Membership Plan</label>
        <select
          name="membershipPlan"
          className="form-select"
          value={formData.membershipPlan}
          onChange={handleChange}
          required
        >
          <option value="">Select Plan</option>
          {plans.map((plan) => (
            <option key={plan._id} value={plan.planName}>
              {plan.planName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Amount</label>
        <input
          type="number"
          name="amount"
          className="form-control"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Payment Date</label>
        <input
          type="date"
          name="paymentDate"
          className="form-control"
          value={formData.paymentDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Payment Method</label>
        <select
          name="paymentMethod"
          className="form-select"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Select Method</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Net Banking">Net Banking</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Payment Status</label>
        <select
          name="paymentStatus"
          className="form-select"
          value={formData.paymentStatus}
          onChange={handleChange}
          required
        >
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <button type="submit" className="btn btn-success">
        {editPayment ? "Update Payment" : "Save Payment"}
      </button>
    </form>
  );
}

export default PaymentForm;
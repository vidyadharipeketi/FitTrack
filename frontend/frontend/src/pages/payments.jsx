import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PaymentForm from "../components/paymentform";
import API from "../services/api";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Edit State
  const [editPayment, setEditPayment] = useState(null);

  // Search State
  const [search, setSearch] = useState("");

  // ================= FETCH PAYMENTS =================
  const fetchPayments = async () => {
    try {
      const res = await API.get("/payments");
      setPayments(res.data.payments || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ================= AFTER ADD / UPDATE =================
  const handlePaymentAdded = async () => {
    await fetchPayments();
    setShowForm(false);
    setEditPayment(null);
  };

  // ================= EDIT =================
  const handleEdit = (payment) => {
    setEditPayment(payment);
    setShowForm(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/payments/${id}`);

      alert("Payment deleted successfully!");

      fetchPayments();
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
  const filteredPayments = payments.filter((payment) =>
    payment.memberName.toLowerCase().includes(search.toLowerCase()) ||
    payment.membershipPlan.toLowerCase().includes(search.toLowerCase()) ||
    payment.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
    payment.paymentStatus.toLowerCase().includes(search.toLowerCase()) ||
    new Date(payment.paymentDate)
      .toLocaleDateString()
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
       <Layout>
          <h2>Payments</h2>
          <hr />

          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              setEditPayment(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Close Form" : "Add Payment"}
          </button>

          {/* Search */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Member, Plan, Method, Status or Date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {showForm && (
            <PaymentForm
              onPaymentAdded={handlePaymentAdded}
              editPayment={editPayment}
            />
          )}

          <table className="table table-bordered table-striped mt-4">
            <thead className="table-dark">
              <tr>
                <th>Member</th>
                <th>Membership Plan</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.memberName}</td>
                    <td>{payment.membershipPlan}</td>
                    <td>₹{payment.amount}</td>
                    <td>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                    <td>{payment.paymentMethod}</td>
                    <td>{payment.paymentStatus}</td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(payment)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(payment._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No Payments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
    </Layout>
  );
}

export default Payments;
import { useEffect, useState } from "react";
 import Layout from "../components/Layout";
import MembershipForm from "../components/membershipform";
import API from "../services/api";

function Memberships() {
  const [memberships, setMemberships] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Edit State
  const [editMembership, setEditMembership] = useState(null);

  // Search State
  const [search, setSearch] = useState("");

  // ================= FETCH MEMBERSHIPS =================
  const fetchMemberships = async () => {
    try {
      const res = await API.get("/memberships");
      setMemberships(res.data.memberships || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  // ================= AFTER ADD / UPDATE =================
  const handleMembershipAdded = async () => {
    await fetchMemberships();
    setShowForm(false);
    setEditMembership(null);
  };

  // ================= EDIT =================
  const handleEdit = (membership) => {
    setEditMembership(membership);
    setShowForm(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this membership plan?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/memberships/${id}`);

      alert("Membership Plan deleted successfully!");

      fetchMemberships();
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  // ================= SEARCH FILTER =================
  const filteredMemberships = memberships.filter((membership) =>
    membership.planName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
          <h2>Membership Plans</h2>
          <hr />

          <div className="d-flex justify-content-between mb-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditMembership(null);
                setShowForm(!showForm);
              }}
            >
              {showForm ? "Close Form" : "Add Membership Plan"}
            </button>

            <input
              type="text"
              className="form-control w-25"
              placeholder="Search Membership..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {showForm && (
            <MembershipForm
              onMembershipAdded={handleMembershipAdded}
              editMembership={editMembership}
            />
          )}

          <table className="table table-bordered table-striped mt-4">
            <thead className="table-dark">
              <tr>
                <th>Plan Name</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMemberships.length > 0 ? (
                filteredMemberships.map((membership) => (
                  <tr key={membership._id}>
                    <td>{membership.planName}</td>
                    <td>{membership.duration}</td>
                    <td>₹{membership.price}</td>
                    <td>{membership.description}</td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(membership)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(membership._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Membership Plans Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
    </Layout>
  );
}

export default Memberships;
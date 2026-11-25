import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MemberForm from "../components/MemberForm";
import API from "../services/api";

function Members() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Edit State
  const [editMember, setEditMember] = useState(null);

  // Search State
  const [search, setSearch] = useState("");

  // ================= FETCH MEMBERS =================
  const fetchMembers = async () => {
    try {
      const res = await API.get("/members");

      console.log("Members received:", res.data.members);

      setMembers(res.data.members || []);
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Unable to fetch members"
        );
      }
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ================= AFTER ADD / UPDATE =================
  const handleMemberAdded = async () => {
    await fetchMembers();
    setShowForm(false);
    setEditMember(null);
  };

  // ================= DELETE MEMBER =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/members/${id}`);

      alert("Member deleted successfully!");

      fetchMembers();
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  // ================= RENEW MEMBER =================
  const handleRenew = async (id) => {
    const confirmRenew = window.confirm(
      "Are you sure you want to renew this member's membership?"
    );

    if (!confirmRenew) return;

    try {
      await API.put(`/members/${id}/renew`);

      alert("Membership renewed successfully!");

      await fetchMembers();
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  // ================= EDIT MEMBER =================
  const handleEdit = (member) => {
    setEditMember(member);
    setShowForm(true);
  };

  // ================= SEARCH =================
  const filteredMembers = members.filter((member) =>
    member.fullName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h2>Members</h2>
      <hr />

      {/* ================= ADD MEMBER ================= */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setEditMember(null);
          setShowForm(!showForm);
        }}
      >
        {showForm ? "Close Form" : "Add Member"}
      </button>

      {/* ================= SEARCH ================= */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search Member by Name..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* ================= MEMBER FORM ================= */}
      {showForm && (
        <MemberForm
          onMemberAdded={handleMemberAdded}
          editMember={editMember}
        />
      )}

      {/* ================= MEMBERS TABLE ================= */}
      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table className="table table-bordered table-striped mt-4">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Membership</th>
              <th>Trainer</th>

              {/* NEW WORKOUT COLUMN */}
              <th>Selected Workouts</th>

              <th>Joining Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member._id}>
                  {/* NAME */}
                  <td>
                    {member.fullName}
                  </td>

                  {/* EMAIL */}
                  <td>
                    {member.email}
                  </td>

                  {/* PHONE */}
                  <td>
                    {member.phone}
                  </td>

                  {/* GENDER */}
                  <td>
                    {member.gender}
                  </td>

                  {/* AGE */}
                  <td>
                    {member.age}
                  </td>

                  {/* MEMBERSHIP */}
                  <td>
                    {member.membershipPlan}
                  </td>

                  {/* TRAINER */}
                  <td>
                    {member.trainerName || "-"}
                  </td>

                  {/* =================================================
                      SELECTED WORKOUTS
                  ================================================= */}
                  <td>
                    {member.assignedWorkouts &&
                    member.assignedWorkouts.length > 0 ? (
                      <div>
                        {member.assignedWorkouts.map(
                          (workout) => (
                            <div
                              key={workout._id}
                              className="mb-2 p-2 rounded"
                              style={{
                                background:
                                  "#f1f5f9",
                                border:
                                  "1px solid #dee2e6",
                              }}
                            >
                              <strong>
                                🏋️{" "}
                                {
                                  workout.workoutName
                                }
                              </strong>

                              <br />

                              <small className="text-muted">
                                Category:{" "}
                                {
                                  workout.category
                                }
                              </small>

                              <br />

                              <small className="text-muted">
                                Duration:{" "}
                                {
                                  workout.duration
                                }{" "}
                                mins
                              </small>

                              <br />

                              <small className="text-muted">
                                Difficulty:{" "}
                                {
                                  workout.difficulty
                                }
                              </small>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">
                        No workouts selected
                      </span>
                    )}
                  </td>

                  {/* JOINING DATE */}
                  <td>
                    {member.joiningDate
                      ? new Date(
                          member.joiningDate
                        ).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </td>

                  {/* EXPIRY DATE */}
                  <td>
                    {member.expiryDate
                      ? new Date(
                          member.expiryDate
                        ).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`badge ${
                        member.status === "Active"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2 mb-1"
                      onClick={() =>
                        handleEdit(member)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-success btn-sm me-2 mb-1"
                      onClick={() =>
                        handleRenew(member._id)
                      }
                    >
                      Renew
                    </button>

                    <button
                      className="btn btn-danger btn-sm mb-1"
                      onClick={() =>
                        handleDelete(member._id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className="text-center"
                >
                  No Members Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Members;
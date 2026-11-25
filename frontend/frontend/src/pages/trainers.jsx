import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TrainerForm from "../components/trainerform";
import API from "../services/api";

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // EDIT STATE
  const [editTrainer, setEditTrainer] = useState(null);

  // SEARCH STATE
  const [search, setSearch] = useState("");

  // ================= FETCH TRAINERS =================
  const fetchTrainers = async () => {
    try {
      const res = await API.get("/trainers");
      setTrainers(res.data.trainers || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // ================= AFTER ADD / UPDATE =================
  const handleTrainerAdded = async () => {
    await fetchTrainers();
    setShowForm(false);
    setEditTrainer(null);
  };

  // ================= DELETE TRAINER =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trainer?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/trainers/${id}`);

      alert("Trainer deleted successfully!");

      fetchTrainers();
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  // ================= EDIT TRAINER =================
  const handleEdit = (trainer) => {
    setEditTrainer(trainer);
    setShowForm(true);
  };

  return (
    <Layout>
          <h2>Trainers</h2>
          <hr />

          <button
            className="btn btn-primary mb-3"
            onClick={() => {
              setEditTrainer(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Close Form" : "Add Trainer"}
          </button>

          {/* Search Box */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search Trainer by Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Trainer Form */}
          {showForm && (
            <TrainerForm
              onTrainerAdded={handleTrainerAdded}
              editTrainer={editTrainer}
            />
          )}

          <table className="table table-bordered table-striped mt-4">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {trainers
                .filter((trainer) =>
                  trainer.fullName
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((trainer) => (
                  <tr key={trainer._id}>
                    <td>{trainer.fullName}</td>
                    <td>{trainer.email}</td>
                    <td>{trainer.phone}</td>
                    <td>{trainer.specialization}</td>
                    <td>{trainer.experience}</td>
                    <td>₹{trainer.salary}</td>
                    <td>{trainer.status}</td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(trainer)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(trainer._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

              {trainers.filter((trainer) =>
                trainer.fullName
                  .toLowerCase()
                  .includes(search.toLowerCase())
              ).length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Trainers Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
    </Layout>
  );
}

export default Trainers;
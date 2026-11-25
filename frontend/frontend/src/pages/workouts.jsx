import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import WorkoutForm from "../components/workoutform";
import API from "../services/api";

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // EDIT STATE
  const [editWorkout, setEditWorkout] = useState(null);

  // SEARCH STATE
  const [search, setSearch] = useState("");

  // Backend URL for workout images
  const IMAGE_BASE_URL = "http://localhost:5000";

  // ================= FETCH WORKOUTS =================
  const fetchWorkouts = async () => {
    try {
      const res = await API.get("/workouts");
      setWorkouts(res.data.workouts || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // ================= AFTER ADD / UPDATE =================
  const handleWorkoutAdded = async () => {
    await fetchWorkouts();
    setShowForm(false);
    setEditWorkout(null);
  };

  // ================= EDIT =================
  const handleEdit = (workout) => {
    setEditWorkout(workout);
    setShowForm(true);

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/workouts/${id}`);

      alert("Workout deleted successfully!");

      await fetchWorkouts();
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
  const filteredWorkouts = workouts.filter(
    (workout) =>
      workout.workoutName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      workout.trainerName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      workout.category
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      workout.difficulty
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <Layout>

      {/* ================= PAGE TITLE ================= */}
      <h2 className="mb-4">Workouts</h2>

      {/* ================= ADD WORKOUT BUTTON ================= */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          if (showForm) {
            setEditWorkout(null);
            setShowForm(false);
          } else {
            setEditWorkout(null);
            setShowForm(true);
          }
        }}
      >
        {showForm ? "Close Form" : "Add Workout"}
      </button>

      {/* ================= WORKOUT FORM ================= */}
      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <WorkoutForm
              onWorkoutAdded={handleWorkoutAdded}
              editWorkout={editWorkout}
            />
          </div>
        </div>
      )}

      {/* ================= SEARCH ================= */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Workout Name, Trainer, Category or Difficulty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= WORKOUT CARDS ================= */}
      <div className="row g-4">

        {filteredWorkouts.length > 0 ? (

          filteredWorkouts.map((workout) => (

            <div
              className="col-xl-4 col-lg-4 col-md-6 col-sm-12"
              key={workout._id}
            >

              {/* ================= WORKOUT CARD ================= */}
              <div className="card workout-card h-100 shadow-sm">

                {/* ================= WORKOUT IMAGE ================= */}
                <div className="workout-image-container">

                  {workout.image ? (

                    <img
                      src={`${IMAGE_BASE_URL}${workout.image}`}
                      alt={workout.workoutName}
                      className="workout-image"
                    />

                  ) : (

                    <div className="workout-no-image">
                      <span>🏋️</span>
                      <p>No Image Available</p>
                    </div>

                  )}

                </div>

                {/* ================= CARD BODY ================= */}
                <div className="card-body d-flex flex-column">

                  {/* WORKOUT NAME */}
                  <h4 className="workout-title">
                    {workout.workoutName}
                  </h4>

                  {/* TRAINER */}
                  <p className="workout-info">
                    <strong>👤 Trainer:</strong>{" "}
                    {workout.trainerName}
                  </p>

                  {/* CATEGORY */}
                  <p className="workout-info">
                    <strong>💪 Category:</strong>{" "}
                    {workout.category}
                  </p>

                  {/* DURATION */}
                  <p className="workout-info">
                    <strong>⏱️ Duration:</strong>{" "}
                    {workout.duration} mins
                  </p>

                  {/* DIFFICULTY */}
                  <p className="workout-info">
                    <strong>⭐ Difficulty:</strong>{" "}
                    {workout.difficulty}
                  </p>

                  {/* DESCRIPTION */}
                  <p className="workout-description">
                    {workout.description}
                  </p>

                  {/* ================= ACTION BUTTONS ================= */}
                  <div className="mt-auto pt-3">

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(workout)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(workout._id)}
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="col-12">
            <div className="alert alert-info text-center">
              No Workouts Found
            </div>
          </div>

        )}

      </div>

    </Layout>
  );
}

export default Workouts;
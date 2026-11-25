import { useState, useEffect } from "react";
import API from "../services/api";

function WorkoutForm({ onWorkoutAdded, editWorkout }) {
  const [trainers, setTrainers] = useState([]);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    workoutName: "",
    trainerName: "",
    category: "",
    duration: "",
    difficulty: "",
    description: "",
  });

  // ================= FETCH TRAINERS =================
  useEffect(() => {
    fetchTrainers();
  }, []);

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
    if (editWorkout) {
      setFormData({
        workoutName: editWorkout.workoutName || "",
        trainerName: editWorkout.trainerName || "",
        category: editWorkout.category || "",
        duration: editWorkout.duration || "",
        difficulty: editWorkout.difficulty || "",
        description: editWorkout.description || "",
      });

      setImage(null);
    } else {
      setFormData({
        workoutName: "",
        trainerName: "",
        category: "",
        duration: "",
        difficulty: "",
        description: "",
      });

      setImage(null);
    }
  }, [editWorkout]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE IMAGE =================
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // FormData is required for image upload
      const data = new FormData();

      data.append("workoutName", formData.workoutName);
      data.append("trainerName", formData.trainerName);
      data.append("category", formData.category);
      data.append("duration", formData.duration);
      data.append("difficulty", formData.difficulty);
      data.append("description", formData.description);

      // Add image only if selected
      if (image) {
        data.append("image", image);
      }

      if (editWorkout) {
        // UPDATE WORKOUT
        await API.put(
          `/workouts/${editWorkout._id}`,
          data
        );

        alert("Workout updated successfully!");
      } else {
        // ADD WORKOUT
        await API.post(
          "/workouts",
          data
        );

        alert("Workout added successfully!");
      }

      // Reset form
      setFormData({
        workoutName: "",
        trainerName: "",
        category: "",
        duration: "",
        difficulty: "",
        description: "",
      });

      setImage(null);

      // Reset file input
      document.getElementById("workoutImage").value = "";

      if (onWorkoutAdded) {
        await onWorkoutAdded();
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
    <div className="card shadow p-4 mb-4">

      <h4 className="mb-4">
        {editWorkout ? "Edit Workout" : "Add Workout"}
      </h4>

      <form onSubmit={handleSubmit}>

        {/* Workout Name */}
        <div className="mb-3">
          <label className="form-label">
            Workout Name
          </label>

          <input
            type="text"
            name="workoutName"
            className="form-control"
            value={formData.workoutName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Trainer */}
        <div className="mb-3">
          <label className="form-label">
            Trainer
          </label>

          <select
            name="trainerName"
            className="form-select"
            value={formData.trainerName}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Trainer
            </option>

            {trainers.map((trainer) => (
              <option
                key={trainer._id}
                value={trainer.fullName}
              >
                {trainer.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">
            Category
          </label>

          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Category
            </option>

            <option value="Strength Training">
              Strength Training
            </option>

            <option value="Cardio">
              Cardio
            </option>

            <option value="Weight Loss">
              Weight Loss
            </option>

            <option value="Muscle Building">
              Muscle Building
            </option>

            <option value="CrossFit">
              CrossFit
            </option>

            <option value="Yoga">
              Yoga
            </option>

            <option value="Zumba">
              Zumba
            </option>

            <option value="HIIT">
              HIIT
            </option>

            <option value="Functional Training">
              Functional Training
            </option>

            <option value="Powerlifting">
              Powerlifting
            </option>
            <option value="BodyBuilding">
              BodyBuilding
            </option>
             <option value="UpperBody">
              UpperBody
            </option>
             <option value="Flexibility">
              Flexibility
            </option>
          </select>
        </div>

        {/* Duration */}
        <div className="mb-3">
          <label className="form-label">
            Duration (Minutes)
          </label>

          <input
            type="number"
            name="duration"
            className="form-control"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        {/* Difficulty */}
        <div className="mb-3">
          <label className="form-label">
            Difficulty
          </label>

          <select
            name="difficulty"
            className="form-select"
            value={formData.difficulty}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Difficulty
            </option>

            <option value="Beginner">
              Beginner
            </option>

            <option value="Intermediate">
              Intermediate
            </option>

            <option value="Advanced">
              Advanced
            </option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">
            Description
          </label>

          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Workout Image */}
        <div className="mb-3">
          <label className="form-label">
            Workout Image
          </label>

          <input
            type="file"
            id="workoutImage"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />

          <small className="text-muted">
            Select a JPG, JPEG, PNG , AVIF or WEBP image.
          </small>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-success"
        >
          {editWorkout
            ? "Update Workout"
            : "Save Workout"}
        </button>

      </form>
    </div>
  );
}

export default WorkoutForm;
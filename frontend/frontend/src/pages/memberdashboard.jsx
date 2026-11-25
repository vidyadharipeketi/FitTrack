import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MemberDashboard() {
  const [member, setMember] = useState(null);
  const [availableWorkouts, setAvailableWorkouts] = useState([]);
  const [selectedWorkoutIds, setSelectedWorkoutIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingWorkouts, setSavingWorkouts] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // GET MEMBER PROFILE
  // =====================================================
  const fetchMyProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/");
        return;
      }

      const res = await API.get("/members/my-profile");

      const memberData = res.data.member;

      setMember(memberData);

      // Get IDs of already assigned workouts
      if (
        memberData.assignedWorkouts &&
        memberData.assignedWorkouts.length > 0
      ) {
        const existingIds = memberData.assignedWorkouts.map(
          (workout) =>
            typeof workout === "object"
              ? workout._id
              : workout
        );

        setSelectedWorkoutIds(existingIds);
      } else {
        setSelectedWorkoutIds([]);
      }
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Session expired. Please login again.");
        navigate("/");
      } else {
        alert(
          error.response?.data?.message ||
            "Unable to load member profile"
        );
      }
    }
  };

  // =====================================================
  // GET AVAILABLE WORKOUTS
  // =====================================================
  const fetchAvailableWorkouts = async () => {
    try {
      const res = await API.get(
        "/members/available-workouts"
      );

      console.log(
        "Available workouts:",
        res.data
      );

      setAvailableWorkouts(
        res.data.workouts ||
          res.data.availableWorkouts ||
          []
      );
    } catch (error) {
      console.log(
        "Workout fetch error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load available workouts"
      );
    }
  };

  // =====================================================
  // LOAD PROFILE + WORKOUTS
  // =====================================================
  useEffect(() => {
    const loadData = async () => {
      await fetchMyProfile();
      await fetchAvailableWorkouts();

      setLoading(false);
    };

    loadData();
  }, []);

  // =====================================================
  // HANDLE WORKOUT SELECTION
  // =====================================================
  const handleWorkoutSelection = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions
    );

    const ids = selectedOptions.map(
      (option) => option.value
    );

    setSelectedWorkoutIds(ids);
  };

  // =====================================================
  // SAVE SELECTED WORKOUTS
  // =====================================================
  const handleSaveWorkouts = async () => {
    try {
      setSavingWorkouts(true);

      const res = await API.put(
        "/members/my-workouts",
        {
          workoutIds: selectedWorkoutIds,
        }
      );

      console.log(
        "Saved workouts:",
        res.data
      );

      if (res.data.member) {
        setMember(res.data.member);

        // Update selected IDs after save
        if (
          res.data.member.assignedWorkouts
        ) {
          const ids =
            res.data.member.assignedWorkouts.map(
              (workout) =>
                typeof workout === "object"
                  ? workout._id
                  : workout
            );

          setSelectedWorkoutIds(ids);
        }
      }

      alert(
        "Workouts saved successfully! 💪"
      );
    } catch (error) {
      console.log(
        "Save workout error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to save workouts"
      );
    } finally {
      setSavingWorkouts(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>
          Loading your profile...
        </h4>
      </div>
    );
  }

  // =====================================================
  // NO MEMBER
  // =====================================================
  if (!member) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Member profile not found.
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      {/* =================================================
          NAVBAR
      ================================================= */}
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">
            🏋️ FitTrack
          </span>

          <button
            className="btn btn-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}
      <div className="container py-4">

        {/* =================================================
            WELCOME
        ================================================= */}
        <div className="mb-4">
          <h2 className="fw-bold">
            Welcome, {member.fullName}! 👋
          </h2>

          <p className="text-muted">
            Here are your FitTrack membership details.
          </p>
        </div>

        {/* =================================================
            PROFILE DETAILS
        ================================================= */}
        <div className="row g-4">

          {/* PERSONAL DETAILS */}
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">

              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  👤 Personal Details
                </h5>
              </div>

              <div className="card-body">

                <p>
                  <strong>Name:</strong>{" "}
                  {member.fullName}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {member.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {member.phone}
                </p>

                <p>
                  <strong>Gender:</strong>{" "}
                  {member.gender}
                </p>

                <p className="mb-0">
                  <strong>Age:</strong>{" "}
                  {member.age}
                </p>

              </div>
            </div>
          </div>

          {/* MEMBERSHIP DETAILS */}
          <div className="col-lg-6">
            <div className="card shadow-sm h-100">

              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  💳 Membership Details
                </h5>
              </div>

              <div className="card-body">

                <p>
                  <strong>Plan:</strong>{" "}
                  {member.membershipPlan}
                </p>

                <p>
                  <strong>Trainer:</strong>{" "}
                  {member.trainerName}
                </p>

                <p>
                  <strong>Joining Date:</strong>{" "}
                  {new Date(
                    member.joiningDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  <strong>Expiry Date:</strong>{" "}
                  {member.expiryDate
                    ? new Date(
                        member.expiryDate
                      ).toLocaleDateString()
                    : "Not Available"}
                </p>

                <p className="mb-0">
                  <strong>Status:</strong>{" "}

                  <span
                    className={`badge ${
                      member.status === "Active"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {member.status}
                  </span>
                </p>

              </div>
            </div>
          </div>

        </div>

        {/* =================================================
            SELECT WORKOUTS
        ================================================= */}
        <div className="card shadow-sm mt-4">

          <div className="card-header bg-warning">
            <h5 className="mb-0 fw-bold">
              🏋️ Select Your Workouts
            </h5>
          </div>

          <div className="card-body">

            <label className="form-label fw-semibold">
              Choose workouts
            </label>

            <select
              className="form-select"
              multiple
              value={selectedWorkoutIds}
              onChange={handleWorkoutSelection}
              style={{
                minHeight: "180px",
              }}
            >
              {availableWorkouts.length > 0 ? (
                availableWorkouts.map(
                  (workout) => (
                    <option
                      key={workout._id}
                      value={workout._id}
                    >
                      {workout.workoutName} -
                      {" "}
                      {workout.category}
                    </option>
                  )
                )
              ) : (
                <option disabled>
                  No workouts available
                </option>
              )}
            </select>

            <small className="text-muted d-block mt-2">
              Hold Ctrl and select multiple
              workouts.
            </small>

            <button
              className="btn btn-primary mt-3"
              onClick={handleSaveWorkouts}
              disabled={savingWorkouts}
            >
              {savingWorkouts
                ? "Saving..."
                : "💾 Save Selected Workouts"}
            </button>

          </div>
        </div>

        {/* =================================================
            MY ASSIGNED WORKOUTS
        ================================================= */}
        <div className="card shadow-sm mt-4">

          <div className="card-header bg-dark text-white">
            <h5 className="mb-0">
              🏋️ My Assigned Workouts
            </h5>
          </div>

          <div className="card-body">

            {member.assignedWorkouts &&
            member.assignedWorkouts.length > 0 ? (

              <div className="row g-4">

                {member.assignedWorkouts.map(
                  (workout) => (

                    <div
                      className="col-lg-4 col-md-6"
                      key={workout._id}
                    >

                      <div className="card h-100 shadow-sm">

                        {/* WORKOUT IMAGE */}
                        {workout.image ? (

                          <img
                            src={`http://localhost:5000${workout.image}`}
                            alt={
                              workout.workoutName
                            }
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                            }}
                          />

                        ) : (

                          <div
                            style={{
                              height: "200px",
                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              background: "#eee",
                              fontSize: "50px",
                            }}
                          >
                            🏋️
                          </div>

                        )}

                        {/* WORKOUT DETAILS */}
                        <div className="card-body">

                          <h5 className="fw-bold">
                            {workout.workoutName}
                          </h5>

                          <p>
                            <strong>
                              Category:
                            </strong>{" "}
                            {workout.category}
                          </p>

                          <p>
                            <strong>
                              Duration:
                            </strong>{" "}
                            {workout.duration} mins
                          </p>

                          <p>
                            <strong>
                              Difficulty:
                            </strong>{" "}
                            {workout.difficulty}
                          </p>

                          <p className="text-muted">
                            {workout.description}
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="alert alert-info mb-0">
                No workouts have been selected yet.
              </div>

            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default MemberDashboard;
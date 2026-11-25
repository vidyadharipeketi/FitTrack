import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-dark bg-primary px-4"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "70px",
        zIndex: 1100,
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo / Project Name */}
        <h4 className="text-white m-0">
          🏋️ FitTrack Gym Management System
        </h4>

        {/* Right Side */}
        <div className="d-flex align-items-center">
          <span className="text-white me-3">
            Welcome, Admin
          </span>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
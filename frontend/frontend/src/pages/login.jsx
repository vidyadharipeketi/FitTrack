import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // Save JWT token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Get user role
      const role = res.data.user.role;

      alert("Login Successful");

      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "member") {
        navigate("/member-dashboard");
      } else if (role === "trainer") {
        navigate("/trainer-dashboard");
      } else {
        alert("Invalid user role");
        navigate("/");
      }

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >

      {/* ================= BACKGROUND VIDEO ================= */}

      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/gym-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>


      {/* ================= DARK OVERLAY ================= */}

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "rgba(0, 0, 0, 0.60)",
          zIndex: 1,
        }}
      ></div>


      {/* ================= LOGIN CARD ================= */}

      <div
        className="card shadow-lg"
        style={{
          width: "340px",
          maxWidth: "100%",
          borderRadius: "18px",
          border: "none",
          padding: "25px",
          background: "rgba(255, 255, 255, 0.96)",
          position: "relative",
          zIndex: 2,
        }}
      >

        {/* ================= LOGO ================= */}

        <div className="text-center mb-4">

          <div
            style={{
              fontSize: "45px",
            }}
          >
            🏋️
          </div>

          <h2
            className="fw-bold mb-1"
            style={{
              color: "#0d6efd",
            }}
          >
            FitTrack
          </h2>

          <p className="text-muted mb-0">
            Gym Management System
          </p>

        </div>


        {/* ================= LOGIN FORM ================= */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Email Address
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              style={{
                height: "45px",
                borderRadius: "8px",
              }}
            />

          </div>


          {/* PASSWORD */}

          <div className="mb-4">

            <label className="form-label fw-semibold">
              Password
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              style={{
                height: "45px",
                borderRadius: "8px",
              }}
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            style={{
              height: "45px",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            Login
          </button>

        </form>


        {/* ================= REGISTER ================= */}

        <p className="text-center mt-4 mb-0">

          Don't have an account?{" "}

          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() =>
              navigate("/register")
            }
          >
            Register
          </button>

        </p>


        <p className="text-center text-muted mt-3 mb-0">
          Welcome to FitTrack 💪
        </p>

      </div>

    </div>
  );
}

export default Login;
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Members", path: "/members" },
    { name: "Trainers", path: "/trainers" },
    { name: "Memberships", path: "/memberships" },
    { name: "Workouts", path: "/workouts" },
    { name: "Attendance", path: "/attendance" },
    { name: "Payments", path: "/payments" }
  ];

  return (
    <div
  className="bg-dark text-white p-3"
  style={{
  width: "250px",
  height: "calc(100vh - 70px)",
  position: "fixed",
  left: 0,
  top: "70px",
  overflowY: "auto",
}}
>
      <h4 className="text-center mb-4">FitTrack</h4>

      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li className="nav-item mb-2" key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path
                  ? "bg-primary text-white rounded"
                  : "text-white"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
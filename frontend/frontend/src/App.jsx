import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Members from "./pages/members";
import Trainers from "./pages/trainers";
import Memberships from "./pages/memberships";
import Workouts from "./pages/workouts";
import Attendance from "./pages/attendance";
import Payments from "./pages/payments";
import MemberDashboard from "./pages/memberdashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN / REGISTER */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN PAGES */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/trainers" element={<Trainers />} />
        <Route path="/memberships" element={<Memberships />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/payments" element={<Payments />} />

        {/* MEMBER PAGE */}
        <Route
          path="/member-dashboard"
          element={<MemberDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
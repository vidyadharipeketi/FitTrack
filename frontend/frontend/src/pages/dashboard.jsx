import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalMembers: 0,
    totalTrainers: 0,
    totalMembershipPlans: 0,
    totalWorkouts: 0,
    totalAttendance: 0,
    totalPayments: 0,
    totalRevenue: 0,
    expiredMemberships: 0,
    expiringSoon: 0,
  });

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setDashboard(res.data.dashboard);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <Layout>
      <h2 className="mb-2">Dashboard</h2>

      <hr />

      <h4>Welcome to FitTrack Gym Management System</h4>

      <p className="text-muted">
        Manage members, trainers, memberships, workouts, attendance and
        payments from one place.
      </p>

      {/* ================= DASHBOARD CARDS ================= */}

      <div className="row mt-4">

        {/* Total Members */}
        <div className="col-md-3 mb-3">
          <div className="card shadow dashboard-card">
            <div className="card-body">
              <div className="dashboard-card-content">
                <div>
                  <h6>Total Members</h6>
                  <h2>{dashboard.totalMembers}</h2>
                </div>

                <span className="dashboard-icon members-icon">
                  👥
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Trainers */}
        <div className="col-md-3 mb-3">
          <div className="card shadow dashboard-card">
            <div className="card-body">
              <div className="dashboard-card-content">
                <div>
                  <h6>Total Trainers</h6>
                  <h2>{dashboard.totalTrainers}</h2>
                </div>

                <span className="dashboard-icon trainers-icon">
                  🏋️
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Plans */}
        <div className="col-md-3 mb-3">
          <div className="card shadow dashboard-card">
            <div className="card-body">
              <div className="dashboard-card-content">
                <div>
                  <h6>Membership Plans</h6>
                  <h2>{dashboard.totalMembershipPlans}</h2>
                </div>

                <span className="dashboard-icon membership-icon">
                  💳
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Workouts */}
        <div className="col-md-3 mb-3">
          <div className="card shadow dashboard-card">
            <div className="card-body">
              <div className="dashboard-card-content">
                <div>
                  <h6>Total Workouts</h6>
                  <h2>{dashboard.totalWorkouts}</h2>
                </div>

                <span className="dashboard-icon workout-icon">
                  💪
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance */}
        <div className="col-md-3 mb-3">
          <div className="card shadow dashboard-card">
            <div className="card-body">
              <div className="dashboard-card-content">
                <div>
                  <h6>Attendance Records</h6>
                  <h2>{dashboard.totalAttendance}</h2>
                </div>

                <span className="dashboard-icon attendance-icon">
                  📅
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="col-md-3 mb-3">
          <div className="card shadow dashboard-card">
            <div className="card-body">
              <div className="dashboard-card-content">
                <div>
                  <h6>Total Payments</h6>
                  <h2>{dashboard.totalPayments}</h2>
                </div>

                <span className="dashboard-icon payment-icon">
                  💰
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="col-md-6 mb-3">
          <div className="card shadow dashboard-card revenue-card">
            <div className="card-body">
              <div className="dashboard-card-content">
                <div>
                  <h6>Total Revenue</h6>
                  <h2>₹ {dashboard.totalRevenue}</h2>
                </div>

                <span className="dashboard-icon revenue-icon">
                  💵
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= MEMBERSHIP ALERTS ================= */}

      <div className="row mt-3">

        {/* Expiring Soon */}
        <div className="col-md-6 mb-3">
          <div className="card shadow alert-card expiry-card">
            <div className="card-body">

              <div className="alert-header">
                <div>
                  <h5>⚠️ Memberships Expiring Soon</h5>

                  <p className="text-muted mb-0">
                    Expiring within the next 7 days
                  </p>
                </div>

                <div className="alert-number warning-number">
                  {dashboard.expiringSoon}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Expired */}
        <div className="col-md-6 mb-3">
          <div className="card shadow alert-card expired-card">
            <div className="card-body">

              <div className="alert-header">
                <div>
                  <h5>🔴 Expired Memberships</h5>

                  <p className="text-muted mb-0">
                    Memberships that have already expired
                  </p>
                </div>

                <div className="alert-number danger-number">
                  {dashboard.expiredMemberships}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </Layout>
  );
}

export default Dashboard;
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");
const Membership = require("../models/Membership");
const Workout = require("../models/Workout");
const Attendance = require("../models/Attendance");
const Payment = require("../models/Payment");

// ================= DASHBOARD =================
const getDashboard = async (req, res) => {
  try {
    // ================= BASIC COUNTS =================

    const totalMembers = await Member.countDocuments();
    const totalTrainers = await Trainer.countDocuments();
    const totalMembershipPlans = await Membership.countDocuments();
    const totalWorkouts = await Workout.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const totalPayments = await Payment.countDocuments();

    // ================= TOTAL REVENUE =================

    const payments = await Payment.find();

    let totalRevenue = 0;

    payments.forEach((payment) => {
      totalRevenue += Number(payment.amount) || 0;
    });

    // ================= MEMBERSHIP EXPIRY =================

    const today = new Date();

    // Start of today
    today.setHours(0, 0, 0, 0);

    // Date after 7 days
    const next7Days = new Date(today);
    next7Days.setDate(next7Days.getDate() + 7);

    // Expired memberships
    const expiredMemberships = await Member.countDocuments({
      expiryDate: {
        $lt: today,
      },
    });

    // Memberships expiring within next 7 days
    const expiringSoon = await Member.countDocuments({
      expiryDate: {
        $gte: today,
        $lte: next7Days,
      },
    });

    // ================= RESPONSE =================

    res.status(200).json({
      success: true,

      dashboard: {
        totalMembers,
        totalTrainers,
        totalMembershipPlans,
        totalWorkouts,
        totalAttendance,
        totalPayments,
        totalRevenue,

        // New expiry information
        expiredMemberships,
        expiringSoon,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getDashboard,
};
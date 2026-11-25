const express = require("express");
const router = express.Router();

// ================= MEMBER CONTROLLER =================
const {
  addMember,
  getAllMembers,
  getMyMemberProfile,
  getAvailableWorkouts,
  assignWorkouts,
  updateMember,
  deleteMember,
  renewMember,
} = require("../controllers/memberController");

// ================= AUTHENTICATION =================
const {
  protect,
  isAdmin,
  isMember,
} = require("../middleware/authMiddleware");

// ================= ADD MEMBER =================
// Admin only
router.post(
  "/",
  protect,
  isAdmin,
  addMember
);

// ================= GET ALL MEMBERS =================
// Admin only
router.get(
  "/",
  protect,
  isAdmin,
  getAllMembers
);

// ================= GET LOGGED-IN MEMBER PROFILE =================
// Member only
router.get(
  "/my-profile",
  protect,
  isMember,
  getMyMemberProfile
);

// ================= GET AVAILABLE WORKOUTS =================
// Member only
router.get(
  "/available-workouts",
  protect,
  isMember,
  getAvailableWorkouts
);

// ================= SELECT MEMBER WORKOUTS =================
// Member only
router.put(
  "/my-workouts",
  protect,
  isMember,
  assignWorkouts
);

// ================= UPDATE MEMBER =================
// Admin only
router.put(
  "/:id",
  protect,
  isAdmin,
  updateMember
);

// ================= RENEW MEMBER =================
// Admin only
router.put(
  "/:id/renew",
  protect,
  isAdmin,
  renewMember
);

// ================= DELETE MEMBER =================
// Admin only
router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteMember
);

module.exports = router;
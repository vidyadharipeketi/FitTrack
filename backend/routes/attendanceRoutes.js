const express = require("express");
const router = express.Router();

const {
  addAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance
} = require("../controllers/attendanceController");

// Import Middleware
const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

// ================= ADD ATTENDANCE =================
// Admin only
router.post("/", protect, isAdmin, addAttendance);

// ================= GET ALL ATTENDANCE =================
// Any logged-in user
router.get("/", protect, getAllAttendance);

// ================= UPDATE ATTENDANCE =================
// Admin only
router.put("/:id", protect, isAdmin, updateAttendance);

// ================= DELETE ATTENDANCE =================
// Admin only
router.delete("/:id", protect, isAdmin, deleteAttendance);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  getDashboard
} = require("../controllers/dashboardController");

// Import Middleware
const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

// ================= DASHBOARD =================
// Admin only
router.get("/", protect, isAdmin, getDashboard);

module.exports = router;
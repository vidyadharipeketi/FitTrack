const express = require("express");
const router = express.Router();

const {
  addMembership,
  getAllMemberships,
  updateMembership,
  deleteMembership
} = require("../controllers/membershipController");

// Import Middleware
const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

// ================= ADD MEMBERSHIP =================
// Admin only
router.post("/", protect, isAdmin, addMembership);

// ================= GET ALL MEMBERSHIPS =================
// Any logged-in user
router.get("/", protect, getAllMemberships);

// ================= UPDATE MEMBERSHIP =================
// Admin only
router.put("/:id", protect, isAdmin, updateMembership);

// ================= DELETE MEMBERSHIP =================
// Admin only
router.delete("/:id", protect, isAdmin, deleteMembership);

module.exports = router;
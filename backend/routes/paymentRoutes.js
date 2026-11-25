const express = require("express");
const router = express.Router();

const {
  addPayment,
  getAllPayments,
  updatePayment,
  deletePayment
} = require("../controllers/paymentController");

// Import Middleware
const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

// ================= ADD PAYMENT =================
// Admin only
router.post("/", protect, isAdmin, addPayment);

// ================= GET ALL PAYMENTS =================
// Any logged-in user
router.get("/", protect, getAllPayments);

// ================= UPDATE PAYMENT =================
// Admin only
router.put("/:id", protect, isAdmin, updatePayment);

// ================= DELETE PAYMENT =================
// Admin only
router.delete("/:id", protect, isAdmin, deletePayment);

module.exports = router;
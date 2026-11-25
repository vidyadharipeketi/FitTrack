const express = require("express");
const router = express.Router();

const {
  addTrainer,
  getAllTrainers,
  updateTrainer,
  deleteTrainer
} = require("../controllers/trainerController");

// Import Middleware
const {
  protect,
  isAdmin
} = require("../middleware/authMiddleware");

// ================= ADD TRAINER =================
// Admin only
router.post("/", protect, isAdmin, addTrainer);

// ================= GET ALL TRAINERS =================
// Any logged-in user
router.get("/", protect, getAllTrainers);

// ================= UPDATE TRAINER =================
// Admin only
router.put("/:id", protect, isAdmin, updateTrainer);

// ================= DELETE TRAINER =================
// Admin only
router.delete("/:id", protect, isAdmin, deleteTrainer);

module.exports = router;
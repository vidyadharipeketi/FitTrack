const express = require("express");
const router = express.Router();

// Workout Controller
const {
  addWorkout,
  getAllWorkouts,
  updateWorkout,
  deleteWorkout,
} = require("../controllers/workoutController");

// Authentication Middleware
const {
  protect,
  isAdmin,
} = require("../middleware/authMiddleware");

// Image Upload Middleware
const upload = require("../middleware/upload");

// ================= ADD WORKOUT =================
// Admin only + Image Upload
router.post(
  "/",
  protect,
  isAdmin,
  upload.single("image"),
  addWorkout
);

// ================= GET ALL WORKOUTS =================
// Any logged-in user
router.get(
  "/",
  protect,
  getAllWorkouts
);

// ================= UPDATE WORKOUT =================
// Admin only + Optional Image Upload
router.put(
  "/:id",
  protect,
  isAdmin,
  upload.single("image"),
  updateWorkout
);

// ================= DELETE WORKOUT =================
// Admin only
router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteWorkout
);

module.exports = router;
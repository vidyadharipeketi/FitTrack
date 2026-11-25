const Workout = require("../models/Workout");

// ================= ADD WORKOUT =================
const addWorkout = async (req, res) => {
  try {
    const {
      workoutName,
      trainerName,
      category,
      duration,
      difficulty,
      description,
    } = req.body;

    // Check required fields
    if (
      !workoutName ||
      !trainerName ||
      !category ||
      !duration ||
      !difficulty ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if workout already exists
    const existingWorkout = await Workout.findOne({
      workoutName,
    });

    if (existingWorkout) {
      return res.status(400).json({
        success: false,
        message: "Workout already exists",
      });
    }

    // ================= IMAGE =================
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    // Create workout
    const workout = await Workout.create({
      workoutName,
      trainerName,
      category,
      duration,
      difficulty,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Workout added successfully",
      workout,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= GET ALL WORKOUTS =================
const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find();

    res.status(200).json({
      success: true,
      count: workouts.length,
      workouts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= UPDATE WORKOUT =================
const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    // Find workout first
    const workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      });
    }

    // Update text fields
    workout.workoutName =
      req.body.workoutName || workout.workoutName;

    workout.trainerName =
      req.body.trainerName || workout.trainerName;

    workout.category =
      req.body.category || workout.category;

    workout.duration =
      req.body.duration || workout.duration;

    workout.difficulty =
      req.body.difficulty || workout.difficulty;

    workout.description =
      req.body.description || workout.description;

    // ================= UPDATE IMAGE =================
    // Only replace image if a new image was selected
    if (req.file) {
      workout.image = `/uploads/${req.file.filename}`;
    }

    await workout.save();

    res.status(200).json({
      success: true,
      message: "Workout updated successfully",
      workout,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ================= DELETE WORKOUT =================
const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const workout = await Workout.findByIdAndDelete(id);

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully",
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
  addWorkout,
  getAllWorkouts,
  updateWorkout,
  deleteWorkout,
};
const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    workoutName: {
      type: String,
      required: true,
      trim: true,
    },

    trainerName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Workout Image
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workout", workoutSchema);
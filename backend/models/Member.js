const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
   //User ID
   userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false,
},
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },

    age: {
      type: Number,
      required: true,
    },

    // ================= MEMBERSHIP =================
    membershipPlan: {
      type: String,
      required: true,
    },

    // ================= TRAINER =================
    trainerName: {
      type: String,
      required: true,
    },

    // ================= WORKOUTS =================
    assignedWorkouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
    ],

    // ================= DATES =================
    joiningDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", memberSchema);
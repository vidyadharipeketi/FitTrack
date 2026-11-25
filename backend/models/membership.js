const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Duration in Months
    duration: {
      type: Number,
      required: true,
      enum: [1, 3, 6, 12], // 1 Month, 3 Months, 6 Months, 12 Months
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Membership", membershipSchema);
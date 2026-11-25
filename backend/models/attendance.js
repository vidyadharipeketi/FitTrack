const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
{
    memberName: {
        type: String,
        required: true
    },

    trainerName: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["Present", "Absent"],
        default: "Present"
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
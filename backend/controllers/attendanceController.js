const Attendance = require("../models/Attendance");

// ================= MARK ATTENDANCE =================
const addAttendance = async (req, res) => {
  try {
    const {
      memberName,
      trainerName,
      date,
      status
    } = req.body;

    if (!memberName || !trainerName || !status) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    const attendance = await Attendance.create({
      memberName,
      trainerName,
      date,
      status
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= GET ALL ATTENDANCE =================
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find();

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= UPDATE ATTENDANCE =================
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= DELETE ATTENDANCE =================
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = {
  addAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance
};
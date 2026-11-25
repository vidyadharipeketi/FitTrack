const Trainer = require("../models/Trainer");

// ================= ADD TRAINER =================
const addTrainer = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      specialization,
      experience,
      salary
    } = req.body;

    // Check required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !specialization ||
      !experience ||
      !salary
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields"
      });
    }

    // Check if trainer already exists
    const existingTrainer = await Trainer.findOne({ email });

    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: "Trainer already exists"
      });
    }

    // Create trainer
    const trainer = await Trainer.create({
      fullName,
      email,
      phone,
      specialization,
      experience,
      salary
    });

    res.status(201).json({
      success: true,
      message: "Trainer added successfully",
      trainer
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= GET ALL TRAINERS =================
const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();

    res.status(200).json({
      success: true,
      count: trainers.length,
      trainers
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= UPDATE TRAINER =================
const updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      trainer
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= DELETE TRAINER =================
const deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findByIdAndDelete(id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Trainer deleted successfully"
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
  addTrainer,
  getAllTrainers,
  updateTrainer,
  deleteTrainer
};
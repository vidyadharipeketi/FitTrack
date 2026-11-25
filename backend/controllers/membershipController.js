const Membership = require("../models/Membership");

// ================= ADD MEMBERSHIP =================
const addMembership = async (req, res) => {
  try {
    const { planName, duration, price, description } = req.body;

    // Check required fields
    if (!planName || !duration || !price || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // Check if plan already exists
    const existingPlan = await Membership.findOne({ planName });

    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: "Membership plan already exists"
      });
    }

    // Create membership plan
    const membership = await Membership.create({
      planName,
      duration,
      price,
      description
    });

    res.status(201).json({
      success: true,
      message: "Membership plan added successfully",
      membership
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= GET ALL MEMBERSHIP PLANS =================
const getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();

    res.status(200).json({
      success: true,
      count: memberships.length,
      memberships
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= UPDATE MEMBERSHIP =================
const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await Membership.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership Plan not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Membership Plan updated successfully",
      membership
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= DELETE MEMBERSHIP =================
const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await Membership.findByIdAndDelete(id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership Plan not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Membership Plan deleted successfully"
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
  addMembership,
  getAllMemberships,
  updateMembership,
  deleteMembership
};
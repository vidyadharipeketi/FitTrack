const Member = require("../models/Member");
const Membership = require("../models/Membership");
const User = require("../models/User");
const Workout = require("../models/Workout");

// ================= ADD MEMBER =================
const addMember = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      gender,
      age,
      membershipPlan,
      trainerName,
      assignedWorkouts,
      joiningDate,
    } = req.body;

    // ================= REQUIRED FIELDS =================
    if (
      !fullName ||
      !email ||
      !phone ||
      !gender ||
      !age ||
      !membershipPlan ||
      !trainerName
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // ================= CHECK EXISTING MEMBER =================
    const existingMember = await Member.findOne({ email });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: "Member already exists",
      });
    }

    // ================= FIND USER ACCOUNT =================
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User account not found. Please register this member first.",
      });
    }

    // ================= CHECK USER ROLE =================
    if (user.role !== "member") {
      return res.status(400).json({
        success: false,
        message: "This email is not registered as a member.",
      });
    }

    // ================= FIND MEMBERSHIP PLAN =================
    const plan = await Membership.findOne({
      planName: membershipPlan,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }

    // ================= JOINING DATE =================
    const startDate = joiningDate
      ? new Date(joiningDate)
      : new Date();

    // ================= EXPIRY DATE =================
    const expiryDate = new Date(startDate);

    expiryDate.setMonth(
      expiryDate.getMonth() + plan.duration
    );

    // ================= STATUS =================
    const status =
      expiryDate >= new Date()
        ? "Active"
        : "Expired";

    // ================= CREATE MEMBER =================
    const member = await Member.create({
      userId: user._id,

      fullName,
      email,
      phone,
      gender,
      age,
      membershipPlan,
      trainerName,

      assignedWorkouts: assignedWorkouts || [],

      joiningDate: startDate,
      expiryDate,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      member,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET ALL MEMBERS =================
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("assignedWorkouts");

    const today = new Date();

    // Automatically update expired members
    for (const member of members) {
      if (
        member.expiryDate &&
        member.expiryDate < today &&
        member.status !== "Expired"
      ) {
        member.status = "Expired";
        await member.save();
      }
    }

    // Fetch updated members
    const updatedMembers = await Member.find()
      .populate("assignedWorkouts");

    res.status(200).json({
      success: true,
      count: updatedMembers.length,
      members: updatedMembers,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET SINGLE MEMBER =================
const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id)
      .populate("assignedWorkouts");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      member,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET MY MEMBER PROFILE =================
const getMyMemberProfile = async (req, res) => {
  try {

    // User ID comes from JWT
    const userId = req.user.id;

    // Find member profile
    const member = await Member.findOne({
      userId: userId,
    }).populate("assignedWorkouts");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found",
      });
    }

    res.status(200).json({
      success: true,
      member,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ======================================================
// GET AVAILABLE WORKOUTS
// Member can see all workouts available in FitTrack
// ======================================================
const getAvailableWorkouts = async (req, res) => {
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
      message: "Unable to fetch workouts",
    });
  }
};


// ======================================================
// MEMBER SELECT / ASSIGN WORKOUTS
// ======================================================
const assignWorkouts = async (req, res) => {
  try {

    // Logged-in user's ID from JWT
    const userId = req.user.id;

    // workoutIds should come from frontend
    const { workoutIds } = req.body;

    // ================= VALIDATE =================
    if (
      !workoutIds ||
      !Array.isArray(workoutIds)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide workoutIds as an array",
      });
    }

    // ================= FIND MEMBER =================
    const member = await Member.findOne({
      userId: userId,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found",
      });
    }

    // ================= CHECK WORKOUTS =================
    const workouts = await Workout.find({
      _id: { $in: workoutIds },
    });

    if (workouts.length !== workoutIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more workouts are invalid",
      });
    }

    // ================= SAVE WORKOUTS =================
    member.assignedWorkouts = workoutIds;

    await member.save();

    // Populate workouts before sending response
    const updatedMember = await Member.findById(member._id)
      .populate("assignedWorkouts");

    res.status(200).json({
      success: true,
      message: "Workouts assigned successfully",
      member: updatedMember,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= UPDATE MEMBER =================
const updateMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // ================= MEMBERSHIP PLAN =================
    const selectedPlan =
      req.body.membershipPlan ||
      member.membershipPlan;

    const plan = await Membership.findOne({
      planName: selectedPlan,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }

    // ================= JOINING DATE =================
    const startDate = req.body.joiningDate
      ? new Date(req.body.joiningDate)
      : member.joiningDate;

    // ================= EXPIRY DATE =================
    const expiryDate = new Date(startDate);

    expiryDate.setMonth(
      expiryDate.getMonth() + plan.duration
    );

    // ================= UPDATE CALCULATED FIELDS =================
    req.body.joiningDate = startDate;
    req.body.expiryDate = expiryDate;

    req.body.status =
      expiryDate >= new Date()
        ? "Active"
        : "Expired";

    // ================= UPDATE MEMBER =================
    const updatedMember =
      await Member.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate("assignedWorkouts");

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      updatedMember,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= RENEW MEMBER =================
const renewMember = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Find current membership plan
    const plan = await Membership.findOne({
      planName: member.membershipPlan,
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Membership plan not found",
      });
    }

    // Renewal starts from today
    const startDate = new Date();

    // Calculate new expiry date
    const expiryDate = new Date(startDate);

    expiryDate.setMonth(
      expiryDate.getMonth() + plan.duration
    );

    // Update member
    member.joiningDate = startDate;
    member.expiryDate = expiryDate;
    member.status = "Active";

    await member.save();

    res.status(200).json({
      success: true,
      message: "Membership renewed successfully",
      member,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= DELETE MEMBER =================
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMember =
      await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= EXPORTS =================
module.exports = {
  addMember,
  getAllMembers,
  getMemberById,
  getMyMemberProfile,
  getAvailableWorkouts,
  assignWorkouts,
  updateMember,
  deleteMember,
  renewMember,
};
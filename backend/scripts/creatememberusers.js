const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Member = require("../models/Member");
const User = require("../models/User");

const createMemberUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // Find members who don't have a User ID
    const members = await Member.find({
      userId: { $exists: false },
    });

    console.log(
      `Members without user accounts: ${members.length}`
    );

    // Temporary password for existing members
    const temporaryPassword = "Fittrack@123";

    // Hash password
    const hashedPassword = await bcrypt.hash(
      temporaryPassword,
      10
    );

    // Process every member
    for (const member of members) {
      // Check whether User already exists
      let user = await User.findOne({
        email: member.email.toLowerCase(),
      });

      // Create User account if it doesn't exist
      if (!user) {
        user = await User.create({
          name: member.fullName,
          email: member.email.toLowerCase(),
          password: hashedPassword,
          phone: member.phone,
          role: "member",
        });

        console.log(
          `👤 User created: ${member.fullName}`
        );
      } else {
        console.log(
          `ℹ️ User already exists: ${member.fullName}`
        );
      }

      // Connect Member with User
      member.userId = user._id;

      await member.save();

      console.log(
        `🔗 Connected: ${member.fullName}`
      );
    }

    console.log("");
    console.log(
      "=========================================="
    );
    console.log(
      "✅ ALL MEMBERS PROCESSED SUCCESSFULLY"
    );
    console.log(
      "=========================================="
    );
    console.log(
      "Temporary Password: Fittrack@123"
    );
    console.log(
      "Members can now log in using their email."
    );

    process.exit(0);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createMemberUsers();
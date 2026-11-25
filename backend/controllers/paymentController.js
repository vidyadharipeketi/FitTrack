const Payment = require("../models/Payment");

// ================= ADD PAYMENT =================
const addPayment = async (req, res) => {
  try {
    const {
      memberName,
      membershipPlan,
      amount,
      paymentMethod,
      paymentStatus
    } = req.body;

    // Check required fields
    if (
      !memberName ||
      !membershipPlan ||
      !amount ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // Create payment
    const payment = await Payment.create({
      memberName,
      membershipPlan,
      amount,
      paymentMethod,
      paymentStatus
    });

    res.status(201).json({
      success: true,
      message: "Payment added successfully",
      payment
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= GET ALL PAYMENTS =================
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= UPDATE PAYMENT =================
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      payment
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ================= DELETE PAYMENT =================
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully"
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
  addPayment,
  getAllPayments,
  updatePayment,
  deletePayment
};
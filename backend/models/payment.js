const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
    memberName: {
        type: String,
        required: true
    },

    membershipPlan: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paymentDate: {
        type: Date,
        default: Date.now
    },

    paymentMethod: {
        type: String,
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["Paid", "Pending"],
        default: "Paid"
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
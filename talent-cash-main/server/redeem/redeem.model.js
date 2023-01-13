const mongoose = require("mongoose");

const redeemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "RedeemPlan" },
    rupee: { type: String, default: 0 },
    dollar: { type: String, default: 0 },
    paymentGateway: String,
    description: String,
    diamond: Number,
    status: { type: Number, default: 0, enum: [0, 1, 2] }, // 0: pending, 1: accepted, 2: decline
    date: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Redeem", redeemSchema);

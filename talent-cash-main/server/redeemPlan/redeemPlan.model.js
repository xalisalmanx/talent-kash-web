const mongoose = require("mongoose");

const redeemPlanSchema = new mongoose.Schema(
  {
    diamond: Number,
    dollar: Number,
    rupee: Number,
    tag: { type: String, default: null },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("RedeemPlan", redeemPlanSchema);

const mongoose = require("mongoose");

const diamondPlanSchema = new mongoose.Schema(
  {
    diamond: Number,
    coin: Number,
    tag: { type: String, default: null },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("DiamondPlan", diamondPlanSchema);

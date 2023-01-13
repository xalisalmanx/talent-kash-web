const mongoose = require("mongoose");

const coinPlanSchema = new mongoose.Schema(
  {
    coin: Number,
    dollar: Number,
    rupee: Number,
    productKey: String,
    tag: { type: String, default: null },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("CoinPlan", coinPlanSchema);

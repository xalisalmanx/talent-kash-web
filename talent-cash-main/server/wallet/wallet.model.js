const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    otherUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: { type: Number, enum: [0, 1, 2, 3, 4, 5] }, // 0:gift, 1:convert, 2:purchase [coin purchase],  3:ad[from watching ad],  4: cashOut, 5:admin [admin add or less the Coin or diamond through admin panel]
    isIncome: { type: Boolean, default: true },
    diamond: { type: Number, default: 0 },
    coin: { type: Number, default: 0 },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoinPlan",
      default: null,
    },
    paymentGateway: { type: String, default: null },
    date: String,
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("Wallet", walletSchema);

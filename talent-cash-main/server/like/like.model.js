const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reelId: { type: mongoose.Schema.Types.ObjectId, ref: "Reel" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Like", likeSchema);

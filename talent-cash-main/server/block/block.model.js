const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //blocked by ( who blocked the other person )
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //blocked person ( who is blocked )
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Block", blockSchema);

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user who have receive notification
    otherUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // user who responsible for  send notification
    reelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
      default: null,
    },
    notificationType: { type: Number, enum: [0, 1, 2, 3, 4, 5] }, // 0.follow 1.like 2.comment 3.gift 4.mention 5.chat
    message: String,
    date: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);

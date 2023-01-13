const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    senderId: String,
    messageType: { type: Number, enum: [0, 1, 2] }, // 0.message  1.image 2.gift
    message: String,
    image: String,
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "ChatTopic" },
    date: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Chat", chatSchema);

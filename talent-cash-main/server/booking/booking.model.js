const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    booking_id : { type: String, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user who accept offer
    talentUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user who provide service
    reelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
      default: null,
    },
    time : { type: String, default: null },
    service : { type: String, default: null },
    price : { type: Number, default: 0 },
    initial_price: { type: Number, default: 0 },
    remaining_price: { type: Number, default: 0 },
    status: { type: Number, default: 0, enum: [0, 1, 2] }, // 0: inprogress, 1: completed , 2: cancelled
    //message: String,
    description : { type: String, default: null },
    accept_date: { type: String, default: null},
    completed_date: { type: String, default: null},
    isFeedbackAdd : { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
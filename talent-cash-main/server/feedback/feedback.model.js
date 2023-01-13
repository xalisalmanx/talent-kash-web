const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user who accept offer
    talentUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user who provide service
    reelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
      default: null,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        default: null,
      },
    rating: { type: Number, default: 0 }, 
    description : { type: String, default: null },
    
    //message: String,
    feedback_date: { type: String, default: null},
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
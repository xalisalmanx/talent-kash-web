const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    invoice_id : { type: String, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user who is paying
    talentUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user -> provide service
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
    amount : { type: Number, default: 0 },
    pay_datetime : { type: String, default: null },
    payment_type : { type: Number, default: 0, enum: [0, 1, 2] }, // 0: initial , 1: remaining , 2: full
    payment_method : { type: Number, default: 0, enum: [0,1,2]  },// 0: cash on delivery, 1: wallet , 2: card 
    transaction_id : { type: String, default: null },
    payment_status: { type: Number, default: 0, enum: [0, 1] }, // 0: unpaid, 1: paid
    isDelete: { type: Boolean, default: false },
    //message: String,
    // accept_date: { type: String, default: null},
    // completed_date: { type: String, default: null}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
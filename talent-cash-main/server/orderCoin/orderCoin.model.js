const mongoose = require("mongoose");

const orderCoinSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // user who is purchasing
    order_id : { type: String, default: null },
    coins : { type: Number, default: 0 }, //purchased total coin
    amount : { type: Number, default: 0 },
    order_date : { type: String, default: null },
    order_due_date : { type: String, default: null },
    order_datetime : { type: String, default: null },
    order_status: { type: Number, default: 0, enum: [0, 1, 2] }, // 0: deactive, 1: active // 2: completed ( if order created on paypro, set 1)
    payment_status: { type: Number, default: 0, enum: [0, 1] }, // 0: unpaid, 1: paid
    isDelete: { type: Boolean, default: false },
    transaction_id : { type: String, default: null }, //in case of jazzcash
    //PayPro Info in case of successgully order created
    payProId : { type: String, default: null },
    Click2Pay : { type: String, default: null },
    payProInvURL: { type: String, default: null },
    ConnectPayFee: { type: String, default: null },
    order_paydate : { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("orderCoin", orderCoinSchema);
const mongoose = require("mongoose");

const payProTokenSchema = new mongoose.Schema(
  {
    token : { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("payProTokenSchema", payProTokenSchema);
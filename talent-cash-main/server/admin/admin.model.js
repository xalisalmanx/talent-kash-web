const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const adminSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    image: String,
    flag: { type: Boolean, default: false },
    k1srz5: { type: String, default: null },
    di2ux9: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);

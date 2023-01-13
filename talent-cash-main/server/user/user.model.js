const mongoose = require("mongoose");
//moment
const { DateTime } = require("luxon");

const userSchema = new mongoose.Schema(
  {
    user_id : { type: String , default: null },
    email: String,
    identity: String,
    password: { type: String, default: null },
    name: { type: String, default: "" },
    username: { type: String, default: "" },
    gift: [
      {
        gift: { type: mongoose.Schema.Types.ObjectId, ref: "Gift" },
        count: { type: Number, default: 0 },
      },
    ],
    fcm_token: String,
    lastLogin: String,
    analyticDate: {
      type: String,
      default: new Date().toLocaleString("en-us"),
    },
    gender: { type: String, default: null },

    bio: { type: String, default: "I am Talent Cash User ☺" },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    comment: { type: Number, default: 0 },
    reels: { type: Number, default: 0 },
    diamond: { type: Number, default: 0 },
    requestForWithdrawDiamond: { type: Number, default: 0 },
    coin: { type: Number, default: 0 },
    profileImage: { type: String, default: null },
    coverImage: { type: String, default: null },
    isBlock: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    loginType: { type: Number, enum: [0, 1, 2,3], default: 0 }, //0 : google , 1 : facebook , 2 : quick, 3:manual
    ad: {
      count: { type: Number, default: 0 },
      date: { type: String, default: null },
    },
    social_id:{type: String, default: null},
    notification: { type: Boolean, default: true },
    user_role: { type: String, default: null },//By umar
    user_phone: { type: Number, default: null },//By umar //number will save without start with 0
    // is_number_verify: { type: Boolean, default: false },//By umar
    isReport: { type: Boolean, default: false },
    jwtToken: { type: String, default: "" },

  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("User", userSchema);

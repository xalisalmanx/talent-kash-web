const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    maxSecondForVideo: { type: Number, default: 30 },
    privacyPolicyLink: { type: String, default: "PRIVACY POLICY LINK" },
    privacyPolicyText: { type: String, default: "PRIVACY POLICY TEXT" },

    termsAndConditionsLink: { type: String, default: "Terms and Conditions LINK" },
    termsAndConditionsText: { type: String, default: "Terms and Conditions TEXT" },
    aboutusLink: { type: String, default: "About us LINK" },
    aboutusText: { type: String, default: "About us TEXT" },

    googlePlayEmail: { type: String, default: "GOOGLE PLAY EMAIL" },
    googlePlayKey: { type: String, default: "GOOGLE PLAY KEY" },
    googlePlaySwitch: { type: Boolean, default: false },
    stripeSwitch: { type: Boolean, default: false },
    stripePublishableKey: { type: String, default: "STRIPE PUBLISHABLE KEY" },
    stripeSecretKey: { type: String, default: "STRIPE SECRET KEY" },
    currency: { type: String, default: "$" },
    diamondPerCurrency: { type: Number, default: 20 },
    CoinForDiamond: { type: Number, default: 20 },
    isAppActive: { type: Boolean, default: true },
    paymentGateway: { type: Array, default: [] },
    minDiamondForCashOut: { type: Number, default: 200 }, // minimum diamond for withdraw [redeem]
    freeCoinForAd: { type: Number, default: 20 },
    maxAdPerDay: { type: Number, default: 3 },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("Setting", settingSchema);

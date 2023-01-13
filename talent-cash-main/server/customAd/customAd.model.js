const mongoose = require("mongoose");

const customAdSchema = mongoose.Schema(
  {
    title: String,
    video: String,
    description: { type: String, default: null },
    url: String,
    type: { type: Number, enum: [0, 1], default: 0 }, // 0 : Native [with title,description] , 1 : Full screen
    publisherName: { type: String, default: null },
    publisherLogo: { type: String, default: null },
    show: { type: Boolean, default: false },
    productImage: { type: String, default: null },
    productUrl: { type: String, default: null },
    productTag: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("CustomAd", customAdSchema);

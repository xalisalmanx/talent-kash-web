const mongoose = require("mongoose");

const hashtagSchema = new mongoose.Schema(
  {
    hashtag: String,
    image: { type: String, default: null },
    coverImage: { type: String, default: null },
    description: { type: String, default: null },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model("Hashtag", hashtagSchema);

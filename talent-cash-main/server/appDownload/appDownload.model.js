const mongoose = require("mongoose");

const appDownloadSchema = new mongoose.Schema(
  {
    androidDownload: Number,
    iosDownload: Number,
    isDelete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("AppDownload", appDownloadSchema);

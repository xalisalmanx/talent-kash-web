const mongoose = require("mongoose");

const ServiceProviderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },//for choose service provider
    service_name : String

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("service_provider", ServiceProviderSchema);
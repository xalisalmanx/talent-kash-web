const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    service_name : { type: String, default: null },
    service_id : {type: Number, default: null},
    isDelete: { type: Boolean, default: false },
    status: { type: Boolean, default: false }
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", ServiceSchema);
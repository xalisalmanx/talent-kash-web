const mongoose = require("mongoose");

const reelCategorySchema = new mongoose.Schema(
  {
    reeltype : { type: String, default: null },
    reeltype_id : {type: Number, default: null},
    isDelete: { type: Boolean, default: false },
    status: { type: Boolean, default: false }
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ReelType", reelCategorySchema);

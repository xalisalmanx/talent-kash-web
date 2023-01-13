const mongoose = require("mongoose");

const reelsSchema = new mongoose.Schema(
  {
    video: String,
    hashtag: Array,
    mentionPeople: Array,
    caption: String,
    location: String,
    thumbnail: String,
    screenshot: String,
    productImage: String,
    productUrl: String,
    productTag: String,
    isProductShow: { type: Boolean, default: false },
    isOriginalAudio: { type: Boolean, default: false },
    like: { type: Number, default: 0 },
    comment: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    allowComment: { type: Boolean, default: true },
    showVideo: { type: Number, enum: [0, 1], default: 0 }, // 0:public, 1:followers
    song: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
    duration: { type: Number, default: 0 },
    size: { type: String, default: "0" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDelete: { type: Boolean, default: false },
    //By umar
    service_price: { type: Number, default: 0 },
    initial_price: { type: Number, default: 0 },
    remaining_price: { type: Number, default: 0 },
    service: { type: String, default: null },
    date: String,
    isService: { type: Boolean, default: false },
    availabileTime:{ type: String},
    //23-09-22
    categoryId : { type: Number, default: 0 }, // reelType Ref
    lat: { type: String, default: false },
    long: { type: String, default: false },
    speed: { type: String, default: '1' },
    //27-10-22
    isReported: { type: Boolean, default: false },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reel", reelsSchema);

const { deleteFile } = require("../../util/deleteFile");
const Reel = require("../reels/reels.model");
const User = require("../user/user.model");
const Song = require("../song/song.model");
const Hashtag = require("../hashtag/hashtag.model");
const Comment = require("../comment/comment.model");
const Like = require("../like/like.model");
const Notification = require("../notification/notification.model");
const ReelType = require("./reelCategory.model");

//fs
const fs = require("fs");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);



//get reelCategories 
exports.index = async (req, res) => {
  
  try {
    const start = req.query.start ? parseInt(req.query.start) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    // const Last_Record = await ReelType.find().sort({ $natural: -1 }).limit(1);
    // console.log(Last_Record[0].reeltype_id+'--'+Last_Record[0].reeltype);
    // // console.log(Last_Record[0].reeltype_id.padStart(6, "0"));
    
    // last_inv = 'TCI-'+'1'.padStart(5, '0');//'TCI-'+Last_Record[0].reeltype_id.toString().padStart(5, '0');
    // console.log( last_inv );
    // var arr = last_inv.split("-");
    // var val = 30;//parseInt(arr[1]) + 1;
    // console.log('TCI-'+val.toString().padStart(5, '0'));


    // const arr2 = {
    //   "reeltype": "Talent",
    //   "reeltype_id": Last_Record[0].reeltype_id + 1,
    //   "isDelete": false,
    //   "status": false
    // };
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });

    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist" });

    const reelType = await ReelType.aggregate([
      { $match: { isDelete: false } },
      
    ]);
    return res.status(200).json({
      status: true,
      message: "Success !",
      reelType,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};


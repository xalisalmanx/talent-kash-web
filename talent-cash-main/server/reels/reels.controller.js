const { deleteFile } = require("../../util/deleteFile");
const Reel = require("./reels.model");
const User = require("../user/user.model");
const Song = require("../song/song.model");
const Hashtag = require("../hashtag/hashtag.model");
const Comment = require("../comment/comment.model");
const Like = require("../like/like.model");
const Notification = require("../notification/notification.model");
const Wallet = require("../wallet/wallet.model");

ObjectId = require('mongodb').ObjectID;

//fs
const fs = require("fs");

//geolocation Library 
const geolib = require('geolib');

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
const { exit } = require("process");
var fcm = new FCM(config.SERVER_KEY);
var share = config.CompanyShare;


//get reel list [backend]
exports.index = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    let dateFilterQuery = {};
    let sDate, eDate;
    if (req.query.startDate !== "ALL" && req.query.endDate !== "ALL") {
      sDate = req.query.startDate + "T00:00:00.000Z";
      eDate = req.query.endDate + "T00:00:00.000Z";

      //for date query
      dateFilterQuery = {
        analyticDate: { $gte: new Date(sDate), $lte: new Date(eDate) },
      };
    }

    const reel = await Reel.aggregate([
      { $match: { isDelete: false,isReported:false} },
      // { $match: { isReported:false} },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: "songs",
          localField: "song",
          foreignField: "_id",
          as: "song",
        },
      },
      {
        $unwind: { path: "$song", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          song: {
            $cond: [
              {
                $ifNull: ["$song", false],
              },
              "$song",
              null,
            ],
          },
        },
      },

      {
        $addFields: {
          analyticDate: {
            $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
          },
        },
      },

      {
        $match: dateFilterQuery,
      },
      {
        $sort: { analyticDate: -1 },
      },
      {
        $facet: {
          reel: [
            { $skip: (start - 1) * limit }, // how many records you want to skip
            { $limit: limit },
          ],
          pageInfo: [
            { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
          ],
        },
      },
    ]);
    return res.status(200).json({
      status: true,
      message: "Success !",
      reel: reel[0].reel,
      totalReel:
        reel[0].pageInfo.length > 0 ? reel[0].pageInfo[0].totalRecord : 0,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//get reels for [android]
exports.get = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    var cat_id = req.query.categoryId ? parseInt(req.query.categoryId) : 0;

    let conditions = {
      "isDelete" : false,
      "isReported": false,
    };
    if (cat_id) {
      conditions = {
        "categoryId": cat_id,
        "isDelete" : false,
        "isReported": false,
        // More conditions in future...
      }
    }
    console.log(conditions);

    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });

    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist" });

    const reel = await Reel.aggregate([
      //{ $match: { isDelete: false }},
      //{ $match: { categoryId: cat_id }},
      // { $match : {
      //   $and: [{ isDelete: false }, { categoryId: cat_id}],
      // }},

      {
        $match : conditions
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: "likes",
          let: { userIds: user._id, reelIds: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$reelId", "$$reelIds"] },
                    { $eq: ["$userId", "$$userIds"] },
                  ],
                },
              },
            },
          ],
          as: "isLike",
        },
      },
      {
        $unwind: { path: "$isLike", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          isLike: {
            $cond: [
              {
                $ifNull: ["$isLike", false],
              },
              true,
              false,
            ],
          },
          isheart: {
            $cond: [
              {
                $ifNull: ["$isLike", false],
              },
              true,
              false,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "songs",
          localField: "song",
          foreignField: "_id",
          as: "song",
        },
      },
      {
        $unwind: { path: "$song", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          song: {
            $cond: [
              {
                $ifNull: ["$song", false],
              },
              "$song",
              null,
            ],
          },
        },
      },

      {
        $addFields: {
          analyticDate: {
            $toDate: "$date",
          },
        },
      },
      {
        $project: {
          isOriginalAudio: 1,
          like: 1,
          comment: 1,
          allowComment: 1,
          isDelete: 1,
          service_price:1,
          initial_price:1,
          remaining_price:1,
          service:1,
          isService:1,
          availabileTime:1,
          categoryId:1,
          lat:1,
          long:1,
          speed:1,
          isReported:1,
          userId:1,
          video:1,
          song:{ "_id" : "$song._id", "title" : "$song.title", "singer" : "$song.singer", "image" : "$song.image", "song" : "$song.song" },
          location:1,
          caption:1,
          thumbnail:1,
          screenshot:1,
          view:1,
          user : { "_id" : "$user._id", "user_id" : "$user.user_id", "password" : "$user.password", "name" : "$user.name", "username" : "$user.username", "bio" : "$user.bio" ,
          "followers" : "$user.followers" , "following" : "$user.following", "like": "$user.like", "view" : "$user.view", "comment" : "$user.comment" ,
           "reels" : "$user.reels", "coin" : "$user.coin" , "profileImage" : "$user.profileImage", "coverImage" : "$user.coverImage", "isBlock": "$user.isBlock",
           "isOnline" : "$user.isOnline", "user_role" : "$user.user_role" , "user_phone": "$user.user_phone" , "isReport" : "$user.isReport", "email" :"$user.email",
           "fcm_token": "$user.fcm_token", "lastLogin" : "$user.lastLogin"},
          isLike:1,
          isheart : 1,
          analyticDate:1,

          
        },
      },
      {
        $sort: { analyticDate: -1 },
      },
      {
        $facet: {
          reel: [
            { $skip: start * limit }, // how many records you want to skip
            { $limit: limit },
          ],
          pageInfo: [
            { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
          ],
        },
      },
    ]);
    return res.status(200).json({
      status: true,
      message: "Success !",
      reel: reel[0].reel,
      totalReel:
          reel[0].pageInfo.length > 0 ? reel[0].pageInfo[0].totalRecord : 0,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//get user wise reel [backend]
exports.userWiseReel = async (req, res) => {
  try {
    if (req.query.userId) {
      const user = await User.findById(req.query.userId);
      if (!user)
        return res
          .status(200)
          .json({ status: false, message: "Invalid Details" });
      const reel = await Reel.find({
        $and: [{ userId: user._id }, { isDelete: false }],
      })
        .populate("userId song")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        status: true,
        message: "Success !",
        reel,
      });
    }
    return res.status(200).json({ status: false, message: "Invalid Details" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//create reels
exports.store = async (req, res) => {
  try {
    if (!req.files.video || !req.body.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const user = await User.findById(req.body.userId);


    //res.send(user);
    // console.log(user);
    if (!user) {
      if (req.files.video) deleteFile(req.files.video[0]);
      if (req.files.screenshot) deleteFile(req.files.screenshot[0]);
      if (req.files.thumbnail) deleteFile(req.files.thumbnail[0]);
      if (req.files.productImage) deleteFile(req.files.productImage[0]);
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }
    //console.log(user.user_role + req.body.lat + req.body.long + req.body.isService);
    //by umar ( if talent provider location is mandatory otherwise carry on)
    if (user.user_role == 'talent_provider' && req.body.lat == '0.0' && req.body.long == '0.0' && req.body.isService == 'true') {
      if (req.files.video) deleteFile(req.files.video[0]);
      if (req.files.screenshot) deleteFile(req.files.screenshot[0]);
      if (req.files.thumbnail) deleteFile(req.files.thumbnail[0]);
      if (req.files.productImage) deleteFile(req.files.productImage[0]);
      return res
        .status(200)
        .json({ status: false, message: "User location not found!" });
    }

    let song;

    if (req.body.songId) {
      song = await Song.findById(req.body.songId);

      if (!song) {
        if (req.files.video) deleteFile(req.files.video[0]);
        if (req.files.screenshot) deleteFile(req.files.screenshot[0]);
        if (req.files.thumbnail) deleteFile(req.files.thumbnail[0]);
        if (req.files.productImage) deleteFile(req.files.productImage[0]);
        return res
          .status(200)
          .json({ status: false, message: "Song does not Exist!" });
      }
    }

    var removeComa = req.body.hashtag.replace(/,\s*$/, "");

    var hashtagList = removeComa.split(",");

    var hashtagLowerListResult = [];
    if (hashtagList.length > 0) {
      hashtagList.map((hashtag) => {
        const h = hashtag.toLowerCase();

        hashtagLowerListResult.push(h);

        // console.log("hashtag", h);
        if (h !== "" || h !== " ") {
          Hashtag.findOneAndUpdate(
            { hashtag: h },
            {},
            { upsert: true },
            function (err) {
              // console.log(err)
            }
          );
        }
      });
    }
    
    var user_coins = user.coin;

    var removeMentionComa = req.body.mentionPeople.replace(/,\s*$/, "");

    var mentionPeopleList = removeMentionComa.split(",");

    const video = new Reel();

    video.userId = user._id;
    video.video = config.cloudfront_url+req.files.video[0].key;
    video.song = req.body.songId;
    video.hashtag = hashtagLowerListResult; //hashtagList;
    video.location = req.body.location;
    video.view = req.body.view;
    video.caption = req.body.caption ? req.body.caption : null;
    video.mentionPeople = mentionPeopleList;
    video.isOriginalAudio = req.body.isOriginalAudio;
    video.showVideo = req.body.showVideo;
    video.allowComment = req.body.allowComment;
    video.duration = req.body.duration;
    video.size = req.body.size;
    video.thumbnail = req.files.thumbnail ? req.files.thumbnail[0].location : null;
    video.screenshot = req.files.screenshot
      ? req.files.screenshot[0].location
      : null; 
    video.productImage = req.files.productImage
      ? req.files.productImage[0].location
      : null;
    (video.productUrl = req.body.productUrl ? req.body.productUrl : null),
      (video.isProductShow = video.productUrl ? true : false),
      (video.productTag = req.body.productTag ? req.body.productTag : null),
      (video.song = !song ? null : song._id);

    //By umar 07-09-22
    video.service_price = req.body.service_price ? req.body.service_price : 0;//should be 0 in future
    video.initial_price = req.body.service_price ? Math.round(req.body.service_price * share) : 0;//should be 0 in future
    video.remaining_price = req.body.service_price ? Math.round(req.body.service_price - video.initial_price) : 0;
    video.service = req.body.service ? req.body.service : null;//should be null in future
    //console.log(video.service_price+'--'+video.service);
    video.date = new Date().toLocaleString("en-US");
    video.isService = req.body.isService ? req.body.isService : false;//should be false in future
    //umar 23-09-22

    if(user_coins < video.initial_price)
    {
        if (req.files.video) deleteFile(req.files.video[0]);
        if (req.files.screenshot) deleteFile(req.files.screenshot[0]);
        if (req.files.thumbnail) deleteFile(req.files.thumbnail[0]);
        if (req.files.productImage) deleteFile(req.files.productImage[0]);
        return res
          .status(200)
          .json({ status: false, message: "User has not enough coins for this service!" });
    }


    video.categoryId = video.isService === true ? 2 : 1; //category API // 1 for fun , 2 for talentservice
    video.lat = req.body.lat ? req.body.lat : "0.0"; //video lat long
    video.long = req.body.long ? req.body.long : "0.0"; //video lat long
    video.availabileTime = '2 hours';
    
    video.speed = req.body.speed ? req.body.speed : '1';

    // console.log(video);
    
    await video.save();

    if (req.body.mentionPeople) {
      mentionPeopleList.map(async (mention) => {
        const mentionUser = await User.findOne({ username: mention });

        if (
          mentionUser &&
          mentionUser._id.toString() !== req.body.userId.toString() &&
          mentionUser.notification
        ) {
          const payload = {
            to: mentionUser.fcm_token,
            notification: {
              title: `${user.name} mention you in their reel .`,
            },
          };

          notificationData = {
            userId: mentionUser._id,
            otherUserId: user._id,
            notificationType: 4,
            message: payload.notification.title,
            reelId: video._id,
            date: new Date().toLocaleString("en-US"),
          };

          const notification = new Notification(notificationData);
          await notification.save();

          await fcm.send(payload, function (err, response) {
            if (err) {
              console.log("Something has gone wrong!", err);
            }
          });
        }
      });
    }

    user.reels += 1;
    var remaining_user_coins = user.coin - video.initial_price;
    user.coin = remaining_user_coins;
    // user.save();
    await user.save();

    const wallet = new Wallet();
    wallet.userId = user._id;
    wallet.type = 0;//SIGN up gift
    wallet.isIncome = false;
    wallet.coin = video.initial_price;
    wallet.date = new Date().toLocaleString("en-US");
    wallet.save();

    // Update the coins in user table
    

    return res
      .status(200)
      .json({ status: true, message: "Success!!", reel: video });
  } catch (error) {
    // console.log(req.files.video);
    if (req.files.video) deleteFile(req.files.video[0]);
    if (req.files.screenshot) deleteFile(req.files.screenshot[0]);
    if (req.files.thumbnail) deleteFile(req.files.thumbnail[0]);
    if (req.files.productImage) deleteFile(req.files.productImage[0]);
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// allow disallow comment on reel [frontend]
exports.allowDisallowComment = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.reelId);
    if (!reel)
      return res
        .status(200)
        .json({ status: false, message: "reel does not Exist!" });

    reel.allowComment = !reel.allowComment;
    await reel.save();

    return res.status(200).json({ status: true, message: "Success!!", reel });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Show Product in Reel OR Not [frontend]
exports.showProduct = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.reelId);
    if (!reel)
      return res
        .status(200)
        .json({ status: false, message: "reel does not Exist!" });

    reel.isProductShow = !reel.isProductShow;
    await reel.save();

    return res.status(200).json({ status: true, message: "Success!!", reel });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//delete reels by admin
exports.destroy = async (req, res) => {
  try {
    if (!req.params.reelId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });
    const reel = await Reel.findById(req.params.reelId);
    if (!reel)
      return res
        .status(200)
        .json({ status: false, message: "reel does not Exist!" });
    if (fs.existsSync(reel.video)) {
      fs.unlinkSync(reel.video);
    }
    if (fs.existsSync(reel.thumbnail)) {
      fs.unlinkSync(reel.thumbnail);
    }
    if (fs.existsSync(reel.screenshot)) {
      fs.unlinkSync(reel.screenshot);
    }
    if (fs.existsSync(reel.productImage)) {
      fs.unlinkSync(reel.productImage);
    }

    await Comment.deleteMany({ reelId: reel._id });
    await Like.deleteMany({ reelId: reel._id });

    await User.updateOne(
      { _id: reel.userId },
      { $inc: { like: -reel.like, comment: -reel.comment } }
    );

    const user = await User.findById(reel.userId);

    if (user) {
      user.reels -= 1;
      user.save();
    }

    reel.like = 0;
    reel.comment = 0;
    reel.isDelete = true;

    await reel.save();
    return res
      .status(200)
      .json({ status: true, message: "Reel Deleted Successfully!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//add view in reel
exports.addView = async (req, res) => {
  try {
    if (!req.query.reelId || !req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details !" });
    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Doesn't Exist!" });
    const reel = await Reel.findById(req.query.reelId);
    if (!reel)
      return res
        .status(200)
        .json({ status: false, message: "Reel Doesn't Exist!" });
    const reelOwner = await User.findById(reel.userId);
    if (!reelOwner)
      return res
        .status(200)
        .json({ status: false, message: "Reel Owner Doesn't Exist!" });

    reel.view += 1;
    reel.save();

    reelOwner.view += 1;
    reelOwner.save();

    return res.status(200).json({ status: true, message: "Success", reel });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      status: false,
      error: error.message || "Internal server error!",
    });
  }
};

//get user wise reel [Android]
exports.userWiseReelAndroid = async (req, res) => {
  try {
    if (req.query.userId) {
      const user = await User.findById(req.query.userId);
      if (!user)
        return res
          .status(200)
          .json({ status: false, message: "Invalid Details" });
      
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const reel = await Reel.aggregate([
        {
          $match: {
            userId: { $eq: user._id },
            // userId: user._id,
            isReported: { $eq: false },
            isDelete: { $eq: false },
            
          },
          
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $lookup: {
            from: "likes",
            let: { userIds: user._id, reelIds: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$reelId", "$$reelIds"] },
                      { $eq: ["$userId", "$$userIds"] },
                    ],
                  },
                },
              },
            ],
            as: "isLike",
          },
        },
        {
          $unwind: { path: "$isLike", preserveNullAndEmptyArrays: true },
        },
        {
          $addFields: {
            isLike: {
              $cond: [
                {
                  $ifNull: ["$isLike", false],
                },
                true,
                false,
              ],
            },
          },
        },

        {
          $lookup: {
            from: "songs",
            localField: "song",
            foreignField: "_id",
            as: "song",
          },
        },
        {
          $unwind: {
            path: "$song",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            song: {
              $cond: [
                {
                  $ifNull: ["$song", false],
                },
                "$song",
                null,
              ],
            },
          },
        },
        {
          $facet: {
            reel: [
              { $skip: (start - 1) * limit }, // how many records you want to skip
              { $limit: limit },
            ],
            pageInfo: [
              { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
            ],
          },
        },
      ]);

      return res.status(200).json({
        status: true,
        message: "Success !",
        // reel,
        reel: reel[0].reel,
        totalReel:
          reel[0].pageInfo.length > 0 ? reel[0].pageInfo[0].totalRecord : 0,
      });
    }
    return res.status(200).json({ status: false, message: "Invalid Details" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};


//ban reels
exports.banReel = async (req, res) => {
  try {
    if (!req.body.reelId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });
    const reel = await Reel.findById(req.body.reelId);
    if (!reel)
      return res
        .status(200)
        .json({ status: false, message: "reel does not Exist!" });
    
    reel.isReported = true;

    await reel.save();
    return res
      .status(200)
      .json({ status: true, message: "Reel Reported Successfully!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Show Specfic in Reel OR Not [frontend]
exports.getSpecificReel = async (req, res) => {
  try {
    const reelexits = await Reel.findById(req.query.reelId);
    const user =  await User.findById(ObjectId(reelexits.userId));
    //console.log(user);
    //const reel = await Reel.findById(req.query.reelId).populate("userId song");

  const reel = await Reel.aggregate([
    { $match: { _id: reelexits._id } },
    {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: "songs",
          localField: "song",
          foreignField: "_id",
          as: "song",
        },
      },
      {
        $unwind: { path: "$song", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "likes",
          let: { userIds: user._id, reelIds: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$reelId", "$$reelIds"] },
                    { $eq: ["$userId", "$$userIds"] },
                  ],
                },
              },
            },
          ],
          as: "isLike",
        },
      },
      {
        $unwind: { path: "$isLike", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          isLike: {
            $cond: [
              {
                $ifNull: ["$isLike", false],
              },
              true,
              false,
            ],
          },
        },
      },



    {$project:{
      isOriginalAudio: 1,
      like: 1,
      comment: 1,
      allowComment: 1,
      isDelete: 1,
      service_price:1,
      initial_price:1,
      remaining_price:1,
      service:1,
      isService:1,
      availabileTime:1,
      categoryId:1,
      lat:1,
      long:1,
      speed:1,
      isReported:1,
      userId:1,
      video:1,
      song:{ "_id" : "$song._id", "title" : "$song.title", "singer" : "$song.singer", "image" : "$song.image", "song" : "$song.song" },
      location:1,
      caption:1,
      thumbnail:1,
      screenshot:1,
      view:1,
      song:{ "_id" : "$song._id", "title" : "$song.title", "singer" : "$song.singer", "image" : "$song.image", "song" : "$song.song" },
      location:1,
      caption:1,
      thumbnail:1,
      screenshot:1,
      view:1,
      user : { "_id" : "$user._id", "user_id" : "$user.user_id", "password" : "$user.password", "name" : "$user.name", "username" : "$user.username", "bio" : "$user.bio" ,
      "followers" : "$user.followers" , "following" : "$user.following", "like": "$user.like", "view" : "$user.view", "comment" : "$user.comment" ,
        "reels" : "$user.reels", "coin" : "$user.coin" , "profileImage" : "$user.profileImage", "coverImage" : "$user.coverImage", "isBlock": "$user.isBlock",
        "isOnline" : "$user.isOnline", "user_role" : "$user.user_role" , "user_phone": "$user.user_phone" , "isReport" : "$user.isReport", "email" :"$user.email",
        "fcm_token": "$user.fcm_token", "lastLogin" : "$user.lastLogin"},
      isLike:1,
      analyticDate:1,
    }}
  ]);

    //db.users.aggregate([{$match:{"_id":"<some_value>"}},{$project:{id:"$user_id", default_key:"default_value", "excluded_key": 0, "included_key": 1}}])
    if (!reel)
      return res
        .status(200)
        .json({ status: false, message: "reel does not Exist!" });
    return res.status(200).json({ status: true, message: "Success!!", reel });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//Get Reported Reels List//
exports.reportedReelList = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    let dateFilterQuery = {};
    let sDate, eDate;
    if (req.query.startDate !== "ALL" && req.query.endDate !== "ALL") {
      sDate = req.query.startDate + "T00:00:00.000Z";
      eDate = req.query.endDate + "T00:00:00.000Z";

      //for date query
      dateFilterQuery = {
        analyticDate: { $gte: new Date(sDate), $lte: new Date(eDate) },
      };
    }

    const reel = await Reel.aggregate([
      // { $match: { isReported: true } },
      { $match: { "isDelete" : false, "isReported": true} },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: "songs",
          localField: "song",
          foreignField: "_id",
          as: "song",
        },
      },
      {
        $unwind: { path: "$song", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          song: {
            $cond: [
              {
                $ifNull: ["$song", false],
              },
              "$song",
              null,
            ],
          },
        },
      },

      {
        $addFields: {
          analyticDate: {
            $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
          },
        },
      },

      {
        $match: dateFilterQuery,
      },
      {
        $sort: { analyticDate: -1 },
      },
      {
        $facet: {
          reel: [
            { $skip: (start - 1) * limit }, // how many records you want to skip
            { $limit: limit },
          ],
          pageInfo: [
            { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
          ],
        },
      },
    ]);
    return res.status(200).json({
      status: true,
      message: "Success !",
      reel: reel[0].reel,
      totalReel:
        reel[0].pageInfo.length > 0 ? reel[0].pageInfo[0].totalRecord : 0,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

// Show Un report ban reel//
exports.unban = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.reelId);
    if (!reel)
      return res
        .status(200)
        .json({ status: false, message: "reel does not Exist!" });

    reel.isReported = false;
    await reel.save();

    return res.status(200).json({ status: true, message: "Success!!", reel });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
//delete video by user
exports.deleteReel = async (req, res) => {
  try {
    
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });

    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist" });

    if (!req.query.reelId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });
    const reel = await Reel.findById(req.query.reelId);
    if (!reel)
      return res
        .status(200)
        .json({ status: false, message: "reel does not Exist!" });
    if (fs.existsSync(reel.video)) {
      fs.unlinkSync(reel.video);
    }
    if (fs.existsSync(reel.thumbnail)) {
      fs.unlinkSync(reel.thumbnail);
    }
    if (fs.existsSync(reel.screenshot)) {
      fs.unlinkSync(reel.screenshot);
    }
    if (fs.existsSync(reel.productImage)) {
      fs.unlinkSync(reel.productImage);
    }

    await Comment.deleteMany({ reelId: reel._id });
    await Like.deleteMany({ reelId: reel._id });

    await User.updateOne(
      { _id: reel.userId },
      { $inc: { like: -reel.like, comment: -reel.comment } }
    );

    // const user = await User.findById(reel.userId);

    if (user) {
      user.reels -= 1;
      user.save();
    }

    reel.like = 0;
    reel.comment = 0;
    reel.isDelete = true;

    await reel.save();
    return res
      .status(200)
      .json({ status: true, message: "Reel Deleted Successfully!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};




// Find Distance BTW two points

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2022            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


exports.findDistance = async (req, res) => {
  try {

    const distance_l = geolib.getDistance(
      // 31.53915724356474, 74.33072159404392
      { latitude: 31.4657511, longitude: 74.3075253 },
      { latitude: 31.4084003, longitude: 74.26223019999999 }
  )
  const distance_p = geolib.getPreciseDistance(
    { latitude: 31.4657511, longitude: 74.3075253 },
      { latitude: 31.4084003, longitude: 74.26223019999999 }
);

  const isPointWithinRadius = geolib.isPointWithinRadius(
  { latitude: 31.4657511, longitude: 74.3075253 },
      { latitude: 31.4084003, longitude: 74.26223019999999 },
  8000
);
console.log(distance_l / 1000) //value in km
console.log(distance_p / 1000) //value in km
console.log(isPointWithinRadius) //value in km


    const pu_lat = "31.4657511";
    const pu_long = "74.3075253";
    const do_lat = "31.4084003";
    const do_long = "74.26223019999999";
    const BestDis = distance(pu_lat,pu_long,do_lat,do_long);
    if (!BestDis)
      return res
        .status(200)
        .json({ status: false, message: "reel does not Exist!" });

    return res.status(200).json({ status: true, message: "Success!!", BestDis });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distance(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
}
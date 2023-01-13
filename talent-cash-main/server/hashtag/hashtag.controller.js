const Hashtag = require("./hashtag.model");
const User = require("../user/user.model");
const Song = require("../song/song.model");
const Like = require("../like/like.model");
const Banner = require("../banner/banner.model");
const fs = require("fs");

// get hashtag list [android]
exports.index = async (req, res) => {
  try {
      let userRecord = '';
      if (req.query.userId)
      {
        const userRecord = await User.findById(req.query.userId);
        //console.log(userRecord);
        if (!userRecord)
          return res
            .status(200)
            .json({ status: false, message: "User Does not Exist" });
      }

    var hashtagQuery = {};
    if (req.query.type === "ALL") {
      hashtagQuery = { hashtag: { $ne: "" } };
    } else {
      hashtagQuery = { hashtag: { $regex: req.query.type, $options: "i" } };
    }

    const start = req.query.start ? parseInt(req.query.start) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    console.log(start + 'lim'+limit);

    const hashtag = await Hashtag.aggregate([
      { $match: hashtagQuery },
      {
        $lookup: {
          from: "reels",
          let: { hashtag: "$hashtag" },
          as: "reel",
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$hashtag", "$hashtag"],
                },
              },
            },
            {
              $match: {
                $expr: {
                  //$eq: ["$isDelete", false],
                  $and: [
                    { $eq: ["$isDelete", false ] },
                    { $eq: ["$isReported", false ] },
                  ],
                },
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
              $unwind: { path: "$user", preserveNullAndEmptyArrays: false },
            },
            // for like
            {
              $lookup: {
                from: "likes",
                let: { userIds: userRecord._id, reelIds: "$reel._id"  },
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
            //by umar
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
          ],
        },
      },

      {
        $project: {
          hashtag: 1,
          image: 1,
          coverImage: 1,
          description: 1,
          reel: 1,
          videoCount: { $size: "$reel" },
          likes: { $sum: "$reel.like" },
          comments: { $sum: "$reel.comment" },
        },
      },
      {
        $sort: { videoCount: -1 },
      },
      {
        // $facet: {
        //   hashtag: [
        //     { $skip: req.query.start ? parseInt(req.query.start) : 0 }, // how many records you want to skip
        //     { $limit: req.query.limit ? parseInt(req.query.limit) : 20 },
        //   ],
        // pageInfo: [
        //   { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
        // ],
        // },
        $facet: {
          hashtag: [
            { $skip: start * limit }, // how many records you want to skip
            { $limit: limit },
          ],
          pageInfo: [
            { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
          ],
        },
      },
    ]);
    const banner = await Banner.find().sort({ createdAt: -1 });

    if (!hashtag)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res.status(200).json({
      status: true,
      message: "Success!!",
      hashtag: hashtag[0].hashtag,
      totalHashTags: hashtag[0].pageInfo.length > 0 ? hashtag[0].pageInfo[0].totalRecord : 0,
      banner,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get only hashtag name list
exports.getHashtagName = async (req, res) => {
  try {
    const hashtag = await Hashtag.aggregate([
      {
        $lookup: {
          from: "reels",
          let: { hashtag: "$hashtag" },
          as: "reel",
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$hashtag", "$hashtag"],
                },
              },
            },
            {
              $match: {
                $expr: {
                  $eq: ["$isDelete", false],
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          hashtag: 1,

          videoCount: { $size: "$reel" },
        },
      },
    ]);
    return res
      .status(200)
      .json({ status: true, message: "Successful", hashtag });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get hashtag [Backend]
exports.get = async (req, res) => {
  try {
    const hashtag = await Hashtag.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ status: true, message: "Successful", hashtag });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// search hashtag
exports.search = async (req, res) => {
  try {
    const hashtag = await Hashtag.find({
      hashtag: { $regex: req.query.value, $options: "i" },
    })
      .skip(req.query.start ? parseInt(req.query.start) : 0)
      .limit(req.query.limit ? parseInt(req.query.limit) : 20);

    if (!hashtag)
      return res.status({ status: false, message: "No data found!" });

    return res
      .status(200)
      .json({ status: true, message: "Success!!", hashtag });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// create hashtag
exports.store = async (req, res) => {
  try {
    if (!req.body.hashtag)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    var removeComa = req.body.hashtag.replace(/,\s*$/, "");

    var hashtagList = removeComa.split(",");

    const hashtags = hashtagList.map((hashtag) => ({
      hashtag: hashtag.toLowerCase(),
      image: req.files.image ? req.files.image[0].location : null,
      coverImage: req.files.coverImage ? req.files.coverImage[0].location : null,
      description: req.body.description,
    }));

    const hashtag = await Hashtag.insertMany(hashtags);

    return res
      .status(200)
      .json({ status: true, message: "Success!!", hashtags: hashtags });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update hashtag
exports.update = async (req, res) => {
  try {
    const hashtag = await Hashtag.findById(req.params.hashtagId);

    if (!hashtag)
      return res
        .status(200)
        .json({ status: false, message: "Hashtag does not Exist!" });

    if (req.files.image) {
      if (fs.existsSync(hashtag.image)) {
        fs.unlinkSync(hashtag.image);
      }
      hashtag.image = req.files.image[0].location;
    }
    if (req.files.coverImage) {
      if (fs.existsSync(hashtag.coverImage)) {
        fs.unlinkSync(hashtag.coverImage);
      }
      hashtag.coverImage = req.files.coverImage[0].location;
    }
    hashtag.hashtag = req.body.hashtag.toLowerCase();
    hashtag.description = req.body.description;

    await hashtag.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!!", hashtag });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete hashtag
exports.destroy = async (req, res) => {
  try {
    const hashtag = await Hashtag.findById(req.params.hashtagId);

    if (!hashtag)
      return res
        .status(200)
        .json({ status: false, message: "Hashtag does not Exist!" });

    if (fs.existsSync(hashtag.image)) {
      fs.unlinkSync(hashtag.image);
    }
    if (fs.existsSync(hashtag.coverImage)) {
      fs.unlinkSync(hashtag.coverImage);
    }

    await hashtag.deleteOne();

    return res.status(200).json({ status: true, message: "Success!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

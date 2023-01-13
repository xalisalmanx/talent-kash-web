const Follower = require("./follower.model");
const User = require("../user/user.model");
const Notification = require("../notification/notification.model");

//dayjs
const dayjs = require("dayjs");
const { baseURL } = require("../../config");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

//follow and unfollow

exports.followAndUnfollow = async (req, res) => {
  try {
    if (req.body.from && req.body.to) {
      const fromUser = await User.findById(req.body.from);
      const toUser = await User.findById(req.body.to);

      if (!fromUser)
        return res
          .status(200)
          .json({ status: false, message: "From User Does Not Exist !" });
      if (!toUser)
        return res
          .status(200)
          .json({ status: false, message: "To User Does Not Exist !" });

      const followUser = await Follower.findOne({
        $and: [
          {
            fromUserId: fromUser._id,
            toUserId: toUser._id,
          },
        ],
      });

      //unfollow
      if (followUser) {
        await Follower.deleteOne({
          $and: [
            {
              fromUserId: fromUser._id,
              toUserId: toUser._id,
            },
          ],
        });

        if (fromUser.following > 0) {
          fromUser.following -= 1;
          await fromUser.save();
        }
        if (toUser.followers > 0) {
          toUser.followers -= 1;
          await toUser.save();
        }

        return res.status(200).send({
          status: true,
          message: "User unFollowed successfully!!",
          isFollow: false,
        });
      } else {
        //follow
        const followData = {
          fromUserId: fromUser._id,
          toUserId: toUser._id,
        };

        const follower = new Follower(followData);

        fromUser.following += 1;
        await fromUser.save();

        toUser.followers += 1;
        await toUser.save();

        follower.save(async (error, like) => {
          if (error) {
            return res
              .status(200)
              .json({ status: false, error: error.message || "Server Error!" });
          } else {
            if (!toUser.isBlock && toUser.notification) {
              const payload = {
                to: toUser.fcm_token,
                notification: {
                  title: `${fromUser.name} started following you.`,
                },
                data: {
                  data: fromUser._id,
                  type: "USER",
                },
              };

              notificationData = {
                userId: toUser._id,
                otherUserId: fromUser._id,
                message: payload.notification.title,
                notificationType: 0,
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
          }
        });

        return res.status(200).send({
          status: true,
          message: "User Followed successfully!!",
          isFollow: true,
        });
      }
    } else {
      return res.status(200).json({
        status: false,
        message: "Invalid Details !",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//get user followers
exports.getFollowers = async (req, res) => {
  try {
    if (!req.query.userId)
      return res.status(200).json({
        status: false,
        message: "Invalid Details !",
      });

    const userExist = await User.findById(req.query.userId);

    if (!userExist)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist ! " });

    var searchQuery = { $match: { "followers._id": { $ne: null } } };
    if (req.query.search !== "") {
      searchQuery = {
        $match: {
          $or: [
            { "followers.name": { $regex: req.query.search, $options: "i" } },
            {
              "followers.username": { $regex: req.query.search, $options: "i" },
            },
          ],
        },
      };
    }

    const user = await Follower.aggregate([
      {
        $match: { toUserId: userExist._id },
      },
      {
        $lookup: {
          from: "users",
          localField: "fromUserId",
          foreignField: "_id",
          as: "followers",
        },
      },
      {
        $unwind: { path: "$followers", preserveNullAndEmptyArrays: false },
      },
      searchQuery,
      {
        $sort: { createdAt: -1 },
      },

      {
        $lookup: {
          from: "followers",
          let: { toUserId: "$toUserId", fromUserId: "$fromUserId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$toUserId", "$$fromUserId"],
                    },
                    {
                      $eq: ["$fromUserId", "$$toUserId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "follower",
        },
      },
      {
        $unwind: { path: "$follower", preserveNullAndEmptyArrays: true },
      },

      {
        $project: {
          _id: 0,
          userId: "$followers._id",
          name: "$followers.name",
          username: "$followers.username",
          gender: "$followers.gender",
          image: "$followers.profileImage",
          bio: "$followers.bio",
          isFollow: {
            $cond: {
              if: "$follower",
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $facet: {
          follower: [
            { $skip: req.query.start ? parseInt(req.query.start) : 0 }, // how many records you want to skip
            { $limit: req.query.limit ? parseInt(req.query.limit) : 20 },
          ],
          pageInfo: [
            { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
          ],
        },
      },
    ]);

    return res
      .status(200)
      .json({ status: true, message: " Followers", user: user[0].follower,
      totalRecord:user[0].pageInfo.length > 0 ? user[0].pageInfo[0].totalRecord : 0
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//get follower[bhuro]
exports.getFollowerB = async (req, res) => {
  try {
    if (!req.query.userId) {
      return res.status(200).json({
        status: false,
        message: "All details are required",
      });
    }

    const user = await User.findById(req.query.userId);
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found",
      });
    }

    const followers = await Follower.aggregate([
      { $match: { toUserId: user._id } },
      {
        $lookup: {
          from: "users",
          localField: "fromUserId",
          foreignField: "_id",
          as: "user_info",
        },
      },
      {
        $unwind: "$user_info",
      },
      {
        $lookup: {
          from: "followers",
          // localField: "followedBy",
          // foreignField: "followingTo",
          let: { toUserId: "$toUserId", fromUserId: "$fromUserId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$toUserId", "$$fromUserId"],
                    },
                    {
                      $eq: ["$fromUserId", "$$toUserId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "follower_user_info",
        },
      },
      {
        $unwind: {
          path: "$follower_user_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          user_id: "$user_info._id",
          user_name: "$user_info.name",
          isFollowedByYou: {
            $cond: {
              if: "$follower_user_info",
              then: true,
              else: false,
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      followers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: error.message || "Internal server error",
    });
  }
};

//get user following
exports.getFollowings = async (req, res) => {
  try {
    if (!req.query.userId)
      return res.status(200).json({
        status: false,
        message: "Invalid Details !",
      });

    const userExist = await User.findById(req.query.userId);

    if (!userExist)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist ! " });

    var searchQuery = { $match: { "following._id": { $ne: null } } };
    if (req.query.search !== "") {
      searchQuery = {
        $match: {
          $or: [
            { "following.name": { $regex: req.query.search, $options: "i" } },
            {
              "following.username": { $regex: req.query.search, $options: "i" },
            },
          ],
        },
      };
    }

    const userFollow = await Follower.aggregate([
      {
        $match: { fromUserId: userExist._id },
      },

      {
        $lookup: {
          from: "users",
          localField: "toUserId",
          foreignField: "_id",
          as: "following",
        },
      },
      searchQuery,
      {
        $sort: { createdAt: -1 },
      },
      {
        $unwind: { path: "$following", preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          _id: 0,
          userId: "$following._id",
          name: "$following.name",
          username: "$following.username",
          gender: "$following.gender",
          image: "$following.profileImage",
          bio: "$following.bio",
        },
      },
      {
        $addFields: { isFollow: false },
      },
      {
        $facet: {
          follower: [
            { $skip: req.query.start ? parseInt(req.query.start) : 0 }, // how many records you want to skip
            { $limit: req.query.limit ? parseInt(req.query.limit) : 20 },
           
          ],
          pageInfo: [
            { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
          ],
        },
       
      },
    ]);

    return res.status(200).json({
      status: true,
      message: " Followers",
      user: userFollow[0].follower,
      totalRecord: userFollow[0].pageInfo.length > 0 ? userFollow[0].pageInfo[0].totalRecord : 0
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//get followers following list [backend]
exports.getFollowerFollowing = async (req, res) => {
  try {
    if (!req.query.type || !req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "invalid Details" });

    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist ! " });
    var user_;
    if (req.query.type === "following") {
      user_ = await Follower.find({ fromUserId: user._id }).populate(
        "toUserId"
      );
    }
    if (req.query.type === "follower") {
      user_ = await Follower.find({ toUserId: user._id }).populate(
        "fromUserId"
      );
    }
    return res
      .status(200)
      .json({ status: true, message: "Successful !", user: user_ });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

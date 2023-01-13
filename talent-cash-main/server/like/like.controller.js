const User = require("../user/user.model");
const Reel = require("../reels/reels.model");
const Like = require("./like.model");
const Notification = require("../notification/notification.model");
const dayjs = require("dayjs");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

exports.likeAndDislike = async (req, res) => {
  try {
    if (req.body.userId && req.body.reelId) {
      const user = await User.findById(req.body.userId);
      const reel = await Reel.findById(req.body.reelId).populate("song");

      if (!user)
        return res
          .status(200)
          .json({ status: false, message: " User Does Not Exist !" });
      if (!reel)
        return res
          .status(200)
          .json({ status: false, message: " Reel Does Not Exist !" });

      const likePost = await Like.findOne({
        $and: [
          {
            userId: user._id,
            reelId: reel._id,
          },
        ],
      });

      const reelOwner = await User.findOne({ _id: reel.userId });

      //dislike
      if (likePost) {
        await Like.deleteOne({
          $and: [
            {
              userId: user._id,
              reelId: reel._id,
            },
          ],
        });

        if (reelOwner.like > 0) {
          reelOwner.like -= 1;
          await reelOwner.save();
        }
        if (reel.like > 0) {
          reel.like -= 1;
          await reel.save();
        }

        return res.status(200).send({
          status: true,
          message: "Reel dislike successfully!!",
          isLike: false,
        });
      } else {
        //like

        const likeData = {
          userId: user._id,
          reelId: reel._id,
        };

        const like = new Like(likeData);

        like.save(async (error, like) => {
          if (error) {
            return res
              .status(200)
              .json({ status: false, error: error.message || "Server Error!" });
          } else {
            console.log(
              "id",
              req.body.userId.toString() !== reelOwner._id.toString()
            );
            console.log("reelOwner", !reelOwner.isBlock);
            if (
              req.body.userId.toString() !== reelOwner._id.toString() &&
              !reelOwner.isBlock &&
              reelOwner.notification
            ) {
              const payload = {
                to: reelOwner.fcm_token,
                notification: {
                  title: `${user.name} like your Reel.`,
                },
                data: {
                  data: [
                    {
                      _id: reel._id,
                      hashtag: reel.hashtag,
                      mentionPeople: reel.mentionPeople,
                      isOriginalAudio: reel.isOriginalAudio,
                      like: reel.like,
                      comment: reel.comment,
                      allowComment: reel.allowComment,
                      showVideo: reel.showVideo,
                      isDelete: reel.isDelete,
                      userId: reelOwner._id,
                      video: reel.video,
                      location: reel.location,
                      caption: reel.caption,
                      thumbnail: reel.thumbnail,
                      screenshot: reel.screenshot,
                      song: reel.song,
                      name: reelOwner.name,
                      userImage: reelOwner.profileImage,
                      isLike: true,
                    },
                  ],
                  type: "REEL",
                },
              };

              console.log("payload", payload);

              notificationData = {
                userId: reelOwner._id,
                otherUserId: user._id,
                reelId: reel._id,
                notificationType: 1,
                message: payload.notification.title,
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
            reelOwner.like += 1;
            await reelOwner.save();

            reel.like += 1;
            await reel.save();
          }
        });

        return res.status(200).send({
          status: true,
          message: "Reel Like successfully!!",
          isLike: true,
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

//get reel likes
exports.index = async (req, res) => {
  try {
    if (!req.query.reelId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });

    const reelExist = await Reel.findById(req.query.reelId);

    if (!reelExist)
      return res
        .status(200)
        .json({ status: false, message: "Reel Does not Exist ! " });

    const like = await Like.find({ reelId: reelExist._id })
      .populate("userId reelId")
      .sort({ createdAt: -1 });

    let now = dayjs();

    if (req.query.type === "ADMIN") {
      const likes = await like.map((data) => ({
        _id: data._id,
        screenshot: data.reelId ? data.reelId.screenshot : "",
        userId: data.userId ? data.userId._id : "",
        image: data.userId ? data.userId.image : "",
        name: data.userId ? data.userId.name : "",
        username: data.userId ? data.userId.username : "",
        user: data.userId ? data.userId : null,

        time:
          now.diff(data.createdAt, "minute") <= 60 &&
          now.diff(data.createdAt, "minute") >= 0
            ? now.diff(data.createdAt, "minute") + " minutes ago"
            : now.diff(data.createdAt, "hour") >= 24
            ? dayjs(data.createdAt).format("DD MMM, YYYY")
            : now.diff(data.createdAt, "hour") + " hour ago",
      }));

      return res
        .status(200)
        .json({ status: true, message: "Successful !", like: likes });
    }
    const likes = await like.map((data) => ({
      _id: data._id,
      screenshot: data.reelId ? data.reelId.screenshot : "",
      userId: data.userId ? data.userId._id : "",
      image: data.userId ? data.userId.image : "",
      name: data.userId ? data.userId.name : "",
      username: data.userId ? data.userId.username : "",

      time:
        now.diff(data.createdAt, "minute") <= 60 &&
        now.diff(data.createdAt, "minute") >= 0
          ? now.diff(data.createdAt, "minute") + " minutes ago"
          : now.diff(data.createdAt, "hour") >= 24
          ? dayjs(data.createdAt).format("DD MMM, YYYY")
          : now.diff(data.createdAt, "hour") + " hour ago",
    }));

    return res
      .status(200)
      .json({ status: true, message: "Successful !", like: likes });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//get all like of user
exports.allLike = async (req, res) => {
  try {
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });

    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist ! " });

    const like = await Reel.aggregate([
      {
        $match: { userId: user._id },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "reelId",
          as: "likes",
        },
      },
      {
        $unwind: { path: "$likes", preserveNullAndEmptyArrays: false },
      },

      {
        $lookup: {
          from: "users",
          localField: "likes.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          _id: "$likes._id",
          userId: "$likes.userId",
          reelId: "$_id",
          screenshot: 1,
          name: "$user.name",
          username: "$user.username",
          image: "$user.image",
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    let now = dayjs();
    const likes = await like.map((data) => ({
      _id: data._id,
      userId: data.userId,
      screenshot: data.screenshot,
      image: data.image,
      name: data.name,
      username: data.username,

      time:
        now.diff(data.createdAt, "minute") <= 60 &&
        now.diff(data.createdAt, "minute") >= 0
          ? now.diff(data.createdAt, "minute") + " minutes ago"
          : now.diff(data.createdAt, "hour") >= 24
          ? dayjs(data.createdAt).format("DD MMM, YYYY")
          : now.diff(data.createdAt, "hour") + " hour ago",
    }));
    return res
      .status(200)
      .json({ status: true, message: "Successful !", like: likes });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

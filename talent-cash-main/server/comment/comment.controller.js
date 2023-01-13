const User = require("../user/user.model");
const Reel = require("../reels/reels.model");
const Comment = require("../comment/comment.model");
const Notification = require("../notification/notification.model");
const dayjs = require("dayjs");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

//get comment of reels
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

    const comment = await Comment.find({ reelId: reelExist._id })
      .populate("userId reelId")
      .sort({ createdAt: -1 });

    let now = dayjs();

    if (req.query.type === "ADMIN") {
      const comments = await comment.map((data) => ({
        _id: data._id,
        userId: data.userId ? data.userId._id : "",
        screenshot: data.reelId ? data.reelId.screenshot : "",
        image: data.userId ? data.userId.image : "",
        name: data.userId ? data.userId.name : "",
        username: data.userId ? data.userId.username : "",
        comment: data.comment,
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
        .json({ status: true, message: "Successful !", comment: comments });
    }

    const comments = await comment.map((data) => ({
      _id: data._id,
      userId: data.userId ? data.userId._id : "",
      screenshot: data.reelId ? data.reelId.screenshot : "",
      image: data.userId ? data.userId.profileImage : "",
      name: data.userId ? data.userId.name : "",
      username: data.userId ? data.userId.username : "",
      comment: data.comment,
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
      .json({ status: true, message: "Successful !", comment: comments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//get all comment of user
exports.allComment = async (req, res) => {
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

    const comment = await Reel.aggregate([
      {
        $match: { userId: user._id },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "reelId",
          as: "comments",
        },
      },
      {
        $unwind: { path: "$comments", preserveNullAndEmptyArrays: false },
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
        $project: {
          _id: "$comments._id",
          reelId: "$_id",
          userId: "$user._id",
          comment: "$comments.comment",
          screenshot: 1,
          name: "$user.name",
          image: "$user.image",
          createdAt: "$comments.createdAt",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    let now = dayjs();
    const comments = await comment.map((data) => ({
      _id: data._id,
      userId: data.userId,
      screenshot: data.screenshot,
      image: data.image,
      name: data.name,
      comment: data.comment,

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
      .json({ status: true, message: "Successful !", comment: comments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//create comment
exports.store = async (req, res) => {
  try {
    if (req.body.userId && req.body.reelId && req.body.comment) {
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

      const reelOwner = await User.findById(reel.userId);

      const commentData = {
        userId: req.body.userId,
        reelId: req.body.reelId,
        comment: req.body.comment.trim(),
      };
      const comment = await new Comment(commentData);

      await comment.save(async (error, comment) => {
        if (error) {
          return res
            .status(200)
            .json({ status: false, error: error.message || "Server Error!" });
        } else {
          const data = await Comment.find({ _id: comment._id }).populate(
            "userId reelId"
          );

          let now = dayjs();

          var comment_ = await data.map((data) => ({
            _id: data._id,
            userId: data.userId ? data.userId._id : "",
            screenshot: data.reelId ? data.reelId.screenshot : "",
            image: data.userId ? data.userId.profileImage : "",
            name: data.userId ? data.userId.name : "",
            username: data.userId ? data.userId.username : "",
            comment: data.comment,
            time:
              now.diff(data.createdAt, "minute") <= 60 &&
              now.diff(data.createdAt, "minute") >= 0
                ? now.diff(data.createdAt, "minute") + " minutes ago"
                : now.diff(data.createdAt, "hour") >= 24
                ? dayjs(data.createdAt).format("DD MMM, YYYY")
                : now.diff(data.createdAt, "hour") + " hour ago",
          }));

          if (
            req.body.userId.toString() !== reelOwner._id.toString() &&
            !reelOwner.isBlock &&
            reelOwner.notification
          ) {
            const payload = {
              to: reelOwner.fcm_token,
              notification: {
                title: `${user.name} commented on your Reel.`,
              },
              data: {
                data: [
                  {
                    _id: reel._id,
                    commented_user_id : user._id,
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

                  },
                ],
                //type: "REEL",
                type: "COMMENT",
              },
            };

            notificationData = {
              userId: reelOwner._id,
              otherUserId: user._id,
              reelId: reel._id,
              notificationType: 2,
              message: `${user.name}: ${comment.comment}`,
              date: new Date().toLocaleString("en-US"),
            };

            const notification = new Notification(notificationData);
            await notification.save();

            console.log("payload", payload);

            await fcm.send(payload, function (err, response) {
              if (err) {
                console.log("Something has gone wrong!", err);
              }
            });
          }
          reel.comment += 1;
          await reel.save();

          reelOwner.comment += 1;
          await reelOwner.save();
        }

        return res.status(200).json({
          status: true,
          message: "Comment Create Successful ✔",
          comment: comment_,
        });
      });
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

//delete comment
exports.destroy = async (req, res) => {
  try {
    const comment = await Comment.findById(req.query.commentId).populate(
      "reelId"
    );

    if (!comment)
      return res
        .status(200)
        .json({ status: false, message: "Comment Not Exist !" });

    await comment.deleteOne();
    await Reel.updateOne(
      { _id: comment.reelId._id },
      {
        $inc: { comment: -1 },
      }
    ).where({ comment: { $gt: 0 } });
    await User.updateOne(
      { _id: comment.reelId.userId },
      {
        $inc: { comment: -1 },
      }
    ).where({ comment: { $gt: 0 } });
    return res.status(200).json({
      status: true,
      message: "Comment Delete Successful ✔",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

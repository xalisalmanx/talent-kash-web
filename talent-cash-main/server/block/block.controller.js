const Block = require("./block.model");
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

exports.blockAndUnblock = async (req, res) => {
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

      const blockUser = await Block.findOne({
        $and: [
          {
            fromUserId: fromUser._id,
            toUserId: toUser._id,
          },
        ],
      });

      //unblock
      if (blockUser) {
        await Block.deleteOne({
          $and: [
            {
              fromUserId: fromUser._id,
              toUserId: toUser._id,
            },
          ],
        });

        // if (fromUser.following > 0) {
        //   fromUser.following -= 1;
        //   await fromUser.save();
        // }
        // if (toUser.followers > 0) {
        //   toUser.followers -= 1;
        //   await toUser.save();
        // }

        return res.status(200).send({
          status: true,
          message: "User unBlocked successfully!!",
          isBlock: false,
        });
      } else {
        //block
        const blockData = {
          fromUserId: fromUser._id,
          toUserId: toUser._id,
        };

        const block = new Block(blockData);

        // fromUser.following += 1;
        // await fromUser.save();

        // toUser.followers += 1;
        // await toUser.save();

        block.save(async (error, like) => {
          if (error) {
            return res
              .status(200)
              .json({ status: false, error: error.message || "Server Error!" });
          } else {
          }
        });

        return res.status(200).send({
          status: true,
          message: "User Blocked successfully!!",
          isBlock: true,
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

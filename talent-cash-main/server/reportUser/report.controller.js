const Report = require("./report.model");
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

exports.reportUser = async (req, res) => {
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

      const reportUser = await Report.findOne({
        $and: [
          {
            fromUserId: fromUser._id,
            toUserId: toUser._id,
          },
        ],
      });
      if (reportUser)
        return res
          .status(200)
          .json({ status: false, message: "This user already reported !" });
        //report user
        const reportData = {
          fromUserId: fromUser._id,
          toUserId: toUser._id,
        };

        const report = new Report(reportData);

        report.save(async (error, like) => {
          if (error) {
            return res
              .status(200)
              .json({ status: false, error: error.message || "Server Error!" });
          } else {
          }
        });

        return res.status(200).send({
          status: true,
          message: "User Report successfully!!",
          isReport: true,
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

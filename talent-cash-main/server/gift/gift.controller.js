const Gift = require("./gift.model");
const User = require("..//user/user.model");
const Setting = require("../setting/setting.model");
const Wallet = require("../wallet/wallet.model");
const Reel = require("../reels/reels.model");
const Notification = require("../notification/notification.model");
const fs = require("fs");
const { deleteFiles, deleteFile } = require("../../util/deleteFile");
const mongoose = require("mongoose");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
const { Mongoose } = require("mongoose");
var fcm = new FCM(config.SERVER_KEY);

// get all gift
exports.index = async (req, res) => {
  try {
    const gift = await Gift.find({ isDelete: false }).sort({ createdAt: -1 });

    return res.status(200).json({ status: true, message: "Success!!", gift });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//store multiple gift
exports.store = async (req, res) => {
  try {
    if (!req.body.coin || !req.files) {
      if (req.files) {
        deleteFiles(req.files);
      }
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    }

    const gift = req.files.map((gift) => ({
      image: gift.path,
      coin: req.body.coin,
      type: gift.mimetype === "image/gif" ? 1 : 0,
    }));

    const gifts = await Gift.insertMany(gift);

    return res.status(200).json({
      status: true,
      message: "Success!",
      gift: gifts,
    });
  } catch (error) {
    deleteFiles(req.files);
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update gift
exports.update = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.giftId);

    if (!gift) {
      deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Gift does not Exist!" });
    }
    if (req.file) {
      if (fs.existsSync(gift.image)) {
        fs.unlinkSync(gift.image);
      }
      gift.type = req.file.mimetype === "image/gif" ? 1 : 0;
      gift.image = req.file.path;
    }
    gift.coin = req.body.coin;

    await gift.save();

    return res.status(200).json({ status: true, message: "Success!", gift });
  } catch (error) {
    console.log(error);
    deleteFile(req.file);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete gift
exports.destroy = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.giftId);

    if (!gift)
      return res
        .status(200)
        .json({ status: false, message: "Gift does not Exist!" });

    gift.isDelete = true;
    gift.save();

    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//top switch api
// exports.top = async (req, res) => {
//   try {
//     const gift = await Gift.findById(req.params.giftId);
//     if (!gift)
//       return res
//         .status(200)
//         .json({ status: false, message: "Gift does not Exist!" });
//     gift.isTop = !gift.isTop;
//     gift.save();
//     return res.status(200).json({ status: true, message: "Success!", gift });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: false, error: error.message || "Server Error" });
//   }
// };

//sent gift to user
exports.sendGift = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.reelId || !req.body.gift)
      return res.status(200).json({
        status: false,
        message: "Invalid Details !",
      });

    const sender = await User.findById(req.body.userId);
    if (!sender)
      return res
        .status(200)
        .json({ status: false, message: "Sender User Does Not Exist !" });
    const reel = await Reel.findById(req.body.reelId);
    if (!reel)
      return res
        .status(200)
        .json({ status: false, message: "Reel Does Not Exist !" });

    const existGift = await Gift.findById(req.body.gift);

    if (!existGift)
      return res
        .status(200)
        .json({ status: false, message: "Gift Does Not Exist !" });

    const receiver = await User.findById(reel.userId);

    if (req.body.userId == receiver._id)
      return res.status(200).json({
        status: false,
        message: "You are not able to send gift on your reel!",
      });

    if (sender.coin < existGift.coin)
      return res
        .status(200)
        .json({ status: false, message: "Coin not enough!" });

    //find gift is present in user and update the count of gift
    const user = await User.findOneAndUpdate(
      { _id: receiver._id, "gift.gift": existGift._id },
      { $inc: { "gift.$.count": 1 } },
      {
        new: true,
      }
    );

    // add new gift in user
    const receiverUser = await User.findById(receiver._id);
    if (!user) {
      const list = {
        gift: existGift._id,
        count: 1,
      };

      receiverUser.gift.push(list);
      await receiverUser.save();
    }

    sender.coin -= existGift.coin;
    await sender.save();

    const setting = await Setting.findOne({});

    if (user) {
      user.diamond += existGift.coin;
      user.save();
    } else {
      receiverUser.diamond += existGift.coin;
      receiverUser.save();
    }

    //add notification
    if (!sender.isBlock && sender.notification) {
      const payload = {
        to: receiver.fcm_token,
        notification: {
          title: `${sender.name} send gift on your reel.`,
        },
      };

      notificationData = {
        userId: receiver._id,
        otherUserId: sender._id,
        reelId: reel._id,
        notificationType: 3,
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

    const income = new Wallet();
    income.userId = receiver._id;
    income.otherUserId = sender._id;
    income.type = 0;
    income.isIncome = true;
    income.diamond = existGift.coin;
    income.date = new Date().toLocaleString("en-US");
    await income.save();

    const outgoing = new Wallet();
    outgoing.userId = sender._id;
    outgoing.otherUserId = receiver._id;
    outgoing.type = 0;
    outgoing.isIncome = false;
    outgoing.coin = existGift.coin;
    outgoing.date = new Date().toLocaleString("en-US");
    await outgoing.save();

    return res.status(200).json({
      status: true,
      message: "Success!",
      user: sender,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get user all gift
exports.userGift = async (req, res) => {
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

    const gift = await User.aggregate([
      {
        $match: { _id: user._id },
      },
      {
        $lookup: {
          from: "gifts",
          localField: "gift.gift",
          foreignField: "_id",
          as: "gift",
        },
      },
      {
        $unwind: {
          path: "$gift",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: "$gift._id",
          image: "$gift.image",
          coin: "$gift.coin",
          type: "$gift.type",
          isTop: "$gift.isTop",
          createdAt: "$gift.createdAt",
          updatedAt: "$gift.updatedAt",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({ status: true, message: "Successful", gift });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

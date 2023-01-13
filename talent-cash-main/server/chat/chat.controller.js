const Chat = require("./chat.model");
const ChatTopic = require("../chatTopic/chatTopic.model");
const fs = require("fs");
const { deleteFile } = require("../../util/deleteFile");
const Notification = require("../notification/notification.model");
const User = require("../user/user.model");
const dayjs = require("dayjs");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

// get old chat
exports.getOldChat = async (req, res) => {
  try {
    if (!req.query.topicId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    const chat = await Chat.find({ topic: req.query.topicId })
      .sort({ createdAt: -1 })
      .skip(req.query.start ? parseInt(req.query.start) : 0)
      .limit(req.query.limit ? parseInt(req.query.limit) : 20);

    if (!chat)
      return res.status(200).json({ status: false, message: "No data found!" });
    let now = dayjs();
    const chatData = [];

    chat.map((chat) => {
      if (chat) {
        let time = "";
        time =
          now.diff(chat.date, "minute") <= 60 &&
          now.diff(chat.date, "minute") >= 0
            ? now.diff(chat.date, "minute") + " minutes ago"
            : now.diff(chat.date, "hour") >= 24
            ? now.diff(chat.date, "day") >= 30
              ? now.diff(chat.date, "month") + " months ago"
              : now.diff(chat.date, "day") + " days ago"
            : now.diff(chat.date, "hour") + " hours ago";

        chatData.push({
          topic: chat ? chat.topic : "",
          image: chat ? chat.image : "",
          message: chat ? chat.message : "",
          messageType: chat ? chat.messageType : "",
          senderId: chat ? chat.senderId : "",
          date: chat ? chat.date : "",
          createdAt: chat ? chat.createdAt : "",
          updatedAt: chat ? chat.updatedAt : "",
          time: time === "0 minutes ago" ? "now" : time,
        });
      }
    });

    return res
      .status(200)
      .json({ status: true, message: "Successful", chat: chatData });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// create chat [only image]
exports.store = async (req, res) => {
  
  try {
    console.log(req.body);
    if (
      req.body.messageType != 1 ||
      !req.body.topic ||
      !req.body.messageType ||
      !req.body.senderId
    ) {
      if (req.file) deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!!" });
    }

    const chatTopic = await ChatTopic.findById(req.body.topic);
    const senderUser = await User.findById(req.body.senderId);
    var receiverUserIds;
    if (chatTopic.senderUserId.toString() === req.body.senderId.toString()) {
      receiverUserIds = chatTopic.receiverUserId;
    } else {
      receiverUserIds = chatTopic.senderUserId;
    }
    const receiverUser = await User.findById(receiverUserIds);

    if (!senderUser)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist!" });

    if (!chatTopic)
      return res
        .status(200)
        .json({ status: false, message: "Topic not Exist!" });
    let now = dayjs();
    const chat = new Chat();
    chat.senderId = senderUser._id;
    chat.messageType = 1;
    chat.message = "📸 Image";
    chat.image = req.file.path;
    chat.topic = chatTopic._id;
    chat.date = new Date().toLocaleString("en-US");

    await chat.save();

    let data_ = {};
    if (chat) {
      //chat time
      let time = "";
      time =
        now.diff(chat.date, "minute") <= 60 &&
        now.diff(chat.date, "minute") >= 0
          ? now.diff(chat.date, "minute") + " minutes ago"
          : now.diff(chat.date, "hour") >= 24
          ? now.diff(chat.date, "day") >= 30
            ? now.diff(chat.date, "month") + " months ago"
            : now.diff(chat.date, "day") + " days ago"
          : now.diff(chat.date, "hour") + " hours ago";

      data_ = {
        ...chat._doc,
        time: time === "0 minutes ago" ? "now" : time,
      };
      if (receiverUser && !receiverUser.isBlock && receiverUser.notification) {
        const payload = {
          to: receiverUser.fcm_token,
          notification: {
            body: chat.message,
            title: `${senderUser.name}`,
          },
          data: {
            data: {
              topic: chatTopic._id,
              message: chat.message,
              date: chat.date,
              chatDate: chat.date,
              userId: senderUser._id,
              name: senderUser.name,
              username: senderUser.username,
              image: senderUser.profileImage,
              time: "Just Now",
            },
            type: "MESSAGE",
          },
        };

        notificationData = {
          userId: receiverUser._id,
          otherUserId: senderUser._id,
          notificationType: 5,
          message: `${senderUser.name} Send You ${chat.message}`,
          date: new Date().toLocaleString("en-US"),
        };

        const notification = new Notification(notificationData);
        await notification.save();

        await fcm.send(payload, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!", err);
          }
        });

        chatTopic.chat = chat._id;
        await chatTopic.save();
      }
      return res
        .status(200)
        .json({ status: true, message: "Success!!", chat: data_ });
    }
  } catch (error) {
    deleteFile(req.file);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

// send chat notification
exports.sendChatNotification = async (req, res) => {
  try {
    if (!req.body.messageBody || !req.body.receiverId || !req.body.senderId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!!" });
    const senderUser = await User.findById(req.body.senderId);
    const receiverUser = await User.findById(req.body.receiverId);
    console.log(receiverUser);
    if (!senderUser)
      return res
        .status(200)
        .json({ status: false, message: "Sender User Does not Exist!" });
    if (!receiverUser)
      return res
        .status(200)
        .json({ status: false, message: "Receiver User Does not Exist!" });
        //console.log(receiverUser.fcm_token);
        const payload = {
          to: receiverUser.fcm_token, //receiver user token
          notification: {
            title: `${senderUser.name} send a new message.`,
            body: req.body.messageBody,
          },
          data: {
            data:
              {
                senderId: senderUser._id,
                sender_name: senderUser.name,
                receiverId: receiverUser._id,
                description: req.body.messageBody ? req.body.messageBody : null,
              },
            type: "NEWMESSAGE",
          },
        };
        await fcm.send(payload, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!", err);
          }
        });
      return res
        .status(200)
        .json({ status: true, message: "Success!!", payload });
  } catch (error) {
    deleteFile(req.file);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};
//delete message
exports.deleteMessage = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.query.chatId);

    if (!chat)
      return res
        .status(200)
        .json({ status: false, message: "Chat does not Exist!" });

    const chatTopic = await ChatTopic.findById(chat.topic);

    if (fs.existsSync(chat.image)) {
      fs.unlinkSync(chat.image);
    }
    await chat.deleteOne();

    if (
      chatTopic &&
      chatTopic.chat.toString() === req.query.chatId.toString()
    ) {
      const newChat = await Chat.findOne({ topic: chatTopic._id }).sort({
        createdAt: -1,
      });

      chatTopic.chat = newChat ? newChat._id : null;
      await chatTopic.save();
    }

    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

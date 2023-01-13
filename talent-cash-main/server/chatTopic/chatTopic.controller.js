const ChatTopic = require("./chatTopic.model");
const User = require("../user/user.model");
const dayjs = require("dayjs");

//create chat-topic
exports.store = async (req, res) => {
  try {
    if (!req.body.senderUserId || !req.body.receiverUserId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const senderUser = await User.findById(req.body.senderUserId);
    if (!senderUser)
      return res
        .status(200)
        .json({ status: false, message: "SenderUser does not Exist!" });
    const receiverUser = await User.findById(req.body.receiverUserId);
    if (!receiverUser)
      return res
        .status(200)
        .json({ status: false, message: "ReceiverUser dose not Exist!" });

    const chatTopic = await ChatTopic.findOne({
      $or: [
        {
          $and: [
            { senderUserId: senderUser._id },
            { receiverUserId: receiverUser._id },
          ],
        },
        {
          $and: [
            { senderUserId: receiverUser._id },
            { receiverUserId: senderUser._id },
          ],
        },
      ],
    });

    if (chatTopic) {
      return res
        .status(200)
        .json({ status: true, message: "Success!!", chatTopic });
    }

    const newChatTopic = new ChatTopic();
    newChatTopic.senderUserId = senderUser._id;
    newChatTopic.receiverUserId = receiverUser._id;

    await newChatTopic.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!!", chatTopic: newChatTopic });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: false, message: error.errorMessage || "Server Error" });
  }
};

//get chat-topic list
exports.getChatTopicList = async (req, res) => {
  try {
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, error: error.message || "Invalid Details!" });

    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    const chatTopic = await ChatTopic.aggregate([
      {
        $match: {
          $or: [
            { senderUserId: { $eq: user._id } },
            { receiverUserId: { $eq: user._id } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          as: "user",
          let: { senderIds: "$senderUserId", receiverIds: "$receiverUserId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $cond: {
                    if: { $eq: ["$$senderIds", user._id] },
                    then: { $eq: ["$$receiverIds", "$_id"] },
                    else: { $eq: ["$$senderIds", "$_id"] },
                  },
                },
              },
            },
          ],
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          chat: 1,
          name: "$user.name",
          userId: "$user._id",
          username: "$user.username",
          userImage: "$user.profileImage",
          isOnline: "$user.isOnline",
        },
      },
      {
        $lookup: {
          from: "chats",
          localField: "chat",
          foreignField: "_id",
          as: "chat",
        },
      },
      {
        $unwind: { path: "$chat", preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          userId: 1,
          username: 1,
          userImage: 1,
          isOnline: 1,
          message: "$chat.message",
          date: "$chat.date",
          shortingDate: {
            $dateFromString: {
              dateString: "$chat.date",
            },
          },
          createdAt: "$chat.createdAt",
        },
      },
      {
        $sort: { shortingDate: -1 },
      },
      {
        $facet: {
          chatList: [
            { $skip: req.query.start ? parseInt(req.query.start) : 0 }, // how many records you want to skip
            { $limit: req.query.limit ? parseInt(req.query.limit) : 20 },
          ],
        },
      },
    ]);

    let now = dayjs();

    const chatList = chatTopic[0].chatList.map((data) => ({
      ...data,
      time:
        now.diff(data.createdAt, "minute") <= 60 &&
        now.diff(data.createdAt, "minute") >= 0
          ? now.diff(data.createdAt, "minute") + " minutes ago"
          : now.diff(data.createdAt, "hour") >= 24
          ? dayjs(data.createdAt).format("DD MMM, YYYY")
          : now.diff(data.createdAt, "hour") + " hour ago",
    }));

    return res.status(200).json({ status: true, message: "Success", chatList });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ status: false, message: error.errorMessage || "Server Error" });
  }
};

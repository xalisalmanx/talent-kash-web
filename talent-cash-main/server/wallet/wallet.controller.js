const Wallet = require("./wallet.model");
const User = require("../user/user.model");
const Setting = require("../setting/setting.model");

// get free coin from watching ad
exports.getCoinFromAd = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    const setting = await Setting.findOne({});

    if (!setting)
      return res
        .status(200)
        .json({ status: false, message: "Setting data not Found!" });

    if (
      user.ad &&
      user.ad.date !== null &&
      user.ad.date.split(",")[0] ===
        new Date().toLocaleString("en-US").split(",")[0] &&
      user.ad.count >= setting.maxAdPerDay
    ) {
      return res
        .status(200)
        .json({ status: false, message: "You exceed your Ad limit." });
    }

    user.coin += setting ? setting.freeCoinForAd : 0;
    user.ad.count += 1;
    user.ad.date = new Date().toLocaleString("en-US");

    await user.save();

    const income = new Wallet();
    income.userId = user._id;
    income.coin = setting ? setting.freeCoinForAd : 0;
    income.type = 3;
    income.date = new Date().toLocaleString("en-US");
    await income.save();

    const user_ = await User.aggregate([
      { $match: { _id: user._id } },
      {
        $lookup: {
          from: "reels",
          let: { userIds: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userIds"] },
                    { $eq: ["$isDelete", false] },
                  ],
                },
              },
            },
          ],
          as: "reel",
        },
      },
    ]);

    return res
      .status(200)
      .json({ status: true, message: "Success!!", user: user_[0] });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//convert diamond to coin
exports.convertDiamondToCoin = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.diamond)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details !" });

    const user = await User.findById(req.body.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User not Found!" });

    if (user.diamond < req.body.diamond)
      return res
        .status(200)
        .json({ status: false, message: "Not Enough diamond for convert!" });

    const setting = await Setting.findOne({});
    if (!setting)
      return res
        .status(200)
        .json({ status: false, message: "Setting data not Found!" });

    user.coin += req.body.diamond * setting.CoinForDiamond;
    user.diamond -= req.body.diamond;
    await user.save();

    const income = new Wallet();
    income.userId = user._id;
    income.type = 1;
    income.convertRate = setting.CoinForDiamond;
    income.coin = req.body.diamond * setting.CoinForDiamond;
    income.isIncome = true;
    income.date = new Date().toLocaleString("en-US");
    await income.save();

    const outgoing = new Wallet();
    outgoing.userId = user._id;
    outgoing.type = 1;
    outgoing.convertRate = setting.CoinForDiamond;
    outgoing.diamond = req.body.diamond;
    outgoing.isIncome = false;
    outgoing.date = new Date().toLocaleString("en-US");
    await outgoing.save();

    return res.status(200).json({
      status: true,
      message: "Diamond Successfully Converted into Coin",
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get user convert history
exports.getConvertHistory = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Does Not Exist !" });

    const setting = await Setting.findOne({});
    if (!setting)
      return res
        .status(200)
        .json({ status: false, message: "Setting data not Found!" });

    const wallet = await Wallet.aggregate([
      {
        $match: {
          $and: [{ userId: user._id }, { type: 1 }, { isIncome: true }],
        },
      },

      {
        $sort: { date: -1 },
      },
    ]);

    return res
      .status(200)
      .json({ status: true, message: "Successful !", wallet });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get history of user[admin penal]
exports.getHistory = async (req, res) => {
  try {
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Does not exists" });

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

    //for match analytic date
    var analyticDate_ = {
      $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
    };

    // for pagination and extra field
    let income, outgoing;
    if (req.query.type === "gift") {
      (income = "$diamond"), (outgoing = "$coin");
    } else {
      (income = "$coin"), (outgoing = "$diamond");
    }
    const extraQuery = {
      $facet: {
        income: [{ $group: { _id: null, totalIncome: { $sum: income } } }],
        outgoing: [
          { $group: { _id: null, totalOutgoing: { $sum: outgoing } } },
        ],
        user: [
          { $skip: (start - 1) * limit }, // how many records you want to skip
          { $limit: limit },
        ],
        pageInfo: [
          { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
        ],
      },
    };

    var wallet;
    if (req.query.type == "gift") {
      wallet = await Wallet.aggregate([
        {
          $match: {
            $and: [
              { type: 0 },
              { $or: [{ userId: user._id }, { otherUserId: user._id }] },
            ],
          },
        },
        {
          $addFields: {
            analyticDate: analyticDate_,
          },
        },
        {
          $match: dateFilterQuery,
        },
        {
          $lookup: {
            from: "users",
            let: {
              userIds: {
                $cond: {
                  if: { $eq: ["$userId", user._id] },
                  then: "$otherUserId",
                  else: "$userId",
                },
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ["$_id", "$$userIds"] },
                      { $eq: ["$_id", "$$userIds"] },
                    ],
                  },
                },
              },
            ],
            as: "user",
          },
        },

        {
          $unwind: { path: "$user", preserveNullAndEmptyArrays: false },
        },

        {
          $project: {
            _id: 1,
            otherUserId: 1,
            isIncome: 1,
            diamond: 1,
            coin: 1,
            convertRate: 1,
            planId: 1,
            paymentGateway: 1,
            userId: 1,
            type: 1,
            date: 1,
            analyticDate: 1,
            userName: "$user.name",
          },
        },
        { $sort: { date: -1 } },
        extraQuery,
      ]);
    } else if (req.query.type == "convert") {
      wallet = await Wallet.aggregate([
        {
          $match: { $and: [{ userId: user._id }, { type: 1 }] },
        },
        {
          $addFields: {
            analyticDate: analyticDate_,
          },
        },

        {
          $match: dateFilterQuery,
        },
        { $sort: { date: -1 } },
        extraQuery,
      ]);
    } else if (req.query.type == "purchase") {
      wallet = await Wallet.aggregate([
        {
          $match: { $and: [{ userId: user._id }, { type: 2 }] },
        },
        {
          $addFields: {
            analyticDate: analyticDate_,
          },
        },

        {
          $match: dateFilterQuery,
        },
        { $sort: { date: -1 } },
        extraQuery,
      ]);
    } else if (req.query.type == "ad") {
      wallet = await Wallet.aggregate([
        {
          $match: { $and: [{ userId: user._id }, { type: 3 }] },
        },
        {
          $addFields: {
            analyticDate: analyticDate_,
          },
        },

        {
          $match: dateFilterQuery,
        },
        { $sort: { date: -1 } },
        extraQuery,
      ]);
    }
    return res.status(200).json({
      status: true,
      message: "Success!",
      history: wallet[0].user,
      totalIncome:
        wallet[0].income.length > 0 ? wallet[0].income[0].totalIncome : 0,
      totalOutgoing:
        wallet[0].outgoing.length > 0 ? wallet[0].outgoing[0].totalOutgoing : 0,
      totalUser:
        wallet[0].pageInfo.length > 0 ? wallet[0].pageInfo[0].totalRecord : 0,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};

exports.getAdminHistory = async (req, res) => {
  try {
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Does not exists" });

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

    //for match analytic date
    var analyticDate_ = {
      $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
    };

    let income,
      outgoing,
      coin = {};
    if (req.query.type === "coin") {
      (income = "$coin"), (outgoing = "$coin");
      coin = { coin: { $ne: 0 } };
    } else if (req.query.type === "diamond") {
      (income = "$diamond"), (outgoing = "$diamond");
      coin = { diamond: { $ne: 0 } };
    }
    const extraQuery = {
      $facet: {
        income: [
          {
            $group: { _id: "$isIncome", totalIncome: { $sum: income } },
          },
        ],

        user: [
          { $skip: (start - 1) * limit }, // how many records you want to skip
          { $limit: limit },
        ],
        pageInfo: [
          { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
        ],
      },
    };

    const wallet = await Wallet.aggregate([
      {
        $match: { $and: [{ userId: user._id }, { type: 5 }, coin] },
      },
      {
        $addFields: {
          analyticDate: analyticDate_,
        },
      },

      {
        $match: dateFilterQuery,
      },
      { $sort: { date: -1 } },
      extraQuery,
    ]);

    return res.status(200).json({
      status: true,
      message: "Success!",
      history: wallet[0].user,
      totalIncome:
        wallet[0].income.length > 0 ? wallet[0].income[1].totalIncome : 0,
      totalOutgoing:
        wallet[0].income.length > 0 ? wallet[0].income[0].totalIncome : 0,
      totalUser:
        wallet[0].pageInfo.length > 0 ? wallet[0].pageInfo[0].totalRecord : 0,
    });

    // return res.status(200).json({ status: true, message: "Success", wallet });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//for set 0
// exports.set = async (req, res) => {
//   try {
//     const wallet = await Wallet.find();

//     wallet.map(async (wallet_) => {
//       const wallet__ = await Wallet.findById(wallet_._id);
//       if (wallet__.coin === null) {
//         wallet__.coin = 0;
//       }
//       if (wallet__.diamond === null) {
//         wallet__.diamond = 0;
//       }
//       if (wallet__.convertRate === null) {
//         wallet__.convertRate = 0;
//       }
//       wallet__.save();
//     });
//     return res.status(200).json({ status: true, message: "Success!", wallet });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ status: false, error: error.message || "Internal Server Error" });
//   }
// };

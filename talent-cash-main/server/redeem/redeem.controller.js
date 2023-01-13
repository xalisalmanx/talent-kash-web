const Redeem = require("./redeem.model");
const User = require("../user/user.model");
const Wallet = require("../wallet/wallet.model");
const RedeemPlan = require("../redeemPlan/redeemPlan.model");

// get user redeem list
// exports.userRedeem = async (req, res) => {
//   try {
//     const user = await User.findById(req.query.userId);

//     if (!user)
//       return res
//         .status(200)
//         .json({ status: false, message: "User does not Exist!" });

//     const redeem = await Redeem.find({ userId: user._id }).sort({
//       createdAt: -1,
//     });

//     if (!redeem)
//       return res
//         .status(200)
//         .json({ status: false, message: "Data not Found!" });

//     return res.status(200).json({ status: true, message: "Success!", redeem });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: false, error: error.message || "Server Error" });
//   }
// };

//create redeem request

//

/* create redeem request */
exports.store = async (req, res) => {
  try {
    if (
      !req.body.userId ||
      !req.body.planId ||
      !req.body.paymentGateway ||
      !req.body.description
    )
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details !" });

    const user = await User.findById(req.body.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist!" });
    const plan = await RedeemPlan.findById(req.body.planId);
    if (!user)
      if (!plan)
        return res
          .status(200)
          .json({ status: false, message: "User Does not Exist!" });
    if (plan.diamond > user.diamond)
      return res
        .status(200)
        .json({ status: false, message: "You Have not enough Diamond!" });
    const redeem = new Redeem();
    redeem.userId = req.body.userId;
    redeem.planId = req.body.planId;
    redeem.paymentGateway = req.body.paymentGateway;
    redeem.rupee = plan.rupee;
    redeem.dollar = plan.dollar;
    redeem.diamond = plan.diamond;
    redeem.description = req.body.description;
    redeem.date = new Date().toLocaleString("en-US");
    await redeem.save();

    user.diamond -= plan.diamond;
    user.requestForWithdrawDiamond += plan.diamond;
    await user.save();

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
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!",
    });
  }
};

//accept or decline redeem request
exports.action = async (req, res) => {
  try {
    const redeem = await Redeem.findById(req.params.redeemId);
    if (!redeem)
      return res
        .status(200)
        .json({ status: false, message: "Redeem Request Doesn't Exist!" });

    const user = await User.findById(redeem.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Doesn't Exist!" });

    if (req.query.type === "accept" && redeem.status !== 1) {
      redeem.status = 1;
      await redeem.save();

      const outgoing = new Wallet();
      outgoing.userId = user._id;
      outgoing.diamond = redeem.diamond;
      outgoing.type = 4;
      outgoing.date = new Date().toLocaleString("en-US");
      outgoing.isIncome = false;

      await outgoing.save();

      user.requestForWithdrawDiamond -= redeem.diamond;
      await user.save();
    } else if (req.query.type === "decline" && redeem.status !== 2) {
      user.diamond += redeem.diamond;
      user.requestForWithdrawDiamond -= redeem.diamond;
      user.save();

      redeem.status = 2;
      await redeem.save();
    }
    return res.status(200).json({ status: true, message: "success", redeem });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!",
    });
  }
};

//get successful redeem request for user[android]
exports.get = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    const start = req.query.start ? parseInt(req.query.start) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    var matchQuery;
    if (req.query.type === "pending") {
      matchQuery = { $match: { $and: [{ userId: user._id }, { status: 0 }] } };
    } else if (req.query.type === "accepted") {
      matchQuery = { $match: { $and: [{ userId: user._id }, { status: 1 }] } };
    } else if (req.query.type === "decline") {
      matchQuery = { $match: { $and: [{ userId: user._id }, { status: 1 }] } };
    }
    const redeem = await Redeem.aggregate([
      matchQuery,
      {
        $facet: {
          redeem: [
            { $skip: start * limit }, // how many records you want to skip
            { $limit: limit },
          ],
        },
      },
    ]);
    return res
      .status(200)
      .json({ status: true, message: "Success!!", redeem: redeem[0].redeem });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!",
    });
  }
};

//get all redeem list[backend]
exports.index = async (req, res) => {
  try {
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

    //search query
    var matchQuery = {};
    if (req.query.search) {
      if (req.query.search !== "") {
        matchQuery = {
          $or: [
            { paymentGateway: { $regex: req.query.search, $options: "i" } },
            { userName: { $regex: req.query.search, $options: "i" } },
            { userName: { $regex: req.query.search, $options: "i" } },
          ],
        };
      }
    }

    //for match analytic date
    var analyticDate_ = {
      $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
    };

    //extra query
    const extraQuery = {
      $facet: {
        redeem: [
          { $skip: (start - 1) * limit }, // how many records you want to skip
          { $limit: limit },
        ],
        pageInfo: [
          { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
        ],
      },
    };

    //lookup
    const lookup = {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    };

    //unwind
    const unwind = {
      $unwind: { path: "$user", preserveNullAndEmptyArrays: false },
    };

    //project
    const project = {
      $project: {
        paymentGateway: 1,
        description: 1,
        diamond: 1,
        rupee: 1,
        dollar: 1,
        status: 1,
        date: 1,
        userName: "$user.name",
      },
    };

    if (!req.query.type)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details !" });

    let redeem;
    if (req.query.type === "pending") {
      redeem = await Redeem.aggregate([
        {
          $match: { status: 0 },
        },
        lookup,
        unwind,
        project,
        { $match: matchQuery },
        {
          $addFields: { analyticDate: analyticDate_ },
        },
        {
          $match: dateFilterQuery,
        },
        extraQuery,
        { $sort: { date: -1 } },
      ]);
    } else if (req.query.type === "accept") {
      redeem = await Redeem.aggregate([
        {
          $match: { status: 1 },
        },
        lookup,
        unwind,
        project,
        { $match: matchQuery },
        {
          $addFields: { analyticDate: analyticDate_ },
        },
        {
          $match: dateFilterQuery,
        },
        extraQuery,
        { $sort: { date: -1 } },
      ]);
    } else if (req.query.type === "decline") {
      redeem = await Redeem.aggregate([
        {
          $match: { status: 2 },
        },
        lookup,
        unwind,
        project,
        { $match: matchQuery },
        {
          $addFields: { analyticDate: analyticDate_ },
        },
        {
          $match: dateFilterQuery,
        },
        extraQuery,
        { $sort: { date: -1 } },
      ]);
    }
    return res.status(200).json({
      status: true,
      message: "Success !",

      redeem: redeem[0].redeem,
      totalRedeem:
        redeem[0].pageInfo.length > 0 ? redeem[0].pageInfo[0].totalRecord : 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error!",
    });
  }
};

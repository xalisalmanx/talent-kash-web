const DiamondPlan = require("./diamondPlan.model");
const User = require("../user/user.model");
const Setting = require("../setting/setting.model");
const Wallet = require("../wallet/wallet.model");

//google play
const Verifier = require("google-play-billing-validator");

//get coinPlan
exports.get = async (req, res) => {
  try {
    const diamondPlan = await DiamondPlan.find({ isDelete: false }).sort({
      createdAt: -1,
    });
    if (!diamondPlan)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res
      .status(200)
      .json({ status: true, message: "Success!!", diamondPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// create coin plan
exports.store = async (req, res) => {
  try {
    if (!req.body.diamond || !req.body.coin)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const diamondPlan = new DiamondPlan();

    diamondPlan.diamond = req.body.diamond;
    diamondPlan.coin = req.body.coin;
    diamondPlan.tag = req.body.tag ? req.body.tag : null;

    await diamondPlan.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!", diamondPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update coin plan
exports.update = async (req, res) => {
  try {
    const diamondPlan = await DiamondPlan.findById(req.params.planId);

    if (!diamondPlan) {
      return res
        .status(200)
        .json({ status: false, message: "Plan does not Exist!" });
    }

    diamondPlan.coin = req.body.coin;
    diamondPlan.diamond = req.body.diamond;
    diamondPlan.tag = req.body.tag;

    await diamondPlan.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!", diamondPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete coinPlan
exports.destroy = async (req, res) => {
  try {
    const diamondPlan = await DiamondPlan.findById(req.params.planId);

    if (!diamondPlan)
      return res
        .status(200)
        .json({ status: false, message: "Plan does not Exist!" });

    diamondPlan.isDelete = true;

    await diamondPlan.save();

    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//add Diamond plan

exports.addDiamondPlan = async (req, res) => {
  try {
    if (!req.body.planId || !req.body.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.send({ status: false, message: "User does not exist!!" });
    }

    const plan = await DiamondPlan.findById(req.body.planId);
    if (!plan) {
      return res.send({ status: false, message: "Plan does not exist!!" });
    }

    if (user.diamond < plan.diamond)
      return res.send({ status: false, message: "You have not enough coin!!" });

    user.coin += plan.coin;
    user.diamond -= plan.diamond;
    user.save();

    const income = new Wallet();
    income.userId = user._id;
    income.type = 1;
    income.coin = plan.coin;
    income.isIncome = true;
    income.date = new Date().toLocaleString("en-US");
    await income.save();

    const outgoing = new Wallet();
    outgoing.userId = user._id;
    outgoing.type = 1;
    outgoing.diamond = plan.diamond;
    outgoing.isIncome = false;
    outgoing.date = new Date().toLocaleString("en-US");
    await outgoing.save();

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
      .json({ status: true, message: "Success", user: user_[0] });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

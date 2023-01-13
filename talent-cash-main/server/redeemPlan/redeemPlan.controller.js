const RedeemPlan = require("./redeemPlan.model");

//get redeemPlan
exports.get = async (req, res) => {
  try {
    const redeemPlan = await RedeemPlan.find({ isDelete: false }).sort({
      createdAt: -1,
    });
    if (!redeemPlan)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res
      .status(200)
      .json({ status: true, message: "Success!!", redeemPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// create diamond plan
exports.store = async (req, res) => {
  try {
    if (!req.body.diamond || !req.body.dollar || !req.body.rupee)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const redeemPlan = new RedeemPlan();

    redeemPlan.diamond = req.body.diamond;
    redeemPlan.dollar = req.body.dollar;
    redeemPlan.rupee = req.body.rupee;
    redeemPlan.tag = req.body.tag ? req.body.tag : null;

    await redeemPlan.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!", redeemPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update diamond plan
exports.update = async (req, res) => {
  try {
    const redeemPlan = await RedeemPlan.findById(req.params.planId);

    if (!redeemPlan) {
      return res
        .status(200)
        .json({ status: false, message: "Plan does not Exist!" });
    }

    redeemPlan.diamond = req.body.diamond;
    redeemPlan.dollar = req.body.dollar;
    redeemPlan.rupee = req.body.rupee;
    redeemPlan.tag = req.body.tag;

    await redeemPlan.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!", redeemPlan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// delete redeemPlan
exports.destroy = async (req, res) => {
  try {
    const redeemPlan = await RedeemPlan.findById(req.params.planId);

    if (!redeemPlan)
      return res
        .status(200)
        .json({ status: false, message: "Plan does not Exist!" });

    redeemPlan.isDelete = true;

    await redeemPlan.save();

    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

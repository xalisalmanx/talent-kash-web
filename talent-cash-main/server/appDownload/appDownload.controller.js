const AppDownload = require("./appDownload.model");

//get appDownload
exports.get = async (req, res) => {
  try {
    const redeemPlan = await AppDownload.find({ isDelete: false }).sort({
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
    if (!req.body.androidDownload || !req.body.iosDownload)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    
    const checkRes = await AppDownload.find({ isDelete: false }).sort({
      createdAt: -1,
    });

    if (checkRes.length > 0)
      return res
      .status(200)
      .json({ status: false, message: "Record Already Exist !!!" });

    const appDownload = new AppDownload();

    appDownload.androidDownload = req.body.androidDownload;
    appDownload.iosDownload = req.body.iosDownload;

    await appDownload.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!", appDownload });
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
    const redeemPlan =  await AppDownload.findById(req.params.planId);

    if (!redeemPlan) {
      return res
        .status(200)
        .json({ status: false, message: "Record does not Exist!" });
    }

    // redeemPlan.diamond = req.body.diamond;
    // redeemPlan.dollar = req.body.dollar;
    // redeemPlan.rupee = req.body.rupee;
    // redeemPlan.tag = req.body.tag;

    redeemPlan.androidDownload = req.body.androidDownload;
    redeemPlan.iosDownload = req.body.iosDownload;

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
    const redeemPlan = await AppDownload.findById(req.params.planId);

    if (!redeemPlan)
      return res
        .status(200)
        .json({ status: false, message: "Record does not Exist!" });

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

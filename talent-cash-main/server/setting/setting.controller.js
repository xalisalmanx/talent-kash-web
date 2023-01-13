const Setting = require("./setting.model");

// get setting data
exports.index = async (req, res) => {
  try {
    const setting = await Setting.findOne({}, {_id:0 , maxSecondForVideo:1 , privacyPolicyLink:1, privacyPolicyText:1, termsAndConditionsLink:1,termsAndConditionsText:1,aboutusLink:1,aboutusText:1,freeCoinForAd:1});

    if (!setting)
      return res.status(200).json({ status: false, message: "No data found!" });

    return res
      .status(200)
      .json({ status: true, message: "Success!!", setting });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.store = async (req, res) => {
  try {
    const setting = new Setting();

    await setting.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!!", setting });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update the setting data
exports.update = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.settingId);

    if (!setting)
      return res
        .status(200)
        .json({ status: false, message: "Setting data does not Exist!" });

    setting.maxSecondForVideo = req.body.maxSecondForVideo;
    setting.privacyPolicyLink = req.body.privacyPolicyLink;
    setting.privacyPolicyText = req.body.privacyPolicyText;
    setting.googlePlayEmail = req.body.googlePlayEmail;
    setting.googlePlayKey = req.body.googlePlayKey;
    setting.stripePublishableKey = req.body.stripePublishableKey;
    setting.stripeSecretKey = req.body.stripeSecretKey;
    setting.currency = req.body.currency;
    setting.diamondPerCurrency = req.body.diamondPerCurrency;
    setting.CoinForDiamond = req.body.CoinForDiamond;
    setting.minDiamondForCashOut = req.body.minDiamondForCashOut;
    setting.paymentGateway = req.body.paymentGateway;
    setting.freeCoinForAd = req.body.freeCoinForAd;
    setting.maxAdPerDay = req.body.maxAdPerDay;

    await setting.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!!", setting });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// handle setting switch
exports.handleSwitch = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.settingId);

    if (!setting)
      return res
        .status(200)
        .json({ status: false, message: "Setting data does not Exist!" });

    if (req.query.type === "googlePlay") {
      setting.googlePlaySwitch = !setting.googlePlaySwitch;
    } else if (req.query.type === "stripe") {
      setting.stripeSwitch = !setting.stripeSwitch;
    } else {
      setting.isAppActive = !setting.isAppActive;
    }

    await setting.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!!", setting });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

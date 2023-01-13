const CustomAd = require("./customAd.model");
const fs = require("fs");

//Get customAd
exports.customAd = async (req, res) => {
  try {
    const customAd = await CustomAd.find().sort({ createdAt: -1 });

    return res.status(200).json({ status: true, message: "success", customAd });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//Create customAd
exports.store = async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.url ||
      !req.files.video ||
      !req.body.type ||
      !req.files.productImage ||
      !req.body.productTag ||
      !req.body.productUrl
    ) {
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });
    }

    const customAd = new CustomAd();

    customAd.title = req.body.title;
    customAd.description = req.body.description;
    customAd.url = req.body.url;
    customAd.type = req.body.type ? req.body.type : 0;
    customAd.publisherName = req.body.publisherName
      ? req.body.publisherName
      : null;
    customAd.video = req.files.video[0].path;
    customAd.publisherLogo = req.files.publisherLogo
      ? req.files.publisherLogo[0].path
      : null;
    customAd.productImage = req.files.productImage[0].path;
    customAd.productTag = req.body.productTag;
    customAd.productUrl = req.body.productUrl;

    await customAd.save();

    return res.status(200).json({ status: true, message: "Success", customAd });
  } catch (error) {
    if (req.files.video) deleteFile(req.files.video[0]);
    if (req.files.publisherLogo) deleteFile(req.files.publisherLogo[0]);
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//Update customAd
exports.update = async (req, res) => {
  try {
    const customAd = await CustomAd.findById(req.params.customAd);

    if (!customAd) {
      if (req.file) deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "CustomAd does not exist" });
    }

    customAd.title = req.body.title;
    customAd.description = req.body.description;
    customAd.url = req.body.url;
    customAd.type = req.body.type;
    customAd.publisherName = req.body.publisherName;

    customAd.productTag = req.body.productTag;
    customAd.productUrl = req.body.productUrl;

    if (req.files.video) {
      if (fs.existsSync(customAd.video)) {
        fs.unlinkSync(customAd.video);
      }
      customAd.video = req.files.video[0].path;
    }

    //Update publisherLogo
    if (req.files.publisherLogo) {
      if (fs.existsSync(customAd.publisherLogo)) {
        fs.unlinkSync(customAd.publisherLogo);
      }
      customAd.publisherLogo = req.files.publisherLogo[0].path;
    }

    if (req.files.productImage) {
      if (fs.existsSync(customAd.productImage)) {
        fs.unlinkSync(customAd.productImage);
      }
      customAd.productImage = req.files.productImage[0].path;
    }

    await customAd.save();

    return res.status(200).json({ status: true, message: "Success", customAd });
  } catch (error) {
    if (req.file) deleteFile(req.file);
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error ! ",
    });
  }
};

//Delete CustomAd
exports.destroy = async (req, res) => {
  try {
    const customAd = await CustomAd.findById(req.params.customAd);

    if (!customAd) {
      if (req.file) deleteFile(req.file);
      return res
        .status(200)
        .json({ status: false, message: "Custom Ad does not exist" });
    }

    if (fs.existsSync(customAd.video)) {
      fs.unlinkSync(customAd.video);
    }

    if (fs.existsSync(customAd.publisherLogo)) {
      fs.unlinkSync(customAd.publisherLogo);
    }

    if (fs.existsSync(customAd.productImage)) {
      fs.unlinkSync(customAd.productImage);
    }

    await customAd.deleteOne();

    return res
      .status(200)
      .json({ status: true, message: "Deleted successfully", result: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//CustomAd show
exports.customAdShow = async (req, res) => {
  try {
    const customAd = await CustomAd.findById(req.params.customAd);

    if (!customAd) {
      return res
        .status(200)
        .json({ status: false, message: "CustomAd does not exist" });
    }

    customAd.show = !customAd.show;

    await customAd.save();

    return res.status(200).json({ status: true, message: "Success", customAd });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Errror!",
    });
  }
};
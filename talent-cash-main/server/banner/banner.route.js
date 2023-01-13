const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const BannerController = require("./banner.controller");
const upload = multer({
  storage,
});

const uploadS3 = require("../../util/multer-s3");

const checkAccessWithKey = require("../../checkAccess");

//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");
// router.use(checkAccessWithKey());

// get all banner for frontend
router.get("/all", checkAccessWithKey(), BannerController.index);

// get VIP and normal banner [android]
router.get("/", checkAccessWithKey(), checkJwtAuth, BannerController.getBanner);

//create banner
router.post("/", checkAccessWithKey(), checkJwtAuth, uploadS3.single("image"), BannerController.store);

//update banner
router.patch("/:bannerId", checkAccessWithKey(), checkJwtAuth, uploadS3.single("image"), BannerController.update);

//VIP switch
router.put("/:bannerId", checkAccessWithKey(), checkJwtAuth, BannerController.VIPBannerSwitch);

//delete banner
router.delete("/:bannerId", checkAccessWithKey(), checkJwtAuth, BannerController.destroy);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const CustomAdController = require("./customAd.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

//Get  Custom Ad
router.get("/", checkAccessWithKey(), CustomAdController.customAd);

//create Custom Ad
router.post(
  "/create",
  checkAccessWithKey(),
  upload.fields([{ name: "video" }, { name: "publisherLogo" }, { name: "productImage" }]),
  CustomAdController.store
);

//Update Custom Ad
router.patch(
  "/update/:customAd",
  checkAccessWithKey(),
  upload.fields([{ name: "video" }, { name: "publisherLogo" }, { name: "productImage" }]),
  CustomAdController.update
);

//Delete Custom Ad
router.delete(
  "/delete/:customAd",
  checkAccessWithKey(),
  CustomAdController.destroy
);

//CustomAd Show
router.put(
  "/show/:customAd",
  checkAccessWithKey(),
  CustomAdController.customAdShow
);

module.exports = router;

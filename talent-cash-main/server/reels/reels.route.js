//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

const uploadS3 = require("../../util/multer-s3");

// Reel Controller
const ReelController = require("./reels.controller");

//route
//get reels
route.get("/", checkAccessWithSecretKey(), ReelController.index);
//get reel for [android]
route.get("/getReel", checkAccessWithSecretKey(), checkJwtAuth, ReelController.get);
route.get(
  "/userWiseReel",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  ReelController.userWiseReel
);

//User Wise reels for android
route.get(
  "/userWiseReelAndroid",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  ReelController.userWiseReelAndroid
);

//allow disallow reels
route.put(
  "/allowComment/:reelId",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  ReelController.allowDisallowComment
);
//show Product
route.put(
  "/showProduct/:reelId",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  ReelController.showProduct
);

//delete reels
route.delete("/:reelId", checkAccessWithSecretKey(), checkJwtAuth, ReelController.destroy);

//create video
route.post(
  "/upload",
  uploadS3.fields([
    { name: "video" },
    { name: "screenshot" },
    { name: "thumbnail" },
    { name: "productImage" },
  ]),
  checkAccessWithSecretKey(),
  checkJwtAuth,
  ReelController.store
);

//add view
route.post("/addView", checkAccessWithSecretKey(), checkJwtAuth, ReelController.addView);


//report video
route.post("/banReel", checkAccessWithSecretKey(), checkJwtAuth, ReelController.banReel);
module.exports = route;

//get Specfic Reel
route.get(
  "/getSpecificReel/",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  ReelController.getSpecificReel
);

//get reels
route.get("/reportedReelList", checkAccessWithSecretKey(), checkJwtAuth, ReelController.reportedReelList);
route.get("/deleteReel", checkAccessWithSecretKey(), checkJwtAuth, ReelController.deleteReel);


//remove from report by admin
// route.put(
//   "/unban/:reelId",
//   checkAccessWithSecretKey(),
//   ReelController.unban
// );
route.get("/unban/:reelId", checkAccessWithSecretKey(), checkJwtAuth, ReelController.unban);
route.get("/findDistance/", checkAccessWithSecretKey(), checkJwtAuth, ReelController.findDistance);


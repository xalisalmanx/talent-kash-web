const express = require("express");
const route = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const StickerController = require("./sticker.controller");
const upload = multer({
  storage,
});

const uploadS3 = require("../../util/multer-s3");

const checkAccessWithKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

// get all sticker
route.get("/", checkAccessWithKey(), StickerController.index);

//create sticker
route.post("/", checkAccessWithKey(), 
uploadS3.any(), 
StickerController.store);

// update sticker
route.patch(
  "/:stickerId",
  checkAccessWithKey(),
  uploadS3.single("sticker"),
  StickerController.update
);

// delete sticker
route.delete("/:stickerId", checkAccessWithKey(), StickerController.destroy);

module.exports = route;

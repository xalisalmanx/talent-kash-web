const express = require("express");
const router = express.Router();

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

const uploadS3 = require("../../util/multer-s3");

const HashtagController = require("./hashtag.controller");

const checkAccessWithKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

// router.use(checkAccessWithKey());

// get hashtag list with reels
router.get("/", checkAccessWithKey(), checkJwtAuth, HashtagController.get);
// get hashtag name list
router.get(
  "/hashtagName",
  checkAccessWithKey(),
  checkJwtAuth,
  HashtagController.getHashtagName
);
// get hashtag list
router.get("/hashtag", checkAccessWithKey(), checkJwtAuth, HashtagController.index);

// get hashtag list
router.get("/search", checkAccessWithKey(), checkJwtAuth, HashtagController.search);

// create hashtag
router.post(
  "/",
  uploadS3.fields([{ name: "coverImage" }, { name: "image" }]),
  checkAccessWithKey(),
  checkJwtAuth,
  HashtagController.store
);

// update hashtag
router.patch(
  "/:hashtagId",
  uploadS3.fields([{ name: "coverImage" }, { name: "image" }]),
  checkAccessWithKey(),
  checkJwtAuth,
  HashtagController.update
);

// delete hashtag
router.delete("/:hashtagId", checkAccessWithKey(), checkJwtAuth, HashtagController.destroy);

module.exports = router;

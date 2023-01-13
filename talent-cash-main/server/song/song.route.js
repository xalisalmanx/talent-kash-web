const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");

const SongController = require("./song.controller");

const upload = multer({
  storage,
});

const uploadS3 = require("../../util/multer-s3");

const checkAccessWithKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

// router.use(checkAccessWithSecretKey());

//get song list for admin
router.get("/songsAdmin", checkAccessWithKey(), SongController.songsAdmin);
//get song list
router.get("/", checkAccessWithKey(), SongController.index);

//create song
router.post(
  "/", checkAccessWithKey(),
  uploadS3.fields([{ name: "image" }, { name: "song" }]),
  SongController.store
);

//update song
router.patch(
  "/:songId", checkAccessWithKey(),
  uploadS3.fields([{ name: "image" }, { name: "song" }]),
  SongController.update
);

//delete song
router.delete("/:songId", checkAccessWithKey(), SongController.destroy);


//get song list
router.get("/searchSong", checkAccessWithKey(), SongController.searchSong);

module.exports = router;

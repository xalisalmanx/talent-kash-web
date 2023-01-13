//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

const uploadS3 = require("../../util/multer-s3");

// User Controller
const UserController = require("./user.controller");

//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");
//route
//get user
route.get("/", checkAccessWithSecretKey(), checkJwtAuth, UserController.index);

route.get("/get", checkAccessWithSecretKey(), checkJwtAuth, UserController.get);
route.get("/getRandomUser", checkAccessWithSecretKey(), checkJwtAuth, UserController.getRandomUser);
//get trending user
route.get(
  "/trending",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  UserController.getTrendingUser
);
//search user
route.get("/search", checkAccessWithSecretKey(), checkJwtAuth, UserController.search);
//create user
route.post("/", checkAccessWithSecretKey(), checkJwtAuth, UserController.store);
// check username is already exist or not
route.post(
  "/checkUsername",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  UserController.checkUsername
);
// user block
route.put("/:userId", checkAccessWithSecretKey(), checkJwtAuth, UserController.isBlock);
// user block
route.patch("/", checkAccessWithSecretKey(), checkJwtAuth, UserController.notification);

// user online
route.put("/", checkAccessWithSecretKey(), checkJwtAuth, UserController.isOnline);

// update user detail [android]
route.patch(
  "/update",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  uploadS3.fields([{ name: "coverImage" }, { name: "profileImage" }]),
  UserController.updateProfile
);

//get login user profile [android]
route.get("/profile",checkAccessWithSecretKey(), checkJwtAuth, UserController.getProfile);
//get other user profile [android]
route.get(
  "/otherProfile",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  UserController.getOtherProfile
);

//get user without analytic
route.get("/user", checkAccessWithSecretKey(), UserController.get);
//search user for android
route.post(
  "/userSearch",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  UserController.searchUser
);
//get other user by username for android
route.get(
  "/username",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  UserController.userByUserName
);

// admin add or less the Coin or diamond of user through admin panel
route.post(
  "/addLessCoin",
  checkAccessWithSecretKey(),
  UserController.addORLessDiamondAndCoin
);

//By umar (06-09-22)
// update user role [android]
route.patch(
  "/updateUserRole",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  UserController.updateUserRole
);

route.post(
  "/updateUserInfo",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  UserController.updateUserInfo
);

//login with phone number
route.post(
  "/checkNumberExist",
  checkAccessWithSecretKey(),
  UserController.checkNumberExist
);

route.post(
  "/generateOTP",
  checkAccessWithSecretKey(),
  UserController.generateOTP
);

route.post(
  "/loginWithNumber",
  checkAccessWithSecretKey(),
  UserController.loginWithNumber
);

route.post(
  "/userSignup",
  checkAccessWithSecretKey(),
  UserController.userSignup
);

route.post(
  "/forgotPassword",
  checkAccessWithSecretKey(),
  UserController.forgotPassword
);

route.post(
  "/checkSocialUserExists",
  checkAccessWithSecretKey(),
  UserController.checkSocialUserExists
);

route.post(
  "/logout",
  checkAccessWithSecretKey(),
  UserController.logout
);

route.post(
  "/reportUser",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  UserController.reportUser
);

route.get("/userDeleteAccount", checkJwtAuth, checkAccessWithSecretKey(), UserController.userDeleteAccount);
module.exports = route;

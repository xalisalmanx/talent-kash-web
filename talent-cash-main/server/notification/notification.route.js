//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");
//notification controller
const NotificationController = require("./notification.controller");

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

//route

//get notifications
route.get(
  "/",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  NotificationController.getNotification
);
//send notification via admin penal
route.post(
  "/",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  upload.single("image"),
  NotificationController.sendNotification
);
//send notification to personal user via admin penal
route.post(
  "/personalNotification/:userId",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  upload.single("image"),
  NotificationController.sendNotificationPersonalUser
);
//delete notification
route.delete("/", checkAccessWithSecretKey(), checkJwtAuth, NotificationController.destroy);


//send notification for offer send
route.post(
  "/sendOfferNotificationToTalentProvider/",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  upload.single("image"),
  NotificationController.sendOfferNotificationToTalentProvider
);

//send notification for offer send
route.post(
  "/acceptRejectOfferNotificationToUser",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  NotificationController.acceptRejectOfferNotificationToUser
);

module.exports = route;

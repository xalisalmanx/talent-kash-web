//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Controller
const ChatController = require("./chat.controller");

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

//Get Route Of Chat
route.get("/", checkAccessWithSecretKey(), ChatController.getOldChat);

//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

//create chat-topic
route.post(
  "/",
  upload.single("image"),
  checkAccessWithSecretKey(),
  ChatController.store
);
//send new message
route.post(
  "/sendChatNotification",
  checkAccessWithSecretKey(),
  ChatController.sendChatNotification
);
//delete chat
route.delete("/", checkAccessWithSecretKey(), ChatController.deleteMessage);

module.exports = route;

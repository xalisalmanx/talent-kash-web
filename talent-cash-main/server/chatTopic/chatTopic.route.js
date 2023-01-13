//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");
//chat-topic controller
const ChatTopicController = require("./chatTopic.controller");

route.post("/", checkAccessWithSecretKey(), ChatTopicController.store);

route.get(
  "/",
  checkAccessWithSecretKey(),
  ChatTopicController.getChatTopicList
);

module.exports = route;

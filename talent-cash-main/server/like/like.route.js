//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

// Like Controller
const LikeController = require("./like.controller");

//route
//get like
route.get(
  "/",
  checkAccessWithSecretKey(),
  checkJwtAuth,

  LikeController.index
);
//get like
route.get(
  "/userAllLike",
  checkAccessWithSecretKey(),
  checkJwtAuth,

  LikeController.allLike
);
//follow unfollow
route.post(
  "/",
  checkAccessWithSecretKey(),
  checkJwtAuth,

  LikeController.likeAndDislike
);

module.exports = route;

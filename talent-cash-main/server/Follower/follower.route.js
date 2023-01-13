//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

// Follower Controller
const FollowerController = require("./follower.controller");

//route
//follow unfollow
route.post(
  "/",
  checkAccessWithSecretKey(),
  checkJwtAuth,

  FollowerController.followAndUnfollow
);

//get user followers
route.get(
  "/followers",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  FollowerController.getFollowers
);
//get user followers
route.get(
  "/following",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  FollowerController.getFollowings
);
//get user followers and following for admin panel
route.get(
  "/",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  FollowerController.getFollowerFollowing
);
module.exports = route;

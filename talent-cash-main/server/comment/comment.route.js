//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

// Follower Controller
const CommentController = require("./comment.controller");

//route
//comment get
route.get(
  "/",
  checkAccessWithSecretKey(),
  checkJwtAuth,

  CommentController.index
);
//get all comment
route.get(
  "/userAllComment",
  checkAccessWithSecretKey(),
  checkJwtAuth,

  CommentController.allComment
);
//comment create
route.post(
  "/",
  checkAccessWithSecretKey(),
  checkJwtAuth,

  CommentController.store
);
//comment delete
route.delete(
  "/",
  checkAccessWithSecretKey(),
  checkJwtAuth,

  CommentController.destroy
);

module.exports = route;

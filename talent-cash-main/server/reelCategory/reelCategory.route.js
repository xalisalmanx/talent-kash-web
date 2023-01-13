//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

// Reel Category Controller
const reelType = require("./reelCategory.controller");

//route
//get reel type
route.get("/", checkAccessWithSecretKey(), checkJwtAuth, reelType.index);

module.exports = route;

const express = require("express");
const route = express.Router();

//redeem controller
const RedeemController = require("./redeem.controller");

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

// get user redeem list
// route.get("/", checkAccessWithSecretKey(), RedeemController.userRedeem);

// get user redeem list
route.get("/index", checkAccessWithSecretKey(), RedeemController.index);
// get user redeem list
route.get("/history", checkAccessWithSecretKey(), RedeemController.get);

//create redeem request
route.post("/", checkAccessWithSecretKey(), RedeemController.store);

//accept or decline redeem request
route.patch("/:redeemId", checkAccessWithSecretKey(), RedeemController.action);

module.exports = route;

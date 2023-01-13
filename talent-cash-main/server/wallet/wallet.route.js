const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

const WalletController = require("./wallet.controller");

//get coin from watching ad
route.post(
  "/income/seeAd",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  WalletController.getCoinFromAd
);

//convert diamond to coin
// route.post(
//   "/convert",
//   checkAccessWithSecretKey(),
//   WalletController.convertDiamondToCoin
// );

//get convert history of user
route.get(
  "/covertHistory",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  WalletController.getConvertHistory
);

//get user history
route.get("/history", checkAccessWithSecretKey(), checkJwtAuth, WalletController.getHistory);
//get admin history
route.get(
  "/historyByAdmin",
  checkAccessWithSecretKey(),
  WalletController.getAdminHistory
);

// //get user history
// route.put("/set", checkAccessWithSecretKey(), WalletController.set);

module.exports = route;

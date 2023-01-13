//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

const CoinPlanController = require("./coinPlan.controller");

//get coin plan list [android]
route.get("/", checkAccessWithSecretKey(), CoinPlanController.get);
//create coin plan
route.post("/", checkAccessWithSecretKey(), CoinPlanController.store);

//update coin plan
route.patch("/:planId", checkAccessWithSecretKey(), CoinPlanController.update);

//delete coin plan
route.delete(
  "/:planId",
  checkAccessWithSecretKey(),
  CoinPlanController.destroy
);

// purchase plan through stripe
route.post(
  "/purchase/stripe",
  checkAccessWithSecretKey(),
  CoinPlanController.payStripe
);

// purchase plan through google play
route.post(
  "/purchase/googlePlay",
  checkAccessWithSecretKey(),
  CoinPlanController.payGooglePlay
);

module.exports = route;

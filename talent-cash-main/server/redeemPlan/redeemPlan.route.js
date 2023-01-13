//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

const RedeemPlanController = require("./redeemPlan.controller");

//get coin plan list [android]
route.get("/", checkAccessWithSecretKey(), RedeemPlanController.get);
//create coin plan
route.post("/", checkAccessWithSecretKey(), RedeemPlanController.store);

//update coin plan
route.patch(
  "/:planId",
  checkAccessWithSecretKey(),
  RedeemPlanController.update
);

//delete coin plan
route.delete(
  "/:planId",
  checkAccessWithSecretKey(),
  RedeemPlanController.destroy
);

module.exports = route;

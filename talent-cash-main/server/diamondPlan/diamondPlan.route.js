//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

const DiamondPlanController = require("./diamondPlan.controller");

//get coin plan list [android]
route.get("/", checkAccessWithSecretKey(), DiamondPlanController.get);
//create coin plan
route.post("/", checkAccessWithSecretKey(), DiamondPlanController.store);

//update coin plan
route.patch(
  "/:planId",
  checkAccessWithSecretKey(),
  DiamondPlanController.update
);

//delete coin plan
route.delete(
  "/:planId",
  checkAccessWithSecretKey(),
  DiamondPlanController.destroy
);

//add DiamondPlan
route.post(
  "/addPlan",
  checkAccessWithSecretKey(),
  DiamondPlanController.addDiamondPlan
);

module.exports = route;

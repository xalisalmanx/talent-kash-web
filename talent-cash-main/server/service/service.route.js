//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

// Service Controller
const SerivceController = require("./service.controller");

//get all services for Android
route.get("/", checkAccessWithSecretKey(), checkJwtAuth, SerivceController.index);
//for IOS
route.get("/getServices", checkAccessWithSecretKey(), checkJwtAuth, SerivceController.getServices);


//For Backend/
route.get("/getBackendServices", checkAccessWithSecretKey(), SerivceController.getBackendServices);
//create coin plan
route.post("/getBackendServices", checkAccessWithSecretKey(), SerivceController.store);

//update coin plan
route.patch(
  "/:planId",
  checkAccessWithSecretKey(),
  SerivceController.update
);

//delete coin plan
route.delete(
  "/:planId",
  checkAccessWithSecretKey(),
  SerivceController.destroy
);

module.exports = route;

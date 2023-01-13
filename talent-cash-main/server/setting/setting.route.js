//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

const SettingController = require("./setting.controller");

// store setting data
route.post("/", checkAccessWithSecretKey(), SettingController.store);

// get setting
route.get("/", checkAccessWithSecretKey(), SettingController.index);

// update setting
route.patch(
  "/:settingId",
  checkAccessWithSecretKey(),
  SettingController.update
);

route.put(
  "/:settingId",
  checkAccessWithSecretKey(),
  SettingController.handleSwitch
);

module.exports = route;

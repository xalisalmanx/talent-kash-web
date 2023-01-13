//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");

const appDownload = require("./appDownload.controller");

//get coin plan list [android]
route.get("/", checkAccessWithSecretKey(), appDownload.get);
//create coin plan
route.post("/", checkAccessWithSecretKey(), appDownload.store);

//update coin plan
route.patch(
  "/:planId",
  checkAccessWithSecretKey(),
  appDownload.update
);

//delete coin plan
route.delete(
  "/:planId",
  checkAccessWithSecretKey(),
  appDownload.destroy
);

module.exports = route;

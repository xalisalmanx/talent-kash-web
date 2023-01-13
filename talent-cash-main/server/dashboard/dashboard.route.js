//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");

//dashboard controller
const DashboardController = require("./dashboard.controller");

route.get("/", checkAccessWithSecretKey(), DashboardController.dashboard);

module.exports = route;

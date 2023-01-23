//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");

// Block Controller
const ReportController = require("./report.controller");

//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

//route
//block unblock
route.post(
  "/",
  checkAccessWithSecretKey(),
  checkJwtAuth,
  ReportController.reportUser
);

module.exports = route;

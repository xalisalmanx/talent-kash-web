//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

//notification controller
const paymentController = require("./payment.controller");

route.get(
    "/userInvoice",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    paymentController.userInvoice
);

route.get(
    "/userCompleteBookingInvoice",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    paymentController.userCompleteBookingInvoice
);

route.get(
    "/talentCompleteBookingInvoice",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    paymentController.talentCompleteBookingInvoice
);

route.get(
    "/talentProviderTotalEarning",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    paymentController.talentProviderTotalEarning
);

module.exports = route;
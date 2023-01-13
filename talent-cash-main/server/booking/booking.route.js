//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");

//notification controller
const BookingController = require("./booking.controller");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");
route.get(
    "/checkAvailability",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    BookingController.checkAvailability
);

route.get(
    "/activeBookingListUser",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    BookingController.activeBookingListUser
);

route.get(
    "/completedBookingListUser",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    BookingController.completedBookingListUser
);
route.get(
    "/trackOrderSummary",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    BookingController.trackOrderSummary
);

//Talent Provider
route.get(
    "/activeBookingListTalent",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    BookingController.activeBookingListTalent
);

route.get(
    "/completedBookingListTalent",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    BookingController.completedBookingListTalent
);

route.get(
    "/trackTalentProviderOrderSummary",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    BookingController.trackTalentProviderOrderSummary
);

route.get(
    "/completeTalentProviderOrder",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    BookingController.completeTalentProviderOrder
);

module.exports = route;
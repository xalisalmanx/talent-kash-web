//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");
//notification controller
const FeedbackController = require("./feedback.controller");

route.post(
    "/submitFeedback",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    FeedbackController.submitFeedback
);

route.post(
    "/viewFeedback",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    FeedbackController.viewFeedback
);

// route.get(
//     "/completedBookingListUser",
//     checkAccessWithSecretKey(),
//     FeedbackController.completedBookingListUser
// );
// route.get(
//     "/trackOrderSummary",
//     checkAccessWithSecretKey(),
//     FeedbackController.trackOrderSummary
// );

// //Talent Provider
// route.get(
//     "/activeBookingListTalent",
//     checkAccessWithSecretKey(),
//     FeedbackController.activeBookingListTalent
// );

// route.get(
//     "/completedBookingListTalent",
//     checkAccessWithSecretKey(),
//     FeedbackController.completedBookingListTalent
// );

// route.get(
//     "/trackTalentProviderOrderSummary",
//     checkAccessWithSecretKey(),
//     FeedbackController.trackTalentProviderOrderSummary
// );

// route.get(
//     "/completeTalentProviderOrder",
//     checkAccessWithSecretKey(),
//     FeedbackController.completeTalentProviderOrder
// );

module.exports = route;
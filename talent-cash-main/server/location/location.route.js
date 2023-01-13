const express = require("express");
const router = express.Router();

const LocationController = require("./location.controller");

const checkAccessWithKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

// router.use(checkAccessWithKey());

// get gifts
router.get("/search", checkAccessWithKey(), checkJwtAuth, LocationController.search);

// router.get("/", LocationController.getCountryState);
// router.get("/city", LocationController.getCities);
// router.get("/UKcity", LocationController.getCitiesOfUK);

module.exports = router;

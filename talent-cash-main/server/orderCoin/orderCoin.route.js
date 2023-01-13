//Express
const express = require("express");

const route = express.Router();

//Dev and Security Key
const checkAccessWithSecretKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

//notification controller
const orderCoinController = require("./orderCoin.controller");

route.post(
    "/createOrder",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    orderCoinController.createOrder
);
//no need to authenticate//
route.get(
    "/payProResponse",
    orderCoinController.callBackAPIforPayProResponse
);

route.get(
    "/coinsHistroy",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    orderCoinController.coinsHistroy
);

route.get(
    "/coinRechargeDetail",
    checkAccessWithSecretKey(),
    checkJwtAuth,
    orderCoinController.coinRechargeDetail
);

route.get(
    "/paypro/uis",
    orderCoinController.markOrderAsPaid
);

//for APP user
route.post(
    "/markOrderAsPaidForJazzcash",
    orderCoinController.markOrderAsPaidForJazzcash
);


//For IOS Secure Hash
route.post(
    "/jazzCashSecureHashForIOS",
    orderCoinController.jazzCashSecureHashForIOS
);

module.exports = route;
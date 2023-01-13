const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../../util/multer");

const GiftController = require("./gift.controller");
const upload = multer({
  storage,
});

const checkAccessWithKey = require("../../checkAccess");
//Jwt Auth Middleware
const checkJwtAuth = require("../../jwtMiddleware");

// router.use(checkAccessWithKey());

// get all gifts
router.get("/all", checkAccessWithKey(), GiftController.index);
// get user gifts
router.get("/userGift", checkAccessWithKey(), GiftController.userGift);

//create gift
router.post("/", checkAccessWithKey(), upload.any(), GiftController.store);

// update gift
router.patch(
  "/:giftId",
  checkAccessWithKey(),
  upload.single("image"),
  GiftController.update
);

// delete image
router.delete("/:giftId", checkAccessWithKey(), GiftController.destroy);
// top switch
// router.put("/:giftId", checkAccessWithKey(), GiftController.top);
// send gift
router.post("/sendGift", checkAccessWithKey(), GiftController.sendGift);

module.exports = router;

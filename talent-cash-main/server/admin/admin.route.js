//express
const express = require("express");
const router = express.Router();

//multer
const multer = require("multer");
const storage = require("../../util/multer");
const upload = multer({
  storage,
});

//admin controller
const AdminController = require("./admin.controller");

//admin middleware
const AdminMiddleware = require("../middleware/admin.middleware");

//get admin profile
router.get("/", AdminMiddleware, AdminController.getProfile);

//create admin
router.post("/create", upload.single("image"), AdminController.store);

//admin login
router.post("/login", AdminController.login);

//update admin password
router.put("/", AdminMiddleware, AdminController.uptPassword);

//update admin Profile Image
router.patch(
  "/updateImage",
  AdminMiddleware,
  upload.single("image"),
  AdminController.updateImage
);

//update admin profile
router.patch("/", AdminMiddleware, AdminController.update);

//Forgot Password
router.put(`/forgotPassword`, AdminController.forgotPassword);

//Set Password
router.put(`/setPassword/:adminId`, AdminController.setPassword);
//get Admin
router.post(`/getAdmin`, AdminController.getAdmin);

module.exports = router;

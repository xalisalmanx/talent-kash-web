const multer = require("multer");

module.exports = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});


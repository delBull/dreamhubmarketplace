const express = require("express");
// const { upload } = require("../../../lib/multer");
const getProfile = require("./get");
const updateProfile = require("./update");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const router = express.Router();

router.put(
  "/update/:id",
  // upload.fields([
  //   {
  //     name: "profile_img",
  //     maxCount: 1,
  //   },
  //   {
  //     name: "cover_img",
  //     maxCount: 1,
  //   },
  // ]),
  multipartMiddleware,
  updateProfile
);
router.get("/get/:id", getProfile);

module.exports = router;

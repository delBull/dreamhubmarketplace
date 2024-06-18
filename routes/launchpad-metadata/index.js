const express = require("express");

const createMetaData = require("./create");
const getMetaData = require("./get");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const router = express.Router();

router.post(
  "/",
  multipartMiddleware,
  createMetaData
);
router.get("/:id", getMetaData);

module.exports = router;

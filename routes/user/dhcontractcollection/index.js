const express = require("express");
const createContractCollection = require("./create");
const multipart = require("connect-multiparty");
const getContractCollection = require("./getSingle");
const contractCollectionName = require("./checkCollectionName");
const getUserCollections = require("./getUserCollections");
const getSingleUserCollection = require("./getSigleUserCollection");
const multipartMiddleware = multipart();

const router = express.Router();

router.post(
  "/create",
  multipartMiddleware,
  createContractCollection
);

router.post("/getSingle", getContractCollection);
router.get("/getSingle", getSingleUserCollection);
router.post("/checkCollectionName", contractCollectionName);
router.get("/getUserCollections", getUserCollections);

module.exports = router;

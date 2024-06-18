const express = require("express");
const createNftCollection = require("./create");
const multipart = require("connect-multiparty");
const getNftCollection = require("./get");
const check_collection = require("./check-collection");
const getAllCollection = require("./getAllCollection");
const getSingleCollection = require("./getSinlgedata");
const getNftOwner = require("./getowner");
const getSingleUser = require("./getSingleUser");
const getSingleUserCollection = require("./getSingleCollection");
const multipartMiddleware = multipart();

const router = express.Router();

router.post("/create", multipartMiddleware,createNftCollection);
router.get("/getcollection", getNftCollection);
router.get('/check-collection', check_collection);
router.get('/get-all-collection', getAllCollection);
router.get('/get-Single-collection', getSingleCollection);
router.get('/get-Owner-collection', getNftOwner);
router.get('/getSingleCollection', getSingleUser);
router.post('/getSingleUserCollection', getSingleUserCollection);

module.exports = router;

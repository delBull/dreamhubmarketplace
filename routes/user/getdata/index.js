const express = require("express");
const searchnfts = require('./get-users');
const getNfts = require('./get-nfts');
const router = express.Router();


router.get("/get-nfts", searchnfts);
router.post("/nfts", getNfts);

module.exports = router 
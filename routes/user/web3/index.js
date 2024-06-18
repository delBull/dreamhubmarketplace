const express = require("express");
const getNFTCollection = require("./get-nft-collection");

const router = express.Router();

router.get("/get-nft-collection", getNFTCollection);

module.exports = router;

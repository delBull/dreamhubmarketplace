const express = require("express");
const { tokenVerification } = require("../../../middleware");
const acceptBid = require("./accept-bid");
const cancelBid = require("./cancel-bid");
const getNftBid = require("./get-nft-bid");
const placeABid = require("./place-a-bid");
const updateBid = require("./update-bid");
const router = express.Router();

router.get("/:nft_id", getNftBid);
router.post("/", tokenVerification, placeABid);
router.put("/", tokenVerification, updateBid);
router.delete("/", tokenVerification, cancelBid);
router.post("/accept", tokenVerification, acceptBid);

module.exports = router;

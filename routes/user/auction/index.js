const express = require("express");
const { tokenVerification } = require("../../../middleware");
const acceptAuction = require("./accept-auction");
const cancelAuction = require("./cancel-auction");
const getNftAuction = require("./get-nft-auction");
const placeAAuction = require("./place-a-auction");
const updateAuction = require("./update-auction");
const router = express.Router();

router.get("/:nft_id", getNftAuction);
router.post("/", tokenVerification, placeAAuction);
router.put("/", tokenVerification, updateAuction);
router.delete("/", tokenVerification, cancelAuction);
router.post("/accept", tokenVerification, acceptAuction);

module.exports = router;

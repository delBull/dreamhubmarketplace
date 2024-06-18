const express = require("express");
const { tokenVerification } = require("../../../middleware");
 const acceptSwapOffer = require("./accept");
 const cancelBid = require("./cancel");
 const getswapNftOffer = require("./get");
const placeABid = require("./create");
const getRandomswapNftOffer = require("./randomswap");
//const updateBid = require("./update-bid");
const router = express.Router();

router.get("/get", getswapNftOffer);
router.post("/", tokenVerification, placeABid);
// router.put("/", tokenVerification, updateBid);
router.delete("/", tokenVerification, cancelBid);
 router.post("/accept", acceptSwapOffer);
 router.get("/randomnft", getRandomswapNftOffer);

module.exports = router;

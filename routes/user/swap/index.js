const express = require("express");
const getSwapNft = require("./getSwap");
const swapNft = require("./swap");
const getVacantSwapIds = require("./getVacantSwapIds");
const setVacantSwapIds = require("./setVacantSwapIds");
const { tokenVerification } = require("../../../middleware");

const router = express.Router();

router.post("/swapnft", swapNft);
router.get("/get-swap-nfts", getSwapNft);
router.get("/get-vacant-swapid", tokenVerification, getVacantSwapIds);
router.post("/set-vacant-swapid", setVacantSwapIds);

module.exports = router;

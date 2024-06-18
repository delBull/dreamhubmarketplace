const express = require("express");
const { tokenVerification } = require("../../../middleware");
const checkOrCreateNftToDb = require("../../../middleware/nft/check-nft-or-create");

const buyNft = require("./buy-nft");
const getAllNFTOnSell = require("./get-all-on-sell");
const getUserNFTOnSell = require("./get-user-nft-on-sell");
const multipleNft = require("./multiplenft-buy");
const removeFromSell = require("./remove-from-sell");
const sellNFT = require("./sell-nft");
const removeFromListing = require("./remove-nft");
const swapNft = require("./swapnft");
const randomSwapApply = require("./randomSwap");
//const sellMintNft = require("./sell-mintupdate");

const router = express.Router();

router.get("/get-all", getAllNFTOnSell);
router.post("/create", tokenVerification, sellNFT);
router.post("/randomSwapApply", tokenVerification, randomSwapApply);

router.put("/remove", tokenVerification, removeFromListing);
//router.put("/create", tokenVerification, sellMintNft);
router.get("/get-user-nfts-on-sell/:id", getUserNFTOnSell);
//router.put("/buy-nft", tokenVerification, buyNft);
router.put("/buy-nft",buyNft);
router.post("/multipleNft", tokenVerification, multipleNft);
router.delete("/remove-from-sell", removeFromSell);
router.post("/swapNft", tokenVerification,swapNft);

module.exports = router;

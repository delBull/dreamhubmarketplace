const express = require("express");
const getNftMetaData = require("./get-nft-meta-data");
const getWalletNfts = require("./get-wallet-nfts");
const router = express.Router();

router.get("/get-wallet-nfts", getWalletNfts);
router.get("/get-nft-metadata", getNftMetaData);

module.exports = router;

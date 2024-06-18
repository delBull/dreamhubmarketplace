const express = require("express");
// const { upload } = require("../../../lib/multer");
const getAllNft = require("./get-mint-nft");
const getCreatedNfts = require("./get-created-nfts");
const getCollectedNfts = require("./get-collected-nfts");
const createNft = require("./mint-nft");
// const nftViewImage = require("./nft-view-image");
const UpdateNft = require("./update-nft");
const getSingleNft = require("./get-single-nft");
const getNftByTag = require("./get-nft-by-tag-name");
const { tokenVerification } = require("../../../middleware");

const router = express.Router();

// router.post("/create/:id", pinataUpload.single("nftImg"), createNft);
router.post(
  "/create/:id",
 tokenVerification,
  // upload.single("nftImg"),
  createNft
);
router.get("/get-all", getAllNft);
router.get("/user-collected-nfts/:id", getCollectedNfts);
router.get("/user-created-nfts/:id", getCreatedNfts);
router.put("/update", UpdateNft);
// router.get("/nft-view-image/:filename", nftViewImage);
router.get("/get-single-nft", getSingleNft);
// DB Query
router.get("/get-nft-by-tag", getNftByTag);

module.exports = router;

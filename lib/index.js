const { send_email } = require("./node-mailer");
const { MP_ADDRESS, NFT_ADDRESS } = require("./blockchain/addresses");
const NFT_ABI = require("./blockchain/NFT_COLLECTION_ABI.js");
const MP_ABI = require("./blockchain/marketplace_abi.js");
const cloudinary = require("./cloudinary");

module.exports = {
  send_email,
  MP_ADDRESS,
  NFT_ADDRESS,
  NFT_ABI,
  MP_ABI,
  cloudinary,
};

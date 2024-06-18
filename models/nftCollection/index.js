const mongoose = require("mongoose");
const nftcollectionSchema = require("./nftCollection");

const nftcollection = mongoose.model("nftcollection", nftcollectionSchema);

module.exports = nftcollection;

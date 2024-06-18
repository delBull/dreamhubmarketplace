const mongoose = require("mongoose");
const nftMetaDataSchema = require("./nftMetaData-schema");

const nftMetaData = mongoose.model("nftMetaData", nftMetaDataSchema);

module.exports = nftMetaData;

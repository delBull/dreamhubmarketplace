const mongoose = require("mongoose");
const launchpadMetaDataSchema = require("./launchpadMetaData-schmea");

const launchpadMetaData = mongoose.model("launchpadMetaData", launchpadMetaDataSchema);

module.exports = launchpadMetaData;

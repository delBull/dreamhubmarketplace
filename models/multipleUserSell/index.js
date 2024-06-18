const mongoose = require("mongoose");
const multiplenftSellSchema = require("./mulitpleUserSell");

const multipleUserSell = mongoose.model("multipleUserSell", multiplenftSellSchema);

module.exports = multipleUserSell;

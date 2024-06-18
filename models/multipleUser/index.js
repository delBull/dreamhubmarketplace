const mongoose = require("mongoose");
const multiplenftSchema = require("./multipleUser");

const multipleUser = mongoose.model("multipleUser", multiplenftSchema);

module.exports = multipleUser;

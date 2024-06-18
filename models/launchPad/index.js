const mongoose = require("mongoose");
const launchPadSchema = require("./launchPad-schema");

const launchPad = mongoose.model("launchPad", launchPadSchema);

module.exports = launchPad;

const mongoose = require("mongoose");
const attemptSchema = require("./attempts-schema");

const attempt = mongoose.model("attempt", attemptSchema);

module.exports = attempt;

const mongoose = require("mongoose");
const followSchema = require("./follow-schema");

const follow = mongoose.model("follow", followSchema);

module.exports = follow;

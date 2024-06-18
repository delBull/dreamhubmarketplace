const mongoose = require("mongoose");
const followersSchema = require("./followers-schema");

const follower = mongoose.model("follower", followersSchema);

module.exports = follower;

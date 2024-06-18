const mongoose = require("mongoose");
const allowlistSchema = require("./allowlist");

const allowlist = mongoose.model("allowlist", allowlistSchema);

module.exports = allowlist;

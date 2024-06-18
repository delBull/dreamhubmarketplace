const mongoose = require("mongoose");
const allowlist = require("./allowlist");

const allowlistitems = mongoose.model("pandorasAllowlist", allowlist);

module.exports = allowlistitems;

const mongoose = require("mongoose");
const vacantswapidschema = require("./user-schema");

const vacantswapid = mongoose.model("vacantswapid", vacantswapidschema);

module.exports = vacantswapid;

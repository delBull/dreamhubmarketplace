const mongoose = require("mongoose");
const swapbidSchema = require("./swapbid-Schema");

const swapbid = mongoose.model("swapbid", swapbidSchema);

module.exports = swapbid;

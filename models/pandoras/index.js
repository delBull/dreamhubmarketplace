const mongoose = require("mongoose");
const pandora = require("./pandoras-subscribe");

const PandorasSubscribe = mongoose.model("pandoras", pandora);

module.exports = PandorasSubscribe;
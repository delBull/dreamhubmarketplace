const mongoose = require("mongoose");
const subscribeSchema = require("./subscribe-schema");

const Subscribe = mongoose.model("subscribe", subscribeSchema);

module.exports = Subscribe;
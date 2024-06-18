const mongoose = require("mongoose");
const importSchema = require("./import-schema");

const importCollection = mongoose.model("importCollection", importSchema);

module.exports = importCollection;

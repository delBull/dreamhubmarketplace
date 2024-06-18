const mongoose = require("mongoose");
const contractcollectionSchema = require("./dhcontractCollection-schema")
//const autoIncrement = require('mongoose-auto-increment');




const dhcontractcollection = mongoose.model("dhcontractcollection", contractcollectionSchema);

module.exports = dhcontractcollection;

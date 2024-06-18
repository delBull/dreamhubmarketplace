const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

const { DB_USER, DB_PASS, DB_NAME } = require("../index");

mongoose.connect(
  `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.eoppj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
);

module.exports = mongoose;

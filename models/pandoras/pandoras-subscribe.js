const mongoose = require("mongoose");
const SchemaType = require("../../types");

const pandora = new mongoose.Schema(
  {
    email: {
      type: SchemaType.TypeString,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = pandora;

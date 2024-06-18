const mongoose = require("mongoose");
const schemaType = require("../../types");

const allowlistSchema = new mongoose.Schema(
  {
    address: {
      type: schemaType.TypeString,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = allowlistSchema;

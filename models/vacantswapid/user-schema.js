const mongoose = require("mongoose");
const schemaType = require("../../types");

const vacantswapidschema = new mongoose.Schema(
  {
    vacantswapid: {
      type: schemaType.TypeString,
   
    },
  },
  { timestamps: true }
);

module.exports = vacantswapidschema;

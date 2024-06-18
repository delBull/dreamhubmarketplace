const mongoose = require("mongoose");
const schemaType = require("../../types");

const pandorasAllowlist = new mongoose.Schema(
  {
    name: {
      type: schemaType.TypeString,
     // required: true,
    },
    
    address: {
      type: schemaType.TypeString,
       required: true,
  
  },
},
      { timestamps: true }
);

module.exports = pandorasAllowlist;

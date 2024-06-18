const mongoose = require("mongoose");
const schemaType = require("../../types");

const importSchema = new mongoose.Schema(
  {
    title: {
      type: schemaType.TypeString,
    },

    nftImg: {
      type: schemaType.TypeString,
    },

    created_by: {
      type: schemaType.ObjectID,
      ref: "nftcollection",
    },
    owner: {
      type: schemaType.TypeString,
      //ref: "nftcollection",
    },

    nftType: {
      type: schemaType.TypeString,
      default: "mint",
      enum: ["mint", "sell", "auction", "bid", "swap"],
    },
},
  { timestamps: true }
);

module.exports = importSchema;

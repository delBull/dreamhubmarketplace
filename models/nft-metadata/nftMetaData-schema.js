const mongoose = require("mongoose");
const schemaType = require("../../types");

const nftMetaDataSchema = new mongoose.Schema(
  {
    name: {
      type: schemaType.TypeString,
      required: true,
    },
    description: {
      type: schemaType.TypeString,
      required: true,
    },
    image: {
      type: schemaType.TypeString,
      required: true,
    },
    external_url: {
      type: schemaType.TypeString,
      // required: true,
    },
    attributes: {
      type: schemaType.TypeArray,
    },
  },
  { timestamps: true }
);

module.exports = nftMetaDataSchema;

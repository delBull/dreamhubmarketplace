const mongoose = require("mongoose");
const schemaType = require("../../types");

const launchpadMetaDataSchema = new mongoose.Schema(
  {
    name: {
      type: schemaType.TypeString,
      required: true,
    },
    description: {
      type: schemaType.TypeString,
      required: true,
    },
    symbol: {
        type: schemaType.TypeString,
        //required: true,
      },
    launchpad_image: {
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

module.exports = launchpadMetaDataSchema;

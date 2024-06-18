const mongoose = require("mongoose");
const schemaType = require("../../types");

const nftcollectionSchema = new mongoose.Schema(
  {

    ownerId: {
      type: schemaType.ObjectID,
    },
    collection_name: {
      type: schemaType.TypeString,
    },
    profile_img: {
      type: schemaType.TypeString,
    },
    banner_img: {
      type: schemaType.TypeString,
    },
    discord: {
      type: schemaType.TypeString,
    },
    website: {
      type: schemaType.TypeString,
    },
    instagram: {
      type: schemaType.TypeString,
    },
    telegram: {
      type: schemaType.TypeString,
    },
    twitter: {
      type: schemaType.TypeString,
    },
    collection_address: {
      type: schemaType.TypeString,
    },
    chain: {
      type: schemaType.TypeString,
    },
    wallet_address: {
      type: schemaType.TypeString,
    },

    blockcahin: {
      type: schemaType.TypeString,
    },
    total_nfts: {
      type: schemaType.TypeString,
    },
    collection_desc: {
      type: schemaType.TypeString,
    },
   
  }, { timestamps: true }
);

module.exports = nftcollectionSchema;


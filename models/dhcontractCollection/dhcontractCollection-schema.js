const mongoose = require("mongoose");
const schemaType = require("../../types");
//const autoIncrement = require('mongoose-auto-increment');
/// in progress work

const contractcollectionSchema = new mongoose.Schema(
  {
    collection_name: {
      type: schemaType.TypeString,
    },
    ownerId: {
      type: schemaType.TypeString,
      default: "",
    },
    collection_address: {
      type: schemaType.TypeString,
      default: "",
    },
    wallet_address: {
      type: schemaType.TypeString,
      default: "",
    },
    description: {
      type: schemaType.TypeString,
    },
    profile_img: {
      type: schemaType.TypeString,
    },
    banner_img: {
      type: schemaType.TypeString,
    },
    // contract_profile_img: {
    //   type: schemaType.TypeString,
    // },
    // contract_banner_img: {
    //   type: schemaType.TypeString,
    // },
    chain: {
      type: schemaType.TypeString,
    },
    userAddress: {
      type: schemaType.TypeString,
    },

    discord: {
      type: schemaType.TypeString,
      default: "",
    },
    website: {
      type: schemaType.TypeString,
      default: "",
    },
    instagram: {
      type: schemaType.TypeString,
      default: "",
    },
    telegram: {
      type: schemaType.TypeString,
      default: "",
    },
    twitter: {
      type: schemaType.TypeString,
      default: "",
    },
    discord: {
      type: schemaType.TypeString,
      default: "",
    },
    currentDayVolume: {
      type: schemaType.TypeNumber,
      default: 0,
    },
    currentFloorPrice: {
      type: schemaType.TypeNumber,
      default: 0,
    },
    
  },
  { timestamps: true }
);

module.exports = contractcollectionSchema;

const mongoose = require("mongoose");
const schemaType = require("../../types");

const multiplenftSchema = new mongoose.Schema(
  {
    nftId: {
      type: schemaType.ObjectID,
    },

    ownerId: {
      type: schemaType.ObjectID,
    },

    userId: {
      type: schemaType.ObjectID,
      ref: "user",
    },

    // nftType: {
    //   type: schemaType.TypeString,
    //   default: "mint",
    //   enum: ["mint", "sell", "auction", "bid"],
    // },

    buynftnumber: {
      type: schemaType.TypeNumber,
    },

    startDate: {
      type: schemaType.TypeNumber,
    },

    endDate: {
      type: schemaType.TypeNumber,
    },

    nftType: {
      type: schemaType.TypeString,
      default: "mint",
      enum: ["mint", "sell", "auction", "bid", "swap", "randomSwap"],
    },

    totalSupply: {
      type: schemaType.TypeNumber,
    },
    remainingSupply: {
      type: schemaType.TypeNumber,
    },

    sellnftnumber: {
      type: schemaType.TypeNumber,
    },
    buynftnumber: {
      type: schemaType.TypeNumber,
    },
    price: {
      type: schemaType.TypeString,
    },
    tokenHash: {
      type: schemaType.TypeString,
    },
    listingId: {
      type: schemaType.TypeString,
    },
    username: {
      type: schemaType.TypeString,
    },
    swapnftnumber: {
      type: schemaType.TypeNumber,
    },
    userwalletaddress: {
      type: schemaType.TypeString,
    },
    tokenAddress: {
      type: schemaType.TypeString,
    },
    nft_tokenId: {
      type: schemaType.TypeString,
    },
  },
  { timestamps: true }
);

module.exports = multiplenftSchema;

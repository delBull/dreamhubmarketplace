const mongoose = require("mongoose");
const SchemaType = require("../../types");

const bidSchema = new mongoose.Schema(
  {
    nft_id: {
      type: SchemaType.ObjectID,
      ref: "nft",
      required: true,
    },
    bidder_id: {
      type: SchemaType.ObjectID,
      ref: "user",
      required: true,
    },
    bidder_wallet_address: {
      type: SchemaType.TypeString,
      required: true,
    },
    bid_price: {
      type: SchemaType.TypeString,
      required: true,
    },
    winner: {
      type: SchemaType.TypeBoolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = bidSchema;

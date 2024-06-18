const mongoose = require("mongoose");
const SchemaType = require("../../types");

const auctionSchema = new mongoose.Schema(
  {
    nft_id: {
      type: SchemaType.ObjectID,
      ref: "nft",
      required: true,
    },
    auctioner_id: {
      type: SchemaType.ObjectID,
      ref: "user",
      required: true,
    },
    auctioner_wallet_address: {
      type: SchemaType.TypeString,
      required: true,
    },
    auction_price: {
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

module.exports = auctionSchema;

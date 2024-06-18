const mongoose = require("mongoose");
const schemaType = require("../../types");

const multiplenftSellSchema = new mongoose.Schema(
  {
    nftId: {
      type: schemaType.ObjectID,
    },

    ownerId: {
      type: schemaType.ObjectID,
   
    },

    userId: {
      type: schemaType.ObjectID,
        ref: "user"  
    },

   

    startDate: {
      type: schemaType.TypeNumber,
    },
    
    endDate: {
      type: schemaType.TypeNumber,
    },
  
    nftType: {
      type: schemaType.TypeString,
      default: "sell",
      enum: ["mint", "sell", "auction", "bid", "swap"],
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
    

  },
  { timestamps: true }
);

module.exports = multiplenftSellSchema;

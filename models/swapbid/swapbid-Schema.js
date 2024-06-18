const mongoose = require("mongoose");
const SchemaType = require("../../types");

const swapbidSchema = new mongoose.Schema(
    {
        nft_id: {
            type: SchemaType.ObjectID,
            ref: "nft",
            required: false,
        },
        bidder_id: {
            type: SchemaType.ObjectID,
            ref: "user",
            required: true,
        },
        owner_id: {
            type: SchemaType.ObjectID,
            ref: "user",
            required: true,
        },
        nftContractAddressToSwapWith: {
            type: SchemaType.TypeString,
            required: true,
        },
        nftContractAddress: {
            type: SchemaType.TypeString,
            required: true,
        },
        ownernft_id: {
            type: SchemaType.ObjectID,
            required: true,
        },
        biddernft_id: {
            type: SchemaType.ObjectID,
            required: true,
        },
        chain: {
            type: SchemaType.TypeString,
            required: true,
        },
        makerAddress: {
            type: SchemaType.TypeString,
            required: true,
        },
        takerAddress: {
            type: SchemaType.TypeString,
            required: true,
        },
        tokenId: {
            type: SchemaType.TypeString,
            required: true,
        },
        tokenIdToSwapWith: {
            type: SchemaType.TypeString,
            required: true,
        },
        amount: {
            type: SchemaType.TypeString,
            required: true,
        },
        amountToSwapWith: {
            type: SchemaType.TypeString,
            required: true,
            },
            bidderWalletAddress: {
                type: SchemaType.TypeString,
                required: true,
                },
            ownerWalletAddress: {
                type: SchemaType.TypeString,
                required: true,
                },
    },
    { timestamps: true }
);

module.exports = swapbidSchema;



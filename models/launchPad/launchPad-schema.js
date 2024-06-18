const mongoose = require("mongoose");
const schemaType = require("../../types");


const launchPadSchema = new mongoose.Schema(
  {
    projectName: {
      type: schemaType.TypeString,
    },

    projectWebsite: {
      type: schemaType.TypeString,
    },

    projectTwitter: {
      type: schemaType.TypeString,
    },

    projectDiscord: {
      type: schemaType.TypeString,
    },

    projectDescription: {
      type: schemaType.TypeString,
    },

    roadmap: {
      type: schemaType.TypeString,
    },

    projectGoals: {
      type: schemaType.TypeString,
    },

    discordID: {
      type: schemaType.TypeString,
    },

    contactEmail: {
      type: schemaType.TypeString,
    },

    content: {
      type: schemaType.TypeString,
    },

    teamInformation: {
      type: schemaType.TypeString,
    },

    affiliationCompanies: {
      type: schemaType.TypeString,
    },

    projectInvestment: {
      type: schemaType.TypeString,
    },

    contractAddress: {
      type: schemaType.TypeString,
    },

    contractType: {
      type: schemaType.TypeString,
    },

    artworkSamples: {
      type: schemaType.TypeString,

      // artworkSamples_url: {
      //   type: schemaType.TypeString,
      // }
    },

    expectedMintDate: {
      type: schemaType.TypeDate,
      //  default: new Date().toISOString(),
    },

    mintSupply: {
      type: schemaType.TypeString,
    },

    artMarketplace: {
      type: schemaType.TypeString,
      enum: ["Yes", "No"],
    },

    dreamhubDox: {
      type: schemaType.TypeString,
      enum: ["Yes", "No"],
    },

    mintFunds: {
      type: schemaType.TypeDate,
      // enum:["24 hours", "3 days", "7 days"]
    },

    additionalInformation: {
      type: schemaType.TypeString,
    },

    status: {
      type: schemaType.TypeString,
      default: "Pending",
    },

    userAddress: {
      type: schemaType.TypeString,
      // default:"Pending"
    },

    userId: {
      type: schemaType.TypeString,
    },

    name: {
      type: schemaType.TypeString,
    },
    symbol: {
      type: schemaType.TypeString,
    },
    mintPrice: {
      type: schemaType.TypeString,
    },
    discountedPrice: {
      type: schemaType.TypeString,
    },
    startTime: {
      type: schemaType.TypeNumber,
    },
    presaleDuration: {
      type: schemaType.TypeString,
    },
    revelTime: {
      type: schemaType.TypeNumber,
    },
    //========added by umer
    mintLimit: {
      type: schemaType.TypeNumber,
    },
    deployedContractAddress: {
      type: schemaType.TypeString,
      default:"",
    },
    revealUri: {
      type: schemaType.TypeString,
    },
    unRevealUri: {
      type: schemaType.TypeString,
    },
    discountFor: {
      type: schemaType.TypeString,
    },
    whiteList:{
      type: schemaType.TypeString,
    },
    chainType: {
      type: schemaType.TypeString,
    },
  
  },
  { timestamps: true }
);

module.exports = launchPadSchema;



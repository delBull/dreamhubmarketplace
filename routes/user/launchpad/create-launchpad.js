const Joi = require("joi");
const launchPad = require("../../../models/launchPad/index");
const { insertNewDocument, findOne } = require("../../../helpers");
const cloudinary = require("cloudinary").v2;

const Schema = Joi.object({
  projectName: Joi.string(),
  symbol: Joi.string(),
  projectDescription: Joi.string(),
  contactEmail: Joi.string(),

  contractType: Joi.string(),
  artworkSamples: Joi.string(),
  startTime: Joi.number(),
  presaleDuration: Joi.string(),
  revelTime: Joi.number(),
    //========added by umer
  mintLimit: Joi.number(),
  mintSupply: Joi.string(),
  mintPrice: Joi.string(),

  discountedPrice: Joi.string(),
  additionalInformation: Joi.string(),
  userAddress: Joi.string(),

  projectWebsite: Joi.string(),
  projectTwitter: Joi.string(),
  projectDiscord: Joi.string(),
  roadmap: Joi.string(),
  projectGoals: Joi.string(),
  discordID: Joi.string(),
  teamInformation: Joi.string(),
  affiliationCompanies: Joi.string(),
  projectInvestment: Joi.string(),
  contractAddress: Joi.string(),
  //expectedMintDate: Joi.string(),
  expectedMintDate: Joi.date().raw(),
  artMarketplace: Joi.string(),
  dreamhubDox: Joi.string(),
  mintFunds: Joi.string(),
  // mintFunds: Joi.date().raw(),
  name: Joi.string(),
  revealUri: Joi.string(),
  unRevealUri: Joi.string(),
  discountFor: Joi.string(),
  chainType: Joi.string(),
  whiteList: Joi.string(),
});

const launch = async (req, res) => {
  try {
    await Schema.validateAsync(req.body);

    console.log(req.body.whiteList, "ooooooooooo");

    if (!req?.files?.artworkSamples?.path) {
      return res.status(400).json({
        status: 400,
        message: "nft Image is required",
      });
    }
    const cloudObj = await cloudinary.uploader.upload(
      req?.files?.artworkSamples?.path,
      { quality: 20 }
    );
    req.body.artworkSamples = cloudObj.url;

    console.log(cloudObj, "cloudObj...");

    let userpad = new launchPad({
      ...req.body,
      userAddress: req.body.userAddress.toLowerCase(),
      artworkSamples: cloudObj.secure_url,
      artworkSamples_url: cloudObj.public_id,
    });

    console.log(userpad, "userpad.....");

    const launchData = await insertNewDocument("launchPad", userpad);

    console.log(launchData, "launchdata...");

    if (!launchData) {
      return res
        .status(400)
        .send({ status: 400, message: "No data Found", launchData });
    }

    return res
      .status(200)
      .send({ status: 200, message: "Created Successfully", launchData });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = launch;

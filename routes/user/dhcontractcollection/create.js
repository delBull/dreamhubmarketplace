const Joi = require("joi");
const { insertNewDocument, find } = require("../../../helpers");

const cloudinary = require("cloudinary").v2;

const schema = Joi.object({
  // name: Joi.string().required(),

  ownerId: Joi.string().required(),
  collection_name: Joi.string().required(),
  collection_address: Joi.string().required(),
  wallet_address: Joi.string().required(),
  profile_img: Joi.string().required(),
  banner_img: Joi.string().required(),
  chain: Joi.string().required(),
  discord: Joi.string(),
  website: Joi.string(),
  instagram: Joi.string(),
  telegram: Joi.string(),
  twitter: Joi.string(),
  description: Joi.string(),

  // contract_profile_img: Joi.string(),
  //contract_banner_img: Joi.string(),
  //userAddress:Joi.string().required(),
  profile_img: Joi.string(),
  banner_img: Joi.string(),

});

const createContractCollection = async (req, res) => {
  try {
    console.log(req.body, "req.body.......");
    await schema.validateAsync(req.body);
    console.log(req.body, "req....");

    // if (req?.files?.contract_profile_img?.path) {
    //   const profileImage = await cloudinary.uploader.upload(
    //     req?.files?.contract_profile_img?.path,
    //     { quality: 20 }
    //   );
    //   req.body.contract_profile_img = profileImage.url;
    // }
    // if (req?.files?.contract_banner_img?.path) {
    //   const coverImage = await cloudinary.uploader.upload(
    //     req?.files?.contract_banner_img?.path,
    //     { quality: 20 }
    //   );
    //   req.body.contract_banner_img = coverImage.url;
    // }

    if (req?.files?.profile_img?.path) {
      const profileImage = await cloudinary.uploader.upload(
        req?.files?.profile_img?.path,
        { quality: 20 }
      );
      req.body.profile_img = profileImage.url;
    }
    if (req?.files?.banner_img?.path) {
      const coverImage = await cloudinary.uploader.upload(
        req?.files?.banner_img?.path,
        { quality: 20 }
      );
      req.body.banner_img = coverImage.url;
    }

    

    const contractCheckCollection = await find("dhcontractcollection", {
      // name: req?.body?.name,
      collection_name: req?.body?.collection_name, //new line added by umer
    });

    console.log(contractCheckCollection, "contractCheckCollection");
    if (contractCheckCollection.length > 0) {
      return res.json({ status: 422, message: "Already available " });
    }

    const contractCollection = await insertNewDocument("dhcontractcollection", {
      ownerId: req?.body?.ownerId,
      collection_name: req?.body?.collection_name,
      discord: req?.body?.discord,
      website: req?.body?.website,
      instagram: req?.body?.instagram,
      telegram: req?.body?.telegram,
      twitter: req?.body?.twitter,
      collection_address: req?.body?.collection_address.toLowerCase(),
      wallet_address: req?.body?.wallet_address.toLowerCase(),
      description: req?.body?.description,
      chain: req?.body?.chain,
      // contract_profile_img: req?.body?.contract_profile_img,
      // contract_banner_img: req?.body?.contract_banner_img,
      profile_img: req?.body?.profile_img,
      banner_img: req?.body?.banner_img,

      // userAddress: req?.body?.userAddress.toLowerCase(),
    });

    console.log(contractCollection, "nftCollection...");

    return res.status(200).send({ status: 200, contractCollection });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = createContractCollection;

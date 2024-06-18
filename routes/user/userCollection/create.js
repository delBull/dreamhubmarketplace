const Joi = require("joi");
const {
  insertNewDocument,
  findOne,
  find,
  deleteManyDocument,
} = require("../../../helpers");
const { ObjectID } = require("../../../types");
const signup = require("../../auth/signup");
const { deleteDocument } = require("../../../helpers");
const cloudinary = require("cloudinary").v2;
const Moralis = require("moralis").default;

const schema = Joi.object({
  ownerId: Joi.string().required(),
  collection_name: Joi.string().required(),
  profile_img: Joi.string(),
  banner_img: Joi.string(),
  discord: Joi.string(),
  website: Joi.string(),
  instagram: Joi.string(),
  telegram: Joi.string(),
  twitter: Joi.string(),
  collection_address: Joi.string().required(),
  collection_desc: Joi.string().required(),
  chain: Joi.string().required(),
  wallet_address: Joi.string().required(),
  //blockcahin: Joi.string().required(),
  total_nfts: Joi.string().required(),
});

const createNftCollection = async (req, res) => {
  try {
    console.log(req.body, "req.body.......");
    await schema.validateAsync(req.body);
    console.log(req.body, "req....");

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

    const nftCheckCollection = await find("nftcollection", {
      collection_address: req?.body?.collection_address.toLowerCase(),
      chain: req?.body?.chain,
    });
    if (nftCheckCollection) {
      const nftDeleteCollection = await deleteManyDocument("nftcollection", {
        collection_address: req?.body?.collection_address.toLowerCase(),
        chain: req?.body?.chain,
      });
    }

    const nftCollection = await insertNewDocument("nftcollection", {
      ownerId: req?.body?.ownerId,
      collection_name: req?.body?.collection_name,
      discord: req?.body?.discord,
      website: req?.body?.website,
      instagram: req?.body?.instagram,
      telegram: req?.body?.telegram,
      twitter: req?.body?.twitter,
      collection_address: req?.body?.collection_address.toLowerCase(),
      collection_desc: req?.body?.collection_desc,
      chain: req?.body?.chain,
      wallet_address: req?.body?.wallet_address,
      //  blockcahin: req?.body?.blockcahin,
      total_nfts: req?.body?.total_nfts,
      profile_img: req?.body?.profile_img,
      banner_img: req?.body?.banner_img,
      collection_desc:req?.body?.collection_desc
    });

    console.log(nftCollection, "nftCollection...");

    const response = await Moralis.EvmApi.nft.getNFTOwners({
      address: req?.body?.collection_address,
      chain: req?.body?.chain,
    });

    console.log(response, "response");

    if (!response) {
      return res.json({
        status: 500,
        msg: [],
      });
    }

    const nftCheck = await find("nft", {
      tokenAddress: req?.body?.collection_address,
      nft_chain_id: req?.body?.chain,
    });
    if (nftCheck) {
      const nftDelete = await deleteManyDocument("nft", {
        tokenAddress: req?.body?.collection_address,
        nft_chain_id: req?.body?.chain,
      });
    }

    const data = response.result;

    console.log(data, "data");

    data.map(async (value) => {
      var minterId;
      var ownerId;

      var minterAddress = value._data.minterAddress.toLowerCase();
      var ownerAddress = value?.ownerOf._value.toLowerCase();

      //  console.log(value._data.minterAddress, "value");
      //       console.log(value?.ownerOf._value, "value1");

      const findMinter = await findOne("user", { username: minterAddress });
    //  console.log(findMinter._id);

      if (!findMinter) {
        const user = await insertNewDocument("user", {
          username: minterAddress,
          full_Name: "Unnamed",
          bio: "I just love NFTs and that's the reason I joined this cool Marketplace. Looking forward to engaging with all of you guys. Cheers!",
          // type: user_type._id,
        });
        console.log(user, "user");

        minterId = user._id;
      } else if (findMinter) {
        minterId = findMinter._id;
      }

      const findOwner = await findOne("user", { username: ownerAddress });
    //  console.log(findOwner._id);

      if (!findOwner) {
        const user = await insertNewDocument("user", {
          username: ownerAddress,
          full_Name: "Unnamed",
          bio: "I just love NFTs and that's the reason I joined this cool Marketplace. Looking forward to engaging with all of you guys. Cheers!",
          // type: user_type._id,
        });
        console.log(user, "user");

        ownerId = user._id;
      } else if (findOwner) {
        ownerId = findOwner._id;
      }

      // const image = value.metadata.image;
      // console.log(image, "image1");

      // const cloudObj = await cloudinary.uploader.upload(
      //   image,{quality:20},
      //   function (result) {
      //     console.log(result, "result1");
      //   }
      // );
      // console.log(cloudObj, "cloudObj");
      //});

      //   req.body.artworkSamples = cloudObj.url;

      
      
      const nft = await insertNewDocument("nft", {
        title: value?.metadata?.name
        ? value?.metadata?.name
        : value?._data?.tokenId,
        description: value?.metadata?.description,
        royality: "",
        size: "",
        abstraction: "",
        nft_chain_id: req.body.chain,
        nft_tokenId: value?._data?.tokenId,
        tokenAddress: req?.body?.collection_address.toLowerCase(),
        contract: value?._data?.contractType,
        totalSupply: value?._data?.amount,
        created_by: minterId,
        owner: ownerId,
        nftImg: value?.metadata?.image,
        collectionContractId: nftCollection._id,
        
        
        
      });
      

      const multipleNftDelete = await deleteDocument("multipleUser", {
        tokenAddress:req?.body?.collection_address.toLowerCase(),
        totalSupply: value?._data?.amount,
        remainingSupply: value?._data?.amount,
        ownerId: ownerId,
        nftId: nft._id,
        username: ownerAddress
      });

      const multiperUser = await insertNewDocument("multipleUser", {
        // ...body,
        tokenAddress:req?.body?.collection_address.toLowerCase(),
        totalSupply: value?._data?.amount,
        remainingSupply: value?._data?.amount,
        ownerId: ownerId,
        nftId: nft._id,
        username: ownerAddress,
      });

      console.log(nft,"nft");
      console.log(multiperUser,"multiperUser");
  return  nft  

    });

    return res.status(200).send({ status: 200, nftCollection });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = createNftCollection;

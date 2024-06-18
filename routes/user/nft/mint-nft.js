// const Joi = require("joi");
const { insertNewDocument, findOne, find } = require("../../../helpers");
//const saveActivity = require("../../../middleware/activity/save-activity");

const cloudinary = require("cloudinary").v2;

const createNft = async (req, res) => {
  try {
    const _id = req.params.id;
    const findUser = await findOne("user", { _id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }

    if (req.body.collection_id) {
      contractCollection = await findOne("dhcontractcollection", {
        _id: req?.body?.collection_id,
        username: req.body.minterAddress.toLowerCase(),
      });
    }

    if (!req.body.collection_id) {
      // num = random.randint(10**6, 10**7)

      var num = Math.random(10 ** 6).toString();
      var number = num.slice(2, 8);
      contractCollectionCreate = await insertNewDocument(
        "dhcontractcollection",
        {
          // name: `Untitled Collection #${number}`,
          // //name:"untitled",
          // description: "",
          // chain: "",
          // contract_profile_img: "",
          // contract_banner_img: "",
          // userAddress: req?.body?.minterAddress,
          collection_name: `Untitled Collection #${number}`,
          discord: "",
          website: "",
          instagram: "",
          telegram: "",
          twitter: "",
          collection_address: req?.body?.tokenAddress,
          wallet_address: req?.body?.minterAddress,
          description: "",
          chain:  req?.body?.nft_chain_id,
          // contract_profile_img: req?.body?.contract_profile_img,
          // contract_banner_img: req?.body?.contract_banner_img,
          profile_img: "",
          banner_img: "",


        }
      );
    }

    // //  console.log(contractCollectionCreate, "contractCollection");

    // If userAddress collection present

    const nft = await insertNewDocument("nft", {
      // ...body,
      title: req?.body?.title,
      description: req?.body?.description,
      royality: req?.body?.royality,
      size: req?.body?.size,
      abstraction: req?.body?.abstraction,
      nft_chain_id: req?.body?.nft_chain_id,
      pinataImgUrl: req?.body?.pinataImgUrl,
      pinataMetaDataUrl: req?.body?.pinataMetaDataUrl,
      nft_tokenId: req?.body?.nft_tokenId,
      tokenAddress: req?.body?.tokenAddress,
      contract: req?.body?.contract,
      totalSupply: req?.body?.totalSupply,
      created_by: _id,
      owner: _id,
      nftImg: req?.body?.nftImg,
      collectionContractId:
        req?.body?.collection_id || contractCollectionCreate._id,
      collectionContractAddress:  req?.body?.tokenAddress,
    });

    console.log(nft, "nft...");

    const multiperUser = await insertNewDocument("multipleUser", {
      // ...body,
      totalSupply: req?.body?.totalSupply,
      remainingSupply: req?.body?.totalSupply,
      ownerId: _id,
      nftId: nft._id,
      username: req?.body?.minterAddress,
    });

    console.log(multiperUser, "multiperUser...");

    const mintHistory = await insertNewDocument("history", {
      nft_id: nft._id,
      action: "mint",
      from: req.userId,
    });

    console.log(mintHistory, "mintHistory...");

    //   saveActivity(req, res, `User ${_id} Nft created successfully`);
    return res.status(200).send({ status: 200, nft, multiperUser });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = createNft;

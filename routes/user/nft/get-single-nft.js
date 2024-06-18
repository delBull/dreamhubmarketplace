const Joi = require("joi");
const {
  find,
  findOne,
  getAggregate,
  axiosGetCall,
} = require("../../../helpers");

const Moralis = require("moralis").default;

const schema = Joi.object({
  nft_tokenId: Joi.string().required(),
  tokenAddress: Joi.string().required(),
  nftId: Joi.string(),
  chain: Joi.string(),
});

const getSingleNft = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { nft_tokenId, tokenAddress, chain, nftId } = req.query;
    console.log({ nft_tokenId, tokenAddress, chain, nftId });

    const singleNft = await find("nft", {
      
      tokenAddress: tokenAddress,
      nft_chain_id: chain,
      nft_tokenId: nft_tokenId,
    });
    console.log(singleNft, "nft1");

    if (!singleNft[0]) {
      // return res.status(404).send({ status: 404, message: "No NFT found" });
      const response = await Moralis.EvmApi.nft.getNFTMetadata({
        address: tokenAddress,
        chain,
        tokenId: nft_tokenId,
      });

      const tokenUriData = await axiosGetCall(response.toJSON()?.token_uri);
      // console.log(response.result[i].tokenUri, { tokenUriData });
      // setTimeout(() => {
      // }, 3000);
      let data = {};
      data = {
        // data.push({
        ...response.toJSON(),
        // metaData: tokenUriData,
        metadata: tokenUriData,
      };

      return res
        .status(200)
        .json({ status: 200, singleNft: [data], moralis: true });
    }

    if (!singleNft) {
      return res.status(200).json({ status: 500, msg: "Oops no data found" });
    }

    console.log(singleNft[0].created_by, "rizwan .....");

    const singleNftuser = await findOne("user", {
      _id: singleNft[0].created_by,
    });
    // if(singleNftuser){

    // if (!singleNftuser) {
    //   return res
    //     .status(200)
    //     .json({ status: 500, msg: "Oops no user found" });
    // }
    console.log(singleNftuser, "singleNftuser");
    singleNft.push(singleNftuser);
    // }

    const ownerObject = await findOne("user", { _id: singleNft[0].owner[0] });

    console.log(ownerObject, "ownerObject");
    singleNft.splice(0, 1, {
      ...singleNft[0]._doc,
      ownerObject: [ownerObject],
    });
    // singleNft = singleNft.slice()

    // const singleNft = await getAggregate("nft", [
    //   {
    //     $match: {
    //       // _id: ObjectID(_id),
    //       // _id:nftId,
    //       nft_tokenId,
    //       tokenAddress: new RegExp(tokenAddress, "i"),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "owner",
    //       foreignField: "_id",
    //       as: "ownerObject",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "created_by",
    //       foreignField: "_id",
    //       as: "creatorObject",
    //     },
    //   },
    // ]);

    console.log(singleNft, "singleNft");

    // console.log({ singleNft });




    const multipleUsers = await find("multipleUser", {
      nftId: singleNft[0]._id || nftId,
    });
    if (!multipleUsers) {
      return res
        .status(400)
        .json({ status: 400, msseage: "No multipleUers find" });
    }
    console.log(multipleUsers, "multipleUsers...");
    
const dhCollection = await findOne("dhcontractcollection", {_id: singleNft[0].collectionContractId});    
const nftCollection = await findOne("nftcollection", {_id: singleNft[0].collectionContractId}); 

// if(!dhCollection && !nftCollection ) {
//   return res
//   .status(200)
//   .json({ status: 400, msseage: "No Collection found" });
// }
    
    
    const collection = dhCollection || nftCollection;
    
    
    // // const multipleUsers = [multipleUsersdata]
    return res.status(200).json({ status: 200, singleNft,multipleUsers, collection, moralis: false });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getSingleNft;

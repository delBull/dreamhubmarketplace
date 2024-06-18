const Joi = require("joi");
const { findOne, getAggregate, axiosGetCall } = require("../../../helpers");
const { ObjectID } = require("../../../types");
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
    // console.log({ nft_tokenId, tokenAddress, chain });
    const singleNft = await getAggregate("nft", [
      {
        $match: {
          // _id: ObjectID(_id),
          nft_tokenId,
          tokenAddress: new RegExp(tokenAddress, "i"),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerObject",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "creatorObject",
        },
      },
    ]);
    // console.log({ singleNft });
    if (!singleNft[0]) {
      // return res.status(404).send({ status: 404, message: "No NFT found" });
      const response = await Moralis.EvmApi.nft.getNFTMetadata({
        address: tokenAddress,
        chain,
        tokenId: nft_tokenId,
      });
      console.log(response.toJSON());


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
      .json({ status: 200, singleNft: data, multipleusers, moralis: true });
    }



//     const multipleusers = await findOne("multipleUser",{nftId:nftId}) 
// console.log(multipleusers, "multipleusers...");

    return res
    .status(200)
    .json({ status: 200, singleNft: singleNft[0], moralis: false,singleNft });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getSingleNft;

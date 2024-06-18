const Joi = require("joi");
const { default: Moralis } = require("moralis");
const { getAggregate, insertNewDocument } = require("../../helpers");

const schema = Joi.object({
  nft_tokenId: Joi.string().required(),
  tokenAddress: Joi.string().required(),
  chain: Joi.string(),
});
const schemaBody = Joi.object({
  nftId: Joi.string(),
  id: Joi.string().required(),
  actualPrice: Joi.string(),
  minimumBid: Joi.string(),
  bidGap: Joi.string(),
  startDate: Joi.number(),
  endDate: Joi.number(),
  nftType: Joi.string().valid("mint", "sell", "auction", "bid").required(),
});

const checkOrCreateNftToDb = async (req, res, next) => {
  try {
    await schema.validateAsync(req.query);
    await schemaBody.validateAsync(req.body);
    const { nft_tokenId, tokenAddress, chain } = req.query;
    const singleNft = await getAggregate("nft", [
      {
        $match: {
          // _id: ObjectID(_id),
          nft_tokenId,
          tokenAddress: new RegExp(tokenAddress, "i"),
        },
      },
    ]);
    console.log(singleNft);
    if (!singleNft.length) {
      // return res.status(404).send({ status: 404, message: "No NFT found" });
      const response = await Moralis.EvmApi.nft.getNFTMetadata({
        address: tokenAddress,
        chain,
        tokenId: nft_tokenId,
      });
      const newData = response.toJSON();
      console.log({ newData });
      const createNftInDb = await insertNewDocument("nft", {
        title: newData?.metadata?.name,
        description: newData?.metadata?.description,
        nftImg: newData?.metadata?.image,
        nft_chain_id: chain,
        nft_tokenId: newData?.token_id,
        tokenAddress: newData?.token_address,
        owner: req.userId,
        royality: "0",
        // royality: newData?.royality,
        // size: newData?.size,
        // abstraction: newData?.abstraction,
        // pinataImgUrl: newData?.pinataImgUrl,
        // pinataMetaDataUrl: newData?.pinataMetaDataUrl,
        // created_by: _id,
      });
      // delete req.query.nft_tokenId;
      // delete req.query.tokenAddress;
      // delete req.query.chain;
      // if (!createNftInDb?._id) {
      //   return res
      //     .status(400)
      //     .send({ status: 400, message: "Error creating NFT" });
      // }
      req.body.nftId = String(createNftInDb?._id);
      next();
      // console.log(response.toJSON());
    }
    // delete req.query.nft_tokenId;
    // delete req.query.tokenAddress;
    // delete req.query.chain;
    // if (!singleNft[0]?._id) {
    //   return res
    //     .status(400)
    //     .send({ status: 400, message: "Error creating NFT" });
    // }
    req.body.nftId = String(singleNft[0]?._id);
    next();
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = checkOrCreateNftToDb;

// {
//     "token_address": "0x22e21cb5007200ed822e72696e2ae8624d38f87a",
//     "token_id": "8",
//     "amount": "1",
//     "owner_of": "0x5ba3f0012c009b646f34e4dcf3546cdfca751f55",
//     "token_hash": "0330c900e00df72a0249e1bf6e4c3ae9",
//     "block_number_minted": "7916029",
//     "block_number": "7916029",
//     "transfer_index": [
//         7916029,
//         29,
//         64,
//         0
//     ],
//     "contract_type": "ERC721",
//     "name": "Goddesses Of Sun",
//     "symbol": "GOS",
//     "token_uri": "https://ipfs.moralis.io:2053/ipfs/QmSRFmZjvrihgvy8QUAT9uw1G8xLivQ2AgKTUxYaqqcbky",
//     "metadata": "{\"name\":\"Goddesses of Sun\",\"description\":\"999 Goddesses, Unlimited Potential. \\n Our story originates from the suburbs of Pakistan, where we seek to enhance how inclusive, supportive and benevolent the Web3 world can attain. We aim to create an exciting ecosystem operating beyond the confines of self-identity such as gender, age and ethnicity labels.\\n ☀️\",\"image\":\"ipfs://QmXWzSEPVck6uC3TinhYPyfrmk5So4t6VAHunyM69YCJdj\",\"attributes\":[{\"trait_type\":\"Un-Reveal\",\"value\":\"Hidden\"}]}",
//     "last_token_uri_sync": "2022-11-08T14:39:05.860Z",
//     "last_metadata_sync": "2022-11-08T14:39:10.783Z",
//     "minter_address": "0x5ba3f0012c009b646f34e4dcf3546cdfca751f55"
// }

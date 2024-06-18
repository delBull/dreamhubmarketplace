const Joi = require("joi");
const Moralis = require("moralis").default;

const schema = Joi.object({
  address: Joi.string().required(),
  chain: Joi.string().required(),
  tokenId: Joi.string().required(),
});

const getNftMetaData = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { address, chain, tokenId } = req.query;
    console.log(req.query, "req.query...");
    const response = await Moralis.EvmApi.nft.getNFTMetadata({
      address,
      chain,
      tokenId,
    });
    console.log(response.toJSON());
    return res.status(200).json({
      status: 200,
      data: response.toJSON(),
     
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = getNftMetaData;

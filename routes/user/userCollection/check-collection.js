const Moralis = require("moralis").default;
//const { EvmChain } = require("@moralisweb3/common-evm-utils");

const check_collection = async (req, res) => {
  try {
    const { collection_address, chain } = req.query;
    console.log({ collection_address, chain });

    // const chain = EvmChain.ETHEREUM;

    const response = await Moralis.EvmApi.nft.getContractNFTs({
      address: collection_address,
      chain: chain,
    });

    const data = response.result;

    if (data.length < 1) {
      return res
        .status(400)
        .send({ status: 400, msg: "No Collection Exist", moralis: false });
    }
  

    return res
      .status(200)
      .json({ status: 200, response: response.result, moralis: true });
  } catch (error) {
    return res
      .status(400)
      .send({ status: 400, message: error.message, moralis: false });
  }
};

module.exports = check_collection;

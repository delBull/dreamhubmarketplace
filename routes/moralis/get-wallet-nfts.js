const Joi = require("joi");
const { isValidURL, axiosGetCall } = require("../../helpers");
const Moralis = require("moralis").default;

const schema = Joi.object({
  address: Joi.string().required(),
  chain: Joi.string().required(),
  cursor: Joi.string(),
  limit: Joi.number().required(),
});

const getWalletNfts = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { address, chain, cursor, limit } = req.query;
    // console.log({ address, chain, cursor, limit });
  


      const response = await Moralis.EvmApi.nft.getWalletNFTs({
      // const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
      // const response = await Moralis.EvmApi.nft.getNFTContractTransfers({
      // address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      // set: MORALIS_API_KEY,
      // address: "0xf4910C763eD4e47A585E2D34baA9A4b611aE448C", // testnet opensea contract
      // address: "0x86ef335cb0ada3c681ec4240ef6520c407adeb0b", // mainnet opensea contract
      // chain: EvmChain.ETHEREUM,
      // chain: EvmChain.BSC,
      address,
      cursor,
      chain,
     
      limit: +limit,
    });
    const data = {
      ...response,
      result: [],
    };
    // var data = {
    //   total: response.total,
    //   page: response.page,
    //   page_size: response.page_size,
    //   cursor: response.cursor,
    //   result: [],
    // };
    await (async function loop() {
      for (let i = 0; i < response.result.length; i++) {
        if (isValidURL(response.result[i].tokenUri)) {
          const tokenUriData = await axiosGetCall(response.result[i]?.tokenUri);
          // console.log(response.result[i].tokenUri, { tokenUriData });
          // setTimeout(() => {
          // }, 3000);
          data.result.push({
            // data.push({
            ...{_data: {...response.result[i]._data,
            metadata:tokenUriData}},
            
          });
        } else {
          // data.push
          data.result.push(response.result[i]);
        }
      }
    })();

   
    console.log("147:", response.result.length);

    // delete response.result;
    return res.status(200).json({
      status: 200,
      data: data,
     // result: totalLength.total,
      // response: response,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = getWalletNfts;

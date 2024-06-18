const { find, getDataWithLimit } = require("../../../helpers");
const Moralis = require("moralis").default;

const searchnfts = async (req, res) => {
  try {
    const { chain, collection_address, collection_name } = req.query;

    let queryObj = {};

    if (chain) {
      queryObj.chain = chain;
    }

    if (collection_address) {
      queryObj.collection_address = collection_address;
    }

    if (collection_name) {
      queryObj.collection_name = { $regex: collection_name, $options: "i" };
    }

    const apiData = await getDataWithLimit("nftcollection", queryObj, {}, {});

    const dhContractData = await getDataWithLimit(
      "dhcontractcollection",
      queryObj,
      {},
      {}
    );

    console.log(apiData, "apiData");
    console.log(dhContractData, "dhContractData");

    let data = apiData;

    //Is pr km new hain

    const moralisData = data.map((obj) => {
      // console.log(obj,"obj");
      return find("nft", {
        tokenAddress: obj.collection_address,
        nft_chain_id: obj.chain,
      }).then((nftObj) => {
        console.log(nftObj, "hello");
        return {
          ...obj._doc,
          nfts: nftObj.slice(0, 10),
          // totalVolume : obj.response
        };
      });
    });

    Promise.all(moralisData, dhContractData).then((values) => {
      return res.json({ status: 200, msg: values, dhContractData });
    });
  } catch (error) {
    return res.json({ status: 500, message: error.message });
  }
};

module.exports = searchnfts;

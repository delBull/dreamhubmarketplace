const Moralis = require("moralis").default;

const getNftOwner = async (req, res) => {
  try {
    const response = await Moralis.EvmApi.nft.getNFTOwners({
      address: "0x7f7685b4CC34BD19E2B712D8a89f34D219E76c35",
      chain: "1",
    });
    return res.status(200).send({ status: 200, response });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = getNftOwner;

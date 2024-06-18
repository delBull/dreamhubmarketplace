const { find } = require("../../../helpers");

const getSingleCollection = async (req, res) => {
  try {
    const { address, chain } = req.query;

    const getSingleCollection = await find("nft", {
      tokenAddress: address,
      nft_chain_id: chain,
    });
    if (!getSingleCollection) {
      return res.status(200).json({ status: 500, msg: "Oops no data found" });
    }

    return res
      .status(200)
      .json({
        status: 200,
        msg: getSingleCollection,
        nbhit: getSingleCollection.length,
      });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getSingleCollection;

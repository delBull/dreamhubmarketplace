const { findOne, getAggregate } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const getNftAuction = async (req, res) => {
  try {
    const { nft_id } = req.params;
    const check_nft = await findOne("nft", { _id: nft_id });
    if (!check_nft) {
      return res.status(404).send({ status: 404, message: "NFT not found" });
    }
    const auctions = await getAggregate("auction", [
      {
        $match: { nft_id: ObjectID(nft_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "auctioner_id",
          foreignField: "_id",
          as: "auctionerObject",
        },
      },
    ]);

    return res.status(200).send({ status: 200, auctions });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getNftAuction;

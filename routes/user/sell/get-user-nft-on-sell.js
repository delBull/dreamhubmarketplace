const { find, findOne, getAggregate } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const getUserNFTOnSell = async (req, res) => {
  try {
    const _id = req.params.id;
    const findUser = await findOne("user", { _id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }
    const sells = await getAggregate("nft", [
      {
        $match: {
          owner: ObjectID(_id),
          nftType: "sell",
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
    return res.status(200).send({ status: 200, sells });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = getUserNFTOnSell;

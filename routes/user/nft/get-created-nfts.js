const { find, findOne,getAggregate } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const getCreatedNfts = async (req, res) => {
  try {
    const _id = req.params.id;
    const { limit,page } = req.query;
    const findUser = await findOne("user", { _id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }

    const totalNft = await find("nft", {created_by:_id})

    const pageData = page;
    const limitData = limit;
    // If you are starting page number from 1 then you need to minus 1
    const skip = (pageData - 1) * limitData;

    const createdNfts = await getAggregate("nft", [
      {
        $match: {
          created_by: ObjectID(_id),
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
      {
        $lookup: {
          from: "dhcontractcollections",
          localField: "collectionContractId",
          foreignField: "_id",
          as: "collectionObject",
        },
      },

      {
        $skip: skip
      },
      {
        $limit: Number(limit)
      },
     
    ]);

    console.log(createdNfts.length,"createdNfts...");
    return res.status(200).send({ status: 200, createdNfts, nbhit:createdNfts.length, totalLength:totalNft.length });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = getCreatedNfts;

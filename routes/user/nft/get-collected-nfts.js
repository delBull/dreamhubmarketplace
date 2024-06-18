const { find, findOne, getAggregate } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const getCollectedNfts = async (req, res) => {
  try {
   
    const _id = req.params.id;
    const findUser = await findOne("user", { _id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }
    const collectedNfts = await getAggregate("nft", [
      {
        $match: {
          owner: ObjectID(_id),
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

    // let queryObj = {};

    // if (title) {
    //   queryObj.title = { $regex: title, $options: "i" };
    // }

    // if (abstraction) {
    //   queryObj.abstraction = { $in: abstraction.split(",") };
    // }

    // if (nftType) {
    //   queryObj.nftType = { $in: nftType.split(",") };
    // }

    // if (contract) {
    //   queryObj.contract = { $in: contract.split(",") };
    // }
    // if (nft_chain_id) {
    //   queryObj.nft_chain_id = { $in: nft_chain_id.split(",") };
    // }

    // if(min || "" && max || "" ){
    //   queryObj.actualPrice = { $gte: min, $lte: max };
    // }

    // let sort = {};
    // if (actualPrice) {
    //   sort.actualPrice = actualPrice === "false" ? -1 : 1;
    // }

    //  let page = Number(req.query.page) || 1;
    //  let limit = Number(req.query.limit) || 9;

    //  let skip = (page - 1) * limit;

    //  const dataLength = await getDataWithSort("nft", queryObj, {}, {}, {});

    // const apiData = await getDataWithSort("nft", queryObj, sort, skip, limit);
    // console.log(apiData, "apiData");

    // let page = Number(req.query.page) || 1;
    // let limit = Number(req.query.limit) || 9;

    // let skip = (page - 1) * limit;

    return res.status(200).send({ status: 200, collectedNfts });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = getCollectedNfts;

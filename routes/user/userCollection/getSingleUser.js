const { findOne, getAggregate } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const getSingleUser = async (req, res) => {
  try {
    const { id } = req.query;

    const getSingleCollection = await findOne("nftcollection", {
      _id: id,
    });

    
    const singleCollection = await findOne("dhcontractcollection", {
      _id: id,
    });
    // { "$addFields": { "articleId": { "$toObjectId": "$articleId" }}}
    if (!getSingleCollection && !singleCollection ) {
    return res.status(200).json({ status: 500, msg: "Oops no data found" });
  }
    
    const findRoles = await getAggregate("nftcollection", [
    {
      $match: {_id:ObjectID(id) }
    },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerId",
        },
      },
    ]);

console.log(findRoles,"findRoles");



const finddh = await getAggregate("dhcontractcollection", [
  {
    $match: {_id:ObjectID(id) }
  },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "ownerId",
      },
    },
  ]);

console.log(finddh,"finddh");


    return res
      .status(200)
      .json({
        status: 200,
         msg: findRoles || finddh,
         nbhit: findRoles.length || finddh.length,
      });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getSingleUser;

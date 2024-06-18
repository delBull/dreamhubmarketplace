const Joi = require("joi");
const { find, getAggregate } = require("../../../helpers");

const schema = Joi.object({
  nftType: Joi.string().valid("sell", "auction", "bid").required(),
});

const getAllNFTOnSell = async (req, res) => {
  try {
  // await schema.validateAsync(req.query);
    const { nftType } = req.query;
    console.log(nftType,'nftType');

  

    const sells = await getAggregate("nft", [
      {
        $match: {
           $or: [{ nftType: 'sell' }, { nftType: 'auction' },{ nftType: 'bid' }]
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

    console.log(sells,"sells");

    const sell = sells.slice(sells.length - 16,  sells.length);

    return res.status(200).send({ status: 200, sells: sell });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = getAllNFTOnSell;

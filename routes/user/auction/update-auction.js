const Joi = require("joi");
const { findOne, updateDocument, getAggregate } = require("../../../helpers");
const saveActivity = require("../../../middleware/activity/save-activity");
const { ObjectID } = require("../../../types");

const schema = Joi.object({
  auction_id: Joi.string().required(),
  auctioner_id: Joi.string().required(),
  auction_price: Joi.string().required(),
});

const updateAuction = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { auction_id, auctioner_id, auction_price } = req.body;
    const check_auction = await findOne("auction", {
      _id: auction_id,
      auctioner_id,
    });
    if (!check_auction) {
      return res.status(404).send({ status: 404, message: "no auction found" });
    }
    const updateAuction = await updateDocument(
      "auction",
      { _id: auction_id },
      { auction_price }
    );
    const auction = await getAggregate("auction", [
      {
        $match: { _id: ObjectID(auction_id) },
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
    // console.log(req.io);
    // console.log(check_auction?.nft_id);
    // console.log(`${check_auction?.nft_id?.concat(" ", "updateauction")}`);
    req.io.emit(check_auction?.nft_id.valueOf() + "updateauction", {
      auction_id,
      auction,
    });
    saveActivity(req, res, `User ${auction_id} updated this auction ${auction_id} for ${auction_price} price successfully`);
    return res.status(200).send({
      status: 200,
      updateAuction,
      message: "Auction updated successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = updateAuction;

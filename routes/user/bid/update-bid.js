const Joi = require("joi");
const { findOne, updateDocument, getAggregate } = require("../../../helpers");
const saveActivity = require("../../../middleware/activity/save-activity");
const { ObjectID } = require("../../../types");

const schema = Joi.object({
  bid_id: Joi.string().required(),
  bidder_id: Joi.string().required(),
  bid_price: Joi.string().required(),
});

const updateBid = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { bid_id, bidder_id, bid_price } = req.body;
    const check_bid = await findOne("bid", {
      _id: bid_id,
      bidder_id,
    });
    if (!check_bid) {
      return res.status(404).send({ status: 404, message: "no bid found" });
    }
    const updateBid = await updateDocument(
      "bid",
      { _id: bid_id },
      { bid_price }
    );
    const bid = await getAggregate("bid", [
      {
        $match: { _id: ObjectID(bid_id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "bidder_id",
          foreignField: "_id",
          as: "bidderObject",
        },
      },
    ]);
    req.io.emit(check_bid?.nft_id.valueOf() + "updatebid", { bid_id, bid });
    saveActivity(req, res, `User ${bidder_id} update the bid ${bid_price} prize`);
    return res
      .status(200)
      .send({ status: 200, updateBid, message: "User bid updated successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = updateBid;

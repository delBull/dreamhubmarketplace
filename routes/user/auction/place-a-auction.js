const Joi = require("joi");
const saveActivity = require("../../../middleware/activity/save-activity");
const {
  findOne,
  insertNewDocument,
  getAggregate,
} = require("../../../helpers");
// const saveActivity = require("../../../middleware/activity/save-activity");
const schema = Joi.object({
  nft_id: Joi.string().required(),
  auctioner_id: Joi.string().required(),
  auctioner_wallet_address: Joi.string().required(),
  auction_price: Joi.string().required(),
});

const placeAAuction = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { nft_id, auctioner_id, auctioner_wallet_address } = req.body;
    const check_nft = await findOne("nft", { _id: nft_id });
    if (!check_nft) {
      return res.status(404).send({ status: 404, message: "NFT not found" });
    }
    const check_auction_user = await findOne("user", { _id: auctioner_id });
    if (!check_auction_user) {
      return res.status(404).send({ status: 404, message: "user not found" });
    }
    if (check_auction_user.username !== auctioner_wallet_address) {
      return res
        .status(400)
        .send({ status: 400, message: "wallet address mismatch" });
    }
    const createAuction = await insertNewDocument("auction", { ...req.body });
    const auction = await getAggregate("auction", [
      {
        $match: { _id: createAuction._id },
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
    // saveActivity(req, res, `placed an auction for ${check_nft.name}`);
    req.io.emit(nft_id + "placeauction", { auction });


    const auctionHistory = await insertNewDocument("history",{
      from:auctioner_id,
      price:createAuction.auction_price,
      action:"Place a bid on the nft",
      to:check_nft.owner,
      nft_id:nft_id,
    })

    console.log(auctionHistory,"auctionHistory");


    saveActivity(
      req,
      res,
      `User ${auctioner_id} auction placed this nft ${nft_id} successfully`
    );
    return res.status(200).send({
      status: 200,
      createAuction,
      message: "Auction placed successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = placeAAuction;

//const Joi = require("joi");
//const saveActivity = require("../../../middleware/activity/save-activity");

const {
  deleteManyDocument,
  updateDocument,
  findOne,
  insertNewDocument,
} = require("../../../helpers");

// const schema = Joi.object({
//   bid_id: Joi.string().required(),
//   bidder_id: Joi.string().required(),
//   ownerId: Joi.string(),
//   nftId: Joi.string(),
//   username: Joi.string(),
//   //selectedListing: Joi.string(),

// });

const acceptBid = async (req, res) => {
  try {
   // await schema.validateAsync(req.body);
    const { bid_id, bidder_id, ownerId, nftId, username,selectedListing } = req.body;
    
    console.log(req.body,"req");
    
    const check_bid = await findOne("bid", {
      _id: bid_id,
      bidder_id,
    });

    if (!check_bid) {
      return res.status(404).send({ status: 404, message: "no bid found" });
    }
    const updateNft = await updateDocument(
      "nft",
      { _id: check_bid.nft_id },
      {
        
        totalSupply: 1,
        nftType: "mint",
        actualPrice: "",
        endDate: "",
        startDate: "",
        bidGap: "",
        listingid: "",
        minimumBid: "",
        totalSupply:0,
        remainingSupply: 1,
        sellnftnumber: 0,
//        owner: [bidder_id]
owner:bidder_id,
      }
    );

    console.log(updateNft, "updateNft");

    const mulitplenft = await updateDocument(
      "multipleUser",
      { _id: selectedListing._id },

      {
        userwalletaddress:check_bid.bidder_wallet_address.toLowerCase(),
        ownerId: bidder_id,
        username:check_bid.bidder_wallet_address.toLowerCase(),
        nftType: "mint",
        endDate: null,
        startDate: null,  
        remainingSupply: 1,
        listingId: null,
        price: null,
        sellnftnumber: 0,
      }
    );

    console.log(mulitplenft, "mulitplenft...");

    const deleteBids = await deleteManyDocument("bid", {
      nft_id: check_bid.nft_id,
    });
    const history = await insertNewDocument("history", {
      nft_id: check_bid.nft_id,
      action: "offer accepted",
      from: req.userId,
      price: check_bid.bid_price,
      to: bidder_id,
    });
    req.io.emit(check_bid?.nft_id.valueOf() + "acceptbid", { bid: [] });

    return res
      .status(200)
      .send({ status: 200, message: "Bid accepted successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = acceptBid;

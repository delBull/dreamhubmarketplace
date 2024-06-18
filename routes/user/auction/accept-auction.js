const Joi = require("joi");
const saveActivity = require("../../../middleware/activity/save-activity");

const {
  deleteManyDocument,
  updateDocument,
  findOne,
  insertNewDocument,
} = require("../../../helpers");

const schema = Joi.object({
  auction_id: Joi.string().required(),
  auctioner_id: Joi.string().required(),
  // auctioner_wallet_address: Joi.string().required(),
  ownerId: Joi.string(),
  nftId: Joi.string(),
  multipleUserId: Joi.string(),
});

const acceptAuction = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    console.log(req.body);
    const { auction_id, auctioner_id, ownerId, nftId,multipleUserId } = req.body;
    const check_auction = await findOne("auction", {
      _id: auction_id,
      auctioner_id,
    });
    if (!check_auction) {
      return res.status(404).send({ status: 404, message: "no auction found" });
    }
    const checkNft = await findOne("nft", { _id: check_auction.nft_id });
    const updateNft = await updateDocument(
      "nft",
      { _id: check_auction.nft_id },
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
        owner: [auctioner_id]
        }
    );

    const mulitplenft = await updateDocument(
      "multipleUser",
      // { nftId: nftId }, commented by umer
      { _id: multipleUserId }, //added too

      {
        
        
        userwalletaddress: check_auction.auctioner_wallet_address.toLowerCase(),
        ownerId: auctioner_id,
        username: check_auction.auctioner_wallet_address.toLowerCase(),
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

    const deleteAuctions = await deleteManyDocument("auction", {
      nft_id: check_auction.nft_id,
    });

    const history = await insertNewDocument("history", {
      nft_id: check_auction.nft_id,
      action: "transfer",
      from: checkNft.owner,
      price: check_auction.auction_price,
      to: auctioner_id,
    });
    req.io.emit(check_auction?.nft_id.valueOf() + "acceptauction", {
      auction: [],
    });
    saveActivity(
      req,
      res,
      `User ${history.to} auction this nft ${history.nft_id} for ${history.price} price and nft owner ${history.from} accepted successfully`
    );
    return res
      .status(200)
      .send({ status: 200, message: "Auction accepted successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = acceptAuction;

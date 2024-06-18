const Joi = require("joi");
const saveActivity = require("../../../middleware/activity/save-activity");
const {
  insertNewDocument,
  deleteDocument,
  findOne,
  updateDocument,
} = require("../../../helpers");

const schema = Joi.object({
  sellId: Joi.string().required(),
  id: Joi.string().required(),
  swapnftnumber: Joi.number().required(),
  //  sellerId: Joi.string().required(),
  username: Joi.string().required(),
  multipleId: Joi.string()
});

const swapNft = async (req, res) => {
  try {

    await schema.validateAsync(req.query);
    console.log(req.body, "req.body");
    const { selectedListing } = req.body
    const { sellId, id,  swapnftnumber, sellerId, username } = req.query;
//const {id} = req.query;

console.log(req.body, "req.body....");
console.log(req.query, "req.query....");


    const findUser = await findOne("user", { _id: id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }

console.log(findUser, "findUser...");

    const findNFT = await findOne("nft", { _id: sellId });

    if (!findNFT) {
      return res.status(404).send({ status: 404, message: "No NFT Found" });
    }

    const multipleOwner = await findOne("multipleUser", { nftId: sellId, ownerId: id });
    const Seller = await findOne("multipleUser", { nftId: sellId });

    // if (!multipleOwner) {
    //   return res.status(404).send({ status: 404, message: "No NFT Found in  multipleUser" });
    // }

    const checkOnSell = await findOne("nft", {
      _id: sellId,
      nftType: { $in: ["sell", "bid"] },
    });
    if (!checkOnSell) {
      return res
        .status(404)
        .send({ status: 404, message: "This nft is not on sell" });
    }


    const multipleUsercheckOnSell = await findOne("multipleUser", {
      nftId: sellId,
      nftType: { $in: ["sell", "bid"] },
    });
    if (!multipleUsercheckOnSell) {
      return res
        .status(404)
        .send({ status: 404, message: "This nft is not on sell on multipleUser" });
    }


   

    const nft = await updateDocument(
      "nft",
      { _id: sellId },
      {
        ...req.body,
        events: {
          ...findNFT.events,
          ...req.body.events,
          _BuyMarketItem: [
            ...(findNFT?.events?._BuyMarketItem || []),
            ...([req.body?.events?._BuyMarketItem] || []),
          ],
        },
        nftType: findNFT.nftType,
        // created_by: id,
        //  remainingSupply: Number(findNFT.remainingSupply ) + Number(swapnftnumber),
        // remainingSupply: Number(findNFT.remainingSupply) - Number(swapnftnumber),
        sellnftnumber: Number(findNFT.sellnftnumber) - Number(swapnftnumber),
        owner: findNFT.owner.filter(obj => obj == id).length ? findNFT.owner : [id, findNFT.owner],
      }
    );


    if (multipleOwner) {

      const newbuyer = await updateDocument(
        "multipleUser",
        {
          nftId: sellId,
          ownerId: id
        },
        {
          username,
          //nftType: findNFT.nftType,
          // totalSupply: (Number(multipleOwner?.remainingSupply || 0) + Number(swapnftnumber)) || Number(swapnftnumber),
          // totalSupply: Number(multipleOwner.remainingSupply) + Number(swapnftnumber),
          nftId: selectedListing.nftId,
          swapnftnumber: multipleOwner?.swapnftnumber ? Number(multipleOwner?.swapnftnumber) + Number(swapnftnumber) : swapnftnumber,
          ownerId: selectedListing.ownerId,
          remainingSupply: (Number(multipleOwner?.remainingSupply || 0) + Number(swapnftnumber)) || Number(swapnftnumber),
        }
      );


      console.log(newbuyer, "newbuyer...");

      const oldbuyermultipleUse = await updateDocument(
        "multipleUser",
        {
          // _id: multipleId,
          nftId: sellId,
          ownerId: selectedListing.ownerId,
          //ownerId: id,
          //   userId: id,
        },
        {
          // //nftType: findNFT.nftType,
          // swapnftnumber: multipleOwner?.swapnftnumber ? multipleOwner?.swapnftnumber+ swapnftnumber : swapnftnumber,
          // ownerId: id,
          //userId: id,
          username,
          sellnftnumber: Number(Seller.sellnftnumber) - Number(swapnftnumber),
          remainingSupply: (Number(Seller?.remainingSupply || 0) - Number(swapnftnumber)) || Number(swapnftnumber),
        }
      );

      console.log(oldbuyermultipleUse, "oldbuyermultipleUse11111...");

      const history = await insertNewDocument("history", {
        nft_id: sellId,
        action: "transfer",
        from: id,
        price: findNFT.actualPrice,
        to: req.userId,
      });

      return res.status(200).send({ status: 200, nft, oldbuyermultipleUse, newbuyer });
    }

    else {

      const newbuyermultipleUser = await insertNewDocument(
        "multipleUser",
        //   {
        //     nftId: sellId,
        //  //   userId: id,
        //   },
        {
          //nftType: findNFT.nftType,
          totalSupply: Number(Seller?.totalSupply),
          nftId: sellId,
          swapnftnumber: multipleOwner?.swapnftnumber ? Number(multipleOwner?.swapnftnumber) + Number(swapnftnumber) : swapnftnumber,
          ownerId: id,
          remainingSupply: Number(swapnftnumber),
          username,
          //userId: id,
          // sellnftnumber: multipleOwner.sellnftnumber - swapnftnumber,
          // remainingSupply: multipleOwner.remainingSupply + Number(swapnftnumber),
        }
      );

      console.log(newbuyermultipleUser, "newbuyermultipleUser...");

      const oldbuyermultipleUse = await updateDocument(
        "multipleUser",
        {
          nftId: sellId,
          ownerId: selectedListing.ownerId,
          //   userId: id,
        },
        {
          // //nftType: findNFT.nftType,
          // swapnftnumber: multipleOwner?.swapnftnumber ? multipleOwner?.swapnftnumber+ swapnftnumber : swapnftnumber,
          // ownerId: id,
          //userId: id,
          username,
          sellnftnumber: Number(Seller?.sellnftnumber || 0) - Number(swapnftnumber),
          remainingSupply: Number(Seller?.remainingSupply || 0) - Number(swapnftnumber),
        }
      );

      console.log(oldbuyermultipleUse, "oldbuyermultipleUse22222...");

      const history = await insertNewDocument("history", {
        nft_id: sellId,
        action: "transfer",
        from: id,
        price: findNFT.actualPrice,
        to: req.userId,
      });

      return res.status(200).send({ status: 200, nft, oldbuyermultipleUse, newbuyermultipleUser });
    }

  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = swapNft;


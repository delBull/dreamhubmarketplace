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
  buynftnumber: Joi.number().required(),
//  sellerId: Joi.string().required(),
  username: Joi.string().required(),
  multipleId: Joi.string()
});

const buyNft = async (req, res) => {
  try {

    await schema.validateAsync(req.query);
console.log(req.body.seller, "req.body");
// const {selectedList}
    const { sellId, id, buynftnumber, sellerId , username } = req.query;
    const findUser = await findOne("user", { _id: id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }
    const findNFT = await findOne("nft", { _id: sellId });

    if (!findNFT) {
      return res.status(404).send({ status: 404, message: "No NFT Found" });
    }

    const multipleOwner = await findOne("multipleUser", { nftId: sellId, ownerId: id });
    const Seller = await findOne("multipleUser", { nftId: sellId});

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


    // await deleteDocument("sell", { _id: sellId });
    // const nft = await insertNewDocument("nft", {
    //   ...req.body,
    //   created_by: id,
    // });

    // const nft = await updateDocument(
    //   "nft",
    //   { _id: sellId },
    //   {
    //     ...req.body,
    //     events: {
    //       ...findNFT.events,
    //       ...req.body.events,
    //       _BuyMarketItem: [
    //         ...(findNFT?.events?._BuyMarketItem || []),
    //         ...([req.body?.events?._BuyMarketItem] || []),
    //       ],
    //     },
    //     nftType: "mint",
    //     // created_by: id,
    //     buynftnumber:buynftnumber,
    //     owner: [id,findNFT.owner],
    //   }
    // );


    // const newbuyer = await insertNewDocument(
    //   "nft",
    //   { _id: id },
    //   {
    //     ...req.body,
    //     nftType: "mint",
    //     // created_by: id,
    //     buynftnumber: buynftnumber,
    //     owner: [id],

    //   }
    // );



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
        //  remainingSupply: Number(findNFT.remainingSupply ) + Number(buynftnumber),
        // remainingSupply: Number(findNFT.remainingSupply) - Number(buynftnumber),
        sellnftnumber: Number(findNFT.sellnftnumber) - Number(buynftnumber),
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
          // totalSupply: (Number(multipleOwner?.remainingSupply || 0) + Number(buynftnumber)) || Number(buynftnumber),
          // totalSupply: Number(multipleOwner.remainingSupply) + Number(buynftnumber),
          nftId: sellId,
          buynftnumber: multipleOwner?.buynftnumber ? Number(multipleOwner?.buynftnumber) + Number(buynftnumber) : buynftnumber,
          ownerId: id,
          remainingSupply: (Number(multipleOwner?.remainingSupply || 0) + Number(buynftnumber)) || Number(buynftnumber),
        }
      );

      const oldbuyermultipleUse = await updateDocument(
        "multipleUser",
        {
         // _id: multipleId,
          nftId: sellId,
          //ownerId: sellerId,
          //ownerId: id,
          //   userId: id,
        },
        {
          // //nftType: findNFT.nftType,
          // buynftnumber: multipleOwner?.buynftnumber ? multipleOwner?.buynftnumber+ buynftnumber : buynftnumber,
          // ownerId: id,
          //userId: id,
          username,
          sellnftnumber: Number(Seller.sellnftnumber) - Number(buynftnumber),
          remainingSupply: (Number(Seller?.remainingSupply || 0) - Number(buynftnumber)) || Number(buynftnumber),
        }
      );

      //console.log(newbuyer, "newbuyer...");

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
          buynftnumber: multipleOwner?.buynftnumber ? Number(multipleOwner?.buynftnumber) + Number(buynftnumber) : buynftnumber,
          ownerId: id,
          remainingSupply: Number(buynftnumber),
          username,
          //userId: id,
          // sellnftnumber: multipleOwner.sellnftnumber - buynftnumber,
          // remainingSupply: multipleOwner.remainingSupply + Number(buynftnumber),
        }
      );

      console.log(newbuyermultipleUser, "newbuyermultipleUser...");

      const oldbuyermultipleUse = await updateDocument(
        "multipleUser",
        {
          nftId: sellId,
          //ownerId: sellerId,
          //   userId: id,
        },
        {
          // //nftType: findNFT.nftType,
          // buynftnumber: multipleOwner?.buynftnumber ? multipleOwner?.buynftnumber+ buynftnumber : buynftnumber,
          // ownerId: id,
          //userId: id,
          username,
          sellnftnumber: Number(Seller?.sellnftnumber || 0) - Number(buynftnumber),
          remainingSupply: Number(Seller?.remainingSupply || 0) - Number(buynftnumber),
        }
      );

      //console.log(newbuyer, "newbuyer...");

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
module.exports = buyNft;


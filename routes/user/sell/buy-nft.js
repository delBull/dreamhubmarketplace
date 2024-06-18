const Joi = require("joi");

const {
  insertNewDocument,
  findOne,
  updateDocument,
} = require("../../../helpers");
const { multipleUser } = require("../../../models");

const schema = Joi.object({
  sellId: Joi.string().required(),
  id: Joi.string().required(),
  buynftnumber: Joi.number().required(),
  //  sellerId: Joi.string().required(),
  username: Joi.string().required(),
  multipleId: Joi.string(),
});

const buyNft = async (req, res) => {
  try {
    await schema.validateAsync(req.query);

    const {  selectedListing } = req.body;
   
    const {  id, buynftnumber, sellId, sellerId, username } = req.query;
console.log(sellId,"sellId");
    // console.log({ sellId, id, buynftnumber, sellerId, username });


// Buyer
    const findUser = await findOne("user", { _id: id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }


    // find NFT
    const findNFT = await findOne("nft", { _id: sellId });
    if (!findNFT) {
      return res.status(404).send({ status: 404, message: "No NFT Found" });
    }
console.log(findNFT,"");
    // Single Seller (multipleUser model) 
    const multipleOwner = await findOne("multipleUser", {
      nftId: sellId,
      //_id: selectedListing._id,
      ownerId: id,
    });

    const Seller = await findOne("multipleUser", { nftId: sellId });

    // console.log(multipleOwner, "multipleOwner");
    // console.log(Seller, "Seller");

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

    console.log(checkOnSell, "checkOnSell");

    const multipleUsercheckOnSell = await findOne("multipleUser", {
      //nftId: sellId,
      _id: selectedListing._id,
      nftType: { $in: ["sell", "bid"] },
    });

    if (!multipleUsercheckOnSell) {
      return res.status(404).send({
        status: 404,
        message: "This nft is not on sell on multipleUser",
      });
    }

    console.log(multipleUsercheckOnSell, "multipleUsercheckOnSell");

    //!=================================================================== ERC 721
    if (findNFT.contract === "ERC721") {
      if (selectedListing.nftType === "sell") {
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

            nftType: "mint",
            actualPrice: "",
            endDate: "",
            startDate: "",
            bidGap: "",
            listingid: "",
            minimumBid: "",

            remainingSupply: 1,
            sellnftnumber: 0,
            owner: findNFT.owner.filter((obj) => obj == id).length
              ? findNFT.owner
              : [id],

            // nftType: "mint",

            // remainingSupply: 1,
            // sellnftnumber: 0,
            // owner: findNFT.owner.filter((obj) => obj == id).length
            //   ? findNFT.owner
            //   : [id, ...findNFT.owner],
          }
        );

        console.log(nft, "nft");

        // if (multipleOwner) {
          const newbuyer = await updateDocument(
            "multipleUser",
            {
              nftId: sellId,
              //nftId: selectedListing.nftId,
              ownerId: selectedListing.ownerId,
              _id: selectedListing._id,
            },
            {
              // username,
              // nftType: "mint",
              // buynftnumber: 1,
              // ownerId: id,
              // remainingSupply: 1,
              // listingId: null,
              // price: null,
              // sellnftnumber: 0,
              username,
              nftType: "mint",
              endDate: null,
              startDate: null,
              ownerId: id,
              remainingSupply: 1,
              listingId: null,
              price: null,
              sellnftnumber: 0,
            }
          );

          console.log(newbuyer, "newbuyer...");

          const history = await insertNewDocument("history", {
            nft_id: sellId,
            action: "transfer",
            from: id,
            price: findNFT.actualPrice,
            to: req.userId,
          });
          return res.status(200).send({ status: 200, nft, newbuyer });
        // }
      }

      if (selectedListing.nftType === "bid") {
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

            nftType: "mint",
            actualPrice: "",
            endDate: "",
            startDate: "",
            bidGap: "",
            listingid: "",
            minimumBid: "",

            remainingSupply: 1,
            sellnftnumber: 0,
            owner: findNFT.owner.filter((obj) => obj == id).length
              ? findNFT.owner
              : [id],
          }
        );

        console.log(nft, "nft");

        if (multipleOwner) {
          const newbuyer = await updateDocument(
            "multipleUser",
            {
              nftId: sellId,
              //nftId: selectedListing.nftId,
              ownerId: selectedListing.ownerId,
            },
            {
              userwalletaddress: username,
              username,
              nftType: "mint",
              endDate: null,
              startDate: null,
              ownerId: id,
              remainingSupply: 1,
              listingId: null,
              price: null,
              sellnftnumber: 0,
            }
          );

          console.log(newbuyer, "newbuyer...");

          const history = await insertNewDocument("history", {
            nft_id: sellId,
            action: "transfer",
            from: id,
            price: findNFT.actualPrice,
            to: req.userId,
          });
          return res.status(200).send({ status: 200, nft, newbuyer });
        }
      }
    }
    //   const nft = await updateDocument(
    //     "nft",
    //     { _id: sellId },
    //     {
    //       ...req.body,
    //       events: {
    //         ...findNFT.events,
    //         ...req.body.events,
    //         _BuyMarketItem: [
    //           ...(findNFT?.events?._BuyMarketItem || []),
    //           ...([req.body?.events?._BuyMarketItem] || []),
    //         ],
    //       },

    //       nftType: "mint",

    //       remainingSupply: 1,
    //       sellnftnumber: 0,
    //       owner: findNFT.owner.filter((obj) => obj == id).length
    //         ? findNFT.owner
    //         : [id, ...findNFT.owner],
    //     }
    //   );

    //   console.log(nft, "nft");

    //   if (multipleOwner) {
    //     const newbuyer = await updateDocument(
    //       "multipleUser",
    //       {
    //         nftId: sellId,
    //         //nftId: selectedListing.nftId,
    //         ownerId: selectedListing.ownerId,
    //       },
    //       {
    //         username,
    //         nftType: "mint",
    //         buynftnumber: 1,
    //         ownerId: id,
    //         remainingSupply: 1,
    //         listingId: null,
    //         price: null,
    //         sellnftnumber: 0,
    //       }
    //     );

    //     console.log(newbuyer, "newbuyer...");

    //     const history = await insertNewDocument("history", {
    //       nft_id: sellId,
    //       action: "transfer",
    //       from: id,
    //       price: findNFT.actualPrice,
    //       to: req.userId,
    //     });
    //     return res.status(200).send({ status: 200, nft, newbuyer });
    //   }
    // }

    //!=================================================================== ERC 1155
    else if (findNFT.contract === "ERC1155") {



      const newBuyer = await findOne("multipleUser", {
        nftId: sellId,
        ownerId: id,
      });

      console.log(newBuyer,"hello");


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

          sellnftnumber: Number(findNFT.sellnftnumber) - Number(buynftnumber),
          owner: findNFT.owner.filter((obj) => obj == id).length
            ? findNFT.owner
            : [id, ...findNFT.owner],
        }
      );

      console.log(multipleOwner,"111");
      //   // ERC721 NFTS------------------------------------------------

     if (multipleOwner) {
// Updates buyer old data

        console.log("hey");
        const newbuyer = await multipleUser.updateMany(
          {
            nftId: sellId,
            ownerId: id,
          },
          {
            $set: {
              username,
              nftId: sellId,
              buynftnumber: multipleOwner?.buynftnumber
                ? Number(multipleOwner?.buynftnumber) + Number(buynftnumber)
                : buynftnumber,
              ownerId: id,
              remainingSupply: Number(
                multipleOwner?.remainingSupply
                  ? multipleOwner?.remainingSupply + Number(buynftnumber)
                  : Number(buynftnumber)
              ),
            },
          }
        );

        console.log(newbuyer, "newbuyer...");

        const oldbuyermultipleUse = await updateDocument(
          "multipleUser",
          {
            _id: selectedListing._id,
            nftId: selectedListing.nftId,
            ownerId: selectedListing.ownerId,
            listingId: selectedListing.listingId,
          },
          {
            username: selectedListing.username,
            sellnftnumber: Number(
              Number(selectedListing.sellnftnumber) - Number(buynftnumber)
            ),
          }
        );

        let oldseller = await multipleUser.updateMany(
          { nftId: selectedListing.nftId, ownerId: selectedListing.ownerId },
          {
            $set: {
              remainingSupply: Number(
                selectedListing?.remainingSupply
                  ? selectedListing?.remainingSupply - Number(buynftnumber)
                  : Number(buynftnumber)
              ),
            },
          }
        );

        console.log(oldseller, "oldseller");

        const history = await insertNewDocument("history", {
          nft_id: sellId,
          action: "transfer",
          from: id,
          price: findNFT.actualPrice,
          to: req.userId,
        });
        return res.status(200).send({ status: 200, nft, oldseller, newbuyer });
      }




      if (!multipleOwner) {
        
        const newbuyermultipleUser = await insertNewDocument("multipleUser", {
          totalSupply: Number(Seller?.totalSupply),
          nftId: sellId,
          buynftnumber: multipleOwner?.buynftnumber
            ? Number(multipleOwner?.buynftnumber) + Number(buynftnumber)
            : buynftnumber,
          ownerId: id,
          remainingSupply: Number(buynftnumber),
          username,
        });

        console.log(newbuyermultipleUser, "newbuyermultipleUser...");

        const oldbuyermultipleUse = await updateDocument(
          "multipleUser",
          {
            _id: selectedListing._id,
            nftId: selectedListing.nftId,
            ownerId: selectedListing.ownerId,
            listingId: selectedListing.listingId,
          },
          {
            // //nftType: findNFT.nftType,
            username: selectedListing.username,
            sellnftnumber: Number(
              Number(selectedListing.sellnftnumber) - Number(buynftnumber)
            ),
          }
        );

        console.log(oldbuyermultipleUse, "oldbuyermultipleUse22222...");

        let oldseller;

        console.log("yeh kamm kr rha hian");

        oldseller = await multipleUser.updateMany(
          { nftId: selectedListing.nftId, ownerId: selectedListing.ownerId },
          {
            $set: {
              remainingSupply: Number(
                selectedListing?.remainingSupply
                  ? selectedListing?.remainingSupply - Number(buynftnumber)
                  : Number(buynftnumber)
              ),
            },
          }
        );

        console.log(oldseller, "oldseller");

        const history = await insertNewDocument("history", {
          nft_id: sellId,
          action: "transfer",
          from: id,
          price: findNFT.actualPrice,
          to: req.userId,
        });

        return res.status(200).send({
          status: 200,
          nft,
          oldseller,
          newbuyermultipleUser,
          newbuyermultipleUser,
        });
      }
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = buyNft;

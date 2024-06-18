// const { default: Moralis } = require("moralis");
// const Joi = require("joi");
// const saveActivity = require("../../../middleware/activity/save-activity");

// const {
//   findOne,
//   updateDocument,
//   insertNewDocument,
//   getAggregate,
//   axiosGetCall,
// } = require("../../../helpers");

// const schemaQuery = Joi.object({
//   nft_tokenId: Joi.string().required(),
//   tokenAddress: Joi.string().required(),
//   chain: Joi.string(),
// });


// const schema1Body = Joi.object({
//   nftId: Joi.string(),
//   id: Joi.string().required(),
//   bidGap: Joi.string(),
//   actualPrice: Joi.string(),
//   minimumBid: Joi.string(),
//   startDate: Joi.number(),
//   endDate: Joi.number(),
//   listingid:Joi.string(),
//   contract:Joi.string(),
//   nftType: Joi.string().valid("mint", "sell", "auction", "bid").required(),
// });

// const sellMintNft = async (req, res) => {
//   try {
//     await schemaQuery.validateAsync(req.query);
//     await schema1Body.validateAsync(req.body);
//    const { id, nftType, actualPrice, listingid} = req.body;

//    console.log(req.body,"req.body...");

//     const { nft_tokenId, tokenAddress, chain } = req.query;
//     const singleNft = await findOne("nft", {
//       nft_tokenId,
//       tokenAddress: new RegExp(tokenAddress, "i"),
//     });
//     console.log(singleNft,"singleNft...");

//     if (!singleNft) {
//       // return res.status(404).send({ status: 404, message: "No NFT found" });
//       const response = await Moralis.EvmApi.nft.getNFTMetadata({
//         address: tokenAddress,
//         chain,
//         tokenId: nft_tokenId,
//       });
//       console.log(response,"response...");

//       const newData = response.toJSON();
//       console.log({ newData });
//       console.log(newData,"newData....");

//       const tokenUriData = await axiosGetCall(response.toJSON()?.token_uri);
//       console.log({ tokenUriData });
//       console.log(tokenUriData,"tokenUriData..." );

//       if (newData.metadata) {
//         req.body.title = newData?.metadata?.name;
//         req.body.description = newData?.metadata?.description;
//         req.body.nftImg = newData?.metadata?.image;
//       }
//       if (tokenUriData) {
//         req.body.title = tokenUriData?.name;
//         req.body.description = tokenUriData?.description;
//         req.body.nftImg = tokenUriData?.image;
//       }

//     //   const createNftInDb = await insertNewDocument("nft", {
//     //     nft_chain_id: chain,
//     //     nft_tokenId: newData?.token_id,
//     //     tokenAddress: newData?.token_address,
//     //     owner: req.userId,
//     //     royality: "0",
//     //     ...req.body,
//     //   });

//     //   console.log(createNftInDb,"createNftInDb...");
      
//       //req.body.nftId = createNftInDb?._id.toString();
//     }

    

//     // if (singleNft) {
//     //   req.body.nftId = singleNft._id;
//     //   // return res.status(200).send({status: 200, message:" Nft id get"});
//     // }

//     // console.log(singleNft,"singleNFT...");

//     const findUser = await findOne("user", { _id: id });
//     if (!findUser) {
//       return res
//         .status(404)
//         .send({ status: 404, message: "No user found with your given id" });
//     }

// console.log(findUser, "findUser...");

//     const findNFT = await findOne("nft", {
//         nftType: req.body.nftType,
//       //owner: id,
//     });

//     if (!findNFT) {
//       return res.status(404).send({ status: 404, message: "No NFT Found" });
//     }

//     console.log(findNFT, "findNFT...");

// //     const checkNftOnMint = await findOne("nft", {
// //       _id: req.body.nftId.toString(),
// //       owner: id,
// //       mintType: "mint",
// //     });

// //     if (!checkNftOnMint) {
// //       return res
// //         .status(404)
// //         .send({ status: 404, message: "This nft is already on sell" });
// //     }

// // console.log(checkNftOnMint,"checkNftOnMint...");

//     const sell = await updateDocument(
//       "nft",
//       { nft_tokenId: nft_tokenId },
//       {
//         ...req.body,
//         // events: {
//         //   ...findNFT.events,
//         //   ...req.body.events,
//         //   _BuyMarketItem: [
//         //     ...(findNFT?.events?._BuyMarketItem || []),
//         //     ...([req.body?.events?._BuyMarketItem] || []),
//         //   ],
//         // },
//         // nftType,
//         // actualPrice,
//         // listingid,
//         // contract,
//         // created_by: id,
//         // owner: id,
//       }
//     );

//     console.log(sell, "sell...");

//     const history = await insertNewDocument("history", {
//       nft_id: req.body.nftId,
//       action: nftType,
//       from: id,
//       price: req?.body?.actualPrice,
   
//     });

//     console.log(history,"history...");

//    saveActivity(req, res, `User ${history.from} sold this NFT ${sell._id} prize is ${sell.actualPrice} successfully `);
//     return res.status(200).send({ status: 200, sell });
//   } catch (e) {
//     return res.status(400).send({ status: 400, message: e.message });
//   }
// };
// module.exports = sellMintNft;

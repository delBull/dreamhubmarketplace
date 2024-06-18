// const { default: Moralis } = require("moralis");
// const { insertNewDocument, find, findOne } = require("../../../helpers");

// const CreateNftToDb = async (req, res) => {

// const {collection_address,chain,nft_tokenId} = req.query
// console.log(req.query);
//   try {
//     const nftCollection = await findOne("nftcollection", {
//       collection_address: collection_address,
//       chain: chain,
//       tokenId: nft_tokenId
//     });

//     if (!nftCollection) {
//       return res.status(400).send({ status: 400, message: "Oops no data found" });
//     }

   

//     //   const response = await Moralis.EvmApi.nft.getNFTMetadata({
//     //     address: collection_address,
//     //     chain: chain,
//     //   });

//      // console.log(response, "response");

// //      console.log(createCollecion, "createCollecion");

//     //   const newData = response.toJSON();
//     //   console.log({ newData });
//     //   const createNftInDb = await insertNewDocument("importCollection", {
//     //     title: newData?.metadata?.name,
//     //     description: newData?.metadata?.description,
//     //     nftImg: newData?.metadata?.image,
//     //     nft_chain_id: chain,
//     //     nft_tokenId: newData?.token_id,
//     //     tokenAddress: newData?.token_address,
//     //     owner: req.userId,
//     //     royality: "0",
//     //   });

//     //   console.log(createCollecion.collection_address);
//     //   console.log(createCollecion.chain);
   
//     return res.status(200).send({ status: 200, message: nftCollection });
//   } catch (e) {
//     console.log(e);
//     return res.status(400).send({ status: 400, message: e.message });
//   }
// };

// module.exports = CreateNftToDb;

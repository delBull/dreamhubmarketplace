// const { insertNewDocument } = require("../../../helpers");

// const Moralis = require("moralis").default;

// const createSingleUserCollection = async (req, res) => {
//   try {
//     const { address, chain } = req.query;
//     console.log(address, chain, "chain");
//     const response = await Moralis.EvmApi.nft.getContractNFTs({
//       address: address,
//       chain: chain,
//     });

//     if (!response) {
//       return res.json({
//         status: 500,
//         msg: [],
//       });
//     }
//     const data = response.result;

//      data.map(async (value) => {
//       console.log(value.metadata, "value");

//       return await insertNewDocument("importCollection", {
//         title: value?.metadata?.name,
//         description: value?.metadata?.description,
//         nftImg: value?.metadata?.image,
//         nft_chain_id: chain,
//         nft_tokenId: value?.token_id,
//         tokenAddress: value?.token_address,
//         owner: address,
//         royality: "0",
//       });

      
//     });
//    // console.log(createNftInDb, "createNftInDb");
    
//     return res.status(200).json({
//       status: 200,

//       msg: "Data insert successfully",
//     });
//     //console.log(data,"data");
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({
//       status: 500,
//       message: e.message,
//     });
//   }
// };

// module.exports = createSingleUserCollection;



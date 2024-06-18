const Joi = require("joi");
const { default: Moralis } = require("moralis");
const {
    findOne,
    insertNewDocument,
    getAggregate,
    axiosGetCall,
    updateDocument,
} = require("../../../helpers");


const schema = Joi.object({
   // nft_id: Joi.string(),
    bidder_id: Joi.string().required(),
    owner_id: Joi.string().required(),
    nftContractAddressToSwapWith: Joi.string().required(),
    nftContractAddress: Joi.string().required(),
    ownernft_id: Joi.string().required(),
    biddernft_id: Joi.string(),
   // winner: Joi.string(),
    chain: Joi.string().required(),
    makerAddress: Joi.string().required(),
    takerAddress: Joi.string().required(),
    tokenId: Joi.string().required(),
    tokenIdToSwapWith: Joi.string().required(),
    amount: Joi.string().required(),
    amountToSwapWith: Joi.string().required(),
    bidderWalletAddress:Joi.string(),
    ownerWalletAddress:Joi.string()
});

const placeABid = async (req, res) => {
    try {
        await schema.validateAsync(req.body);
        const { //nft_id, // bidder nft id
            bidder_id, // bidder user id
            owner_id, // owner user id
            nftContractAddressToSwapWith,  // bidder nft contract address
            nftContractAddress, // owner nft contract address
            ownernft_id, // owenr nft id
            biddernft_id, // owenr nft id
            //winner, // default
            chain,  // same both nft
            makerAddress, // owner wallet address
            takerAddress, // bidder wallet address
            tokenId, // owner nft token id
            tokenIdToSwapWith, // bidder nft token id
            amount, // total supply nft amount owner
            amountToSwapWith,  // total supply nft amount bidder
            bidderWalletAddress,
            ownerWalletAddress,
        } = req.body;


console.log(req.body,"req.body");

        const singleNft = await findOne("nft", {
           nft_tokenId: tokenIdToSwapWith,
            tokenAddress: new RegExp(nftContractAddressToSwapWith, "i"),
        });
        console.log(singleNft, "singleNft...");

        if (!singleNft) {
            // return res.status(404).send({ status: 404, message: "No NFT found" });
            const response = await Moralis.EvmApi.nft.getNFTMetadata({
                address: nftContractAddressToSwapWith,
                chain,
                tokenId: tokenIdToSwapWith,
                // tokenHash
            });
            console.log(response, "response...");

            const newData = response.toJSON();
            console.log({ newData });
            console.log(newData, "newData....");

            const tokenUriData = await axiosGetCall(response.toJSON()?.token_uri);
            console.log({ tokenUriData });
            console.log(tokenUriData, "tokenUriData...");

            if (newData.metadata) {
                req.body.title = newData?.metadata?.name;
                req.body.description = newData?.metadata?.description;
                req.body.nftImg = newData?.metadata?.image;
            }
            if (tokenUriData) {
                req.body.title = tokenUriData?.name;
                req.body.description = tokenUriData?.description;
                req.body.nftImg = tokenUriData?.image;
            }


            const updateNftInDb = await updateDocument("nft", {

                nft_tokenId: newData?.token_id,
                tokenAddress: newData?.token_address,
            }, {
                nft_chain_id: chain,
                nft_tokenId: newData?.token_id,
                tokenAddress: newData?.token_address,
                owner: req.userId,
                royality: "0",
                ...req.body,
            });

            console.log(updateNftInDb, "updateNftInDb...");

            req.body.nftId = updateNftInDb?._id.toString();


            const createNftInDb = await insertNewDocument("nft", {
                nft_chain_id: chain,
                nft_tokenId: newData?.token_id,
                tokenAddress: newData?.token_address,
                owner: req.userId,
                tokenHash: newData?.token_hash,
                royality: "0",
                ...req.body,
            });


            const createmultipleUser = await insertNewDocument("multipleUser", {
                // ...body,
                totalSupply: newData?.amount,
                remainingSupply: newData?.amount,
                ownerId: bidder_id,
                nftId: createNftInDb?._id,
                username: takerAddress.toLowerCase(),
              });
        
              console.log(createmultipleUser, "createmultipleUser");
        

            console.log( {
                nft_chain_id: chain,
                nft_tokenId: newData?.token_id,
                tokenAddress: newData?.token_address,
                owner: req.userId,
                tokenHash: newData?.token_hash,
                royality: "0",
                ...req.body},"hello rizwan");
            
            console.log(createNftInDb, "createNftInDb...");

            req.body.nftId = createNftInDb?._id.toString();
            req.body.biddernft_id.createNftInDb?._id

        }


        if (singleNft) {
            req.body.nftId = singleNft._id;
            req.body.biddernft_id = singleNft._id;
           
        }
      
          console.log(singleNft, "single");
      
            //check nft on database
            const check_nft = await findOne("nft", { _id: req.body.nftId  });

            
            if (!check_nft) {
                return res.status(404).send({ status: 404, message: "NFT not found" });
            }
            const check_bid_user = await findOne("user", { _id: bidder_id });
            if (!check_bid_user) {
                return res.status(404).send({ status: 404, message: "user not found" });
            }
            // if (check_bid_user.username !== takerAddress) {
            //     return res
            //         .status(400)
            //         .send({ status: 400, message: "wallet address mismatch" });
            // }



            const randomSwap = await updateDocument(
                "nft",
                { _id: req.body.nftId },
                {
                  // ...req.body,
                  // events: {
                  //   ...findNFT.events,
                  //   ...req.body.events,
                  //   _BuyMarketItem: [
                  //     ...(findNFT?.events?._BuyMarketItem || []),
                  //     ...([req.body?.events?._BuyMarketItem] || []),
                  //   ],
                  // },
               
                  nftType: "swapOffer",
                  swapnftnumber: amountToSwapWith,
        
                  // remainingSupply: Number(findNFT.totalSupply || 0) - Number(total_sellnftnumber || 0),
                  // remainingSupply: findNFT.totalSupply,
                  // created_by: id,
                  // owner: id,
                }
              );
        
              const multipleUser = await updateDocument(
                "multipleUser",
                {
                    nftId:  req.body.nftId,
                  nftType: "mint",
                },
                {
                  // ...req.body,
                  // username: userwalletaddress,
                  // userwalletaddress: userwalletaddress,
                  // totalSupply: findMultepleUser.totalSupply,
                  // remainingSupply: findMultepleUser.remainingSupply,
                
                  nftType: "swapOffer",
                  swapnftnumber: amountToSwapWith,
        
                  //remainingSupply: Number(req.body.sellnftnumber || 0) - Number(findMultepleUser.sellnftnumber || 0)
                }
              );
        
              console.log(multipleUser, "multipleUser...");
        


            const createBid = await insertNewDocument("swapbid", { ...req.body, nft_id:check_nft._id });
            const bid = await getAggregate("swapbid", [
                {
                    $match: { _id: createBid._id },
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

          //  req.io.emit(nft_id + "placeswapbid", { bid });
        


        return res
            .status(200)
            .send({ status: 200, createBid, message: " SwapBid placed successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).send({ status: 500, message: e.message });
    }
};

module.exports = placeABid;






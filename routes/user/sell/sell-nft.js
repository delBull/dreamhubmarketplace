const { default: Moralis } = require("moralis");
const Joi = require("joi");
const saveActivity = require("../../../middleware/activity/save-activity");

const {
  findOne,
  updateDocument,
  insertNewDocument,
  getAggregate,
  axiosGetCall,
  updateDocuments,
} = require("../../../helpers");

const schemaQuery = Joi.object({
  nft_tokenId: Joi.string().required(),
  tokenAddress: Joi.string().required(),
  //tokenHash: Joi.string().required(),
  chain: Joi.string(),
});

const schema1Body = Joi.object({
  userwalletaddress: Joi.string(),
  nftId: Joi.string(),
  id: Joi.string().required(),
  bidGap: Joi.string(),
  actualPrice: Joi.string(),
  minimumBid: Joi.string(),
  startDate: Joi.number(),
  endDate: Joi.number(),
  listingid: Joi.string(),
  contract: Joi.string(),
  sellnftnumber: Joi.number(),
  nftType: Joi.string()
    .valid("mint", "sell", "auction", "bid", "swap","randomSwap")
    .required(),
  swapnftnumber: Joi.number(),
});

const sellNFT = async (req, res) => {
  try {
    await schemaQuery.validateAsync(req.query);
    await schema1Body.validateAsync(req.body);
    const {
      id,
      nftType,
      actualPrice,
      listingid,
      contract,
      sellnftnumber,
      swapnftnumber,
      userwalletaddress,
    } = req.body;
    const { nft_tokenId, chain, tokenHash, tokenAddress } = req.query;
   
    var createNft;

    console.log(req.body, "req.body...");
    console.log(tokenAddress, nft_tokenId, "tokenAddress...");

    const singleNft = await findOne("nft", {
      nft_tokenId,
      tokenAddress: new RegExp(tokenAddress, "i"),
      nft_chain_id: chain,
    });
    console.log(singleNft, "singleNft...");

    if (!singleNft) {
      // return res.status(404).send({ status: 404, message: "No NFT found" });
      const response = await Moralis.EvmApi.nft.getNFTMetadata({
        address: tokenAddress,
        chain,
        tokenId: nft_tokenId,
        // tokenHash
      });
      console.log(response, "response...");

      const newData = response.toJSON();
      console.log({ newData });
      console.log(newData, "newData....");

      const userFind = await findOne("user", {
        username: newData.minter_address.toLowerCase(),
      });
      let userCreate
      if (!userFind) {
        userCreate = await insertNewDocument("user", {
          username: newData.minter_address,
          full_Name: "Unnamed",
          bio: "I just love NFTs and that's the reason I joined this cool Marketplace. Looking forward to engaging with all of you guys. Cheers!",
        });
      }

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

      const updateNftInDb = await updateDocument(
        "nft",
        {
          nft_tokenId: newData?.token_id,
          tokenAddress: newData?.token_address,
        },
        {
          nft_chain_id: chain,
          nft_tokenId: newData?.token_id,
          tokenAddress: newData?.token_address,
          owner: req.userId,
          royality: "0",
          ...req.body,
        }
      );

      console.log(updateNftInDb, "updateNftInDb...");

      req.body.nftId = updateNftInDb?._id.toString();

      var num = Math.random(10 ** 6).toString();
      var number = num.slice(2, 8);
    const  contractCollectionCreate = await insertNewDocument(
        "dhcontractcollection",
        {
      
          collection_name: `Untitled Collection #${number}`,
          discord: "",
          website: "",
          instagram: "",
          telegram: "",
          twitter: "",
          collection_address: newData?.token_address,
          wallet_address: req?.body?.userwalletaddress,
          description: "",
          chain:  chain,
          // contract_profile_img: req?.body?.contract_profile_img,
          // contract_banner_img: req?.body?.contract_banner_img,
          profile_img: "",
          banner_img: "",


        }
      );

      createNft = await insertNewDocument("nft", {
        nft_chain_id: chain,
        nft_tokenId: newData?.token_id,
        tokenAddress: newData?.token_address,
        owner: req.userId,
        tokenHash: newData?.token_hash,
        royality: "0",
        ...req.body,

        royality: "",
        size: "",
        abstraction: "",
        sellnftnumber: 0,
        contract: newData?.contract_type,
        totalSupply: newData?.amount,
        created_by: userFind._id || userCreate._id,

        collectionContractId:contractCollectionCreate._id,
        collectionContractAddress: newData?.token_address,
      });

      req.body.nftId = createNft._id;

      console.log(createNft, "createNft...");

      req.body.nftId = createNft?._id.toString();

      const createmultipleUser = await insertNewDocument("multipleUser", {
        // ...body,
        totalSupply: newData?.amount,
        remainingSupply: newData?.amount,
        ownerId: id,
        nftId: createNft?._id,
        username: userwalletaddress.toLowerCase(),
      });

      console.log(createmultipleUser, "createmultipleUser");


      const mintHistory = await insertNewDocument("history", {
        nft_id: createNft._id,
        action: "mint",
        from: id,
      });
  
    }

    if (singleNft) {
      req.body.nftId = singleNft._id;
      // return res.status(200).send({status: 200, message:" Nft id get"});
    }
    

    console.log(singleNft, "singleNFT...");

    const findUser = await findOne("user", { _id: id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }

    console.log(findUser, "findUser...");

    const findNFT = await findOne("nft", {
      _id: req.body.nftId.toString(),
      // owner: id,
    });

    if (!findNFT) {
      return res.status(404).send({ status: 404, message: "No NFT Found" });
    }

    console.log(findNFT, "findNFT...");

    const findMultepleUser = await findOne("multipleUser", {
      nftId: req.body.nftId.toString(),
      ownerId: id,
    });

    if (!findMultepleUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No NFT Found user" });
    }

    console.log(findMultepleUser, "findMultepleUser...");

    const checkNftOnMint = await findOne("nft", {
      _id: req.body.nftId.toString(),
      owner: id,
      mintType: "mint",
    });

    if (!checkNftOnMint) {
      return res
        .status(404)
        .send({ status: 404, message: "This nft is already on sell" });
    }

    console.log(checkNftOnMint, "checkNftOnMint...");

    const total_sellnftnumber =
      Number(sellnftnumber || 0) + Number(findNFT.sellnftnumber || 0);
    console.log(total_sellnftnumber, "total_sellnftnumber..");

    const total_swapnftnumber =
      Number(swapnftnumber || 0) + Number(findNFT.swapnftnumber || 0);
    console.log(total_swapnftnumber, "total_swapnftnumber..");

    //!============================================================= FOR SALE

    if (nftType === "sell") {
      const sell = await updateDocument(
        "nft",
        { _id: req.body.nftId },
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
          nftType,
          actualPrice,
          listingid,
          contract,
          sellnftnumber: total_sellnftnumber,
          swapnftnumber: total_swapnftnumber,
          // remainingSupply: Number(findNFT.totalSupply || 0) - Number(total_sellnftnumber || 0),
          remainingSupply: findNFT.totalSupply,
          // created_by: id,
          // owner: id,
        }
      );

      console.log(sell, "sell...");

      let multipleUser;
      console.log(req.body.contract, "req.body.contract");

      //!===================================================== ERC721 ky lye
      if (req.body.contract === "ERC721") {
        multipleUser = await updateDocument(
          "multipleUser",
          {
            _id: findMultepleUser._id,
            //nftType:"mint"
          },
          {
            ...req.body,
            username: userwalletaddress,
            userwalletaddress: userwalletaddress,
            nftType,
            price: actualPrice,
            listingId: listingid,
            totalSupply: findMultepleUser.totalSupply,
            sellnftnumber: 1,
            swapnftnumber: 1,
            //remainingSupply: Number(req.body.sellnftnumber || 0) - Number(findMultepleUser.sellnftnumber || 0)
            remainingSupply: findMultepleUser.remainingSupply,
          }
        );

        console.log(multipleUser, "multipleUser...");
        // }

        // return res.status(200).send({ status: 200, sell });

        // const multipleUsersellCreate = await insertNewDocument(
        //   "multipleUserSell",
        //   {
        //     swapnftnumber,
        //     ...req.body,
        //     username:tokenAddress,
        //     nftType,
        //     price: actualPrice,
        //     ownerId: id,
        //     totalSupply: findMultepleUser.totalSupply,
        //     listingId:listingid,
        //     sellnftnumber: Number(sellnftnumber || 0),
        //     //remainingSupply: Number(req.body.sellnftnumber || 0) - Number(findMultepleUser.sellnftnumber || 0)
        //     remainingSupply: findMultepleUser.totalSupply,
        //   }
        // );

        // console.log(multipleUsersellCreate, "multipleUsersellCreate...");
        if (!multipleUser) {
          const multipleUsersellCreate = await insertNewDocument(
            "multipleUser",
            {
              swapnftnumber,
              ...req.body,
              username: userwalletaddress,
              nftType,
              price: actualPrice,
              ownerId: id,
              totalSupply: findMultepleUser.totalSupply,
              listingId: listingid,
              sellnftnumber: Number(sellnftnumber || 0),
              //remainingSupply: Number(req.body.sellnftnumber || 0) - Number(findMultepleUser.sellnftnumber || 0)
              remainingSupply:
                findMultepleUser.remainingSupply ||
                findMultepleUser.totalSupply,
            }
          );

          console.log(multipleUsersellCreate, "multipleUsersellCreate...");
        }
        return res.status(200).send({ status: 200, sell });
      }

      //!===================================================== ERC1155 ky lye
      else if (req.body.contract === "ERC1155") {
        let multipleUsersUpd = await updateDocument(
          "multipleUser",
          {
            nftType: "mint",
            ownerId: req.body.id,
            nftId: req.body.nftId,
          },
          {
            ...req.body,
            // username:userwalletaddress,
            // userwalletaddress:userwalletaddress,
            nftType: req.body.nftType,
            price: req.body.actualPrice,
            listingId: req.body.listingid,
            //totalSupply: findMultepleUser.totalSupply,
            sellnftnumber: Number(sellnftnumber),
            // swapnftnumber: Number(findMultepleUser.swapnftnumber || 0) + Number(swapnftnumber || 0),
            //remainingSupply: Number(req.body.sellnftnumber || 0) - Number(findMultepleUser.sellnftnumber || 0)
            remainingSupply: findMultepleUser.remainingSupply,
          }
          // {
          // }
        );

        console.log(multipleUsersUpd, "multipleUsersUpd");

        if (!multipleUsersUpd) {
          let multipleUsers = await insertNewDocument(
            "multipleUser",
            {
              ...req.body,
              // username:userwalletaddress,
              // userwalletaddress:userwalletaddress,
              ownerId: req.body.id,
              username: req.body.userwalletaddress,
              userwalletaddress: req.body.userwalletaddress,
              nftType: req.body.nftType,
              price: req.body.actualPrice,
              listingId: req.body.listingid,
              //totalSupply: findMultepleUser.totalSupply,
              sellnftnumber: Number(sellnftnumber),
              // swapnftnumber: Number(findMultepleUser.swapnftnumber || 0) + Number(swapnftnumber || 0),
              //remainingSupply: Number(req.body.sellnftnumber || 0) - Number(findMultepleUser.sellnftnumber || 0)
              remainingSupply: findMultepleUser.remainingSupply,
            }
            // {
            // }
          );
          console.log(multipleUsers, "multipleUsers");
        }
        return res.status(200).send({ status: 200, sell });
      }
    }

    //!============================================================= FOR BID
    else if (nftType === "bid") {
      const sell = await updateDocument(
        "nft",
        { _id: req.body.nftId },
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
          nftType,
          actualPrice,
          listingid,
          contract,
          sellnftnumber: total_sellnftnumber,

          // remainingSupply: Number(findNFT.totalSupply || 0) - Number(total_sellnftnumber || 0),
          remainingSupply: findNFT.totalSupply,
          // created_by: id,
          // owner: id,
        }
      );

      const multipleUser = await updateDocument(
        "multipleUser",
        {
          _id: findMultepleUser._id,
          nftType: "mint",
        },
        {
          ...req.body,
          username: userwalletaddress,
          userwalletaddress: userwalletaddress,
          nftType: "bid",
          price: actualPrice,
          listingId: listingid,
          totalSupply: findMultepleUser.totalSupply,
          sellnftnumber: 1,

          //remainingSupply: Number(req.body.sellnftnumber || 0) - Number(findMultepleUser.sellnftnumber || 0)
          remainingSupply: findMultepleUser.remainingSupply,
        }
      );

      console.log(multipleUser, "multipleUser...");

      return res.status(200).send({ status: 200, sell, multipleUser });
    }

    //!============================================================= FOR AUCTION
    else if (nftType === "auction") {
      const sell = await updateDocument(
        "nft",
        { _id: req.body.nftId || createNft._id  },
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
          nftType,
          actualPrice,
          listingid: listingid,
          contract,
          sellnftnumber: "1",

          // remainingSupply: Number(findNFT.totalSupply || 0) - Number(total_sellnftnumber || 0),
          remainingSupply: "1",
          // created_by: id,
          // owner: id,
        }
      );

      const multipleUser = await updateDocument(
        "multipleUser",
        {
          _id: findMultepleUser._id,
          nftType: "mint" || "auction",
        },
        {
          ...req.body,
          username: userwalletaddress,
          userwalletaddress: userwalletaddress,
          nftType: "auction",
          price: actualPrice,
          listingId: listingid,
          totalSupply: findMultepleUser.totalSupply,
          sellnftnumber: 1,

          //remainingSupply: Number(req.body.sellnftnumber || 0) - Number(findMultepleUser.sellnftnumber || 0)
          remainingSupply: findMultepleUser.remainingSupply,
        }
      );

      console.log(multipleUser, "multipleUser...");

      return res.status(200).send({ status: 200, sell, multipleUser });
    }

    //!============================================================= FOR SWAP
    else if (nftType === "swap") {

      const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
      const randomString = Math.random().toString(36).substring(6, 10); // Generate a random string
      // const randomString = Math.random().toString(36); // Generate a random string
    
      const userID = timestamp + randomString;
    const listingidForSwap  = userID.toLocaleLowerCase().toString();


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
          listingid:listingidForSwap,
          nftType: "swap",
          swapnftnumber: swapnftnumber,

          // remainingSupply: Number(findNFT.totalSupply || 0) - Number(total_sellnftnumber || 0),
          // remainingSupply: findNFT.totalSupply,
          // created_by: id,
          // owner: id,
        }
      );

      const multipleUser = await updateDocument(
        "multipleUser",
        {
          _id: findMultepleUser._id,
          nftType: "mint",
        },
        {
          // ...req.body,
          // username: userwalletaddress,
          // userwalletaddress: userwalletaddress,
          // totalSupply: findMultepleUser.totalSupply,
          // remainingSupply: findMultepleUser.remainingSupply,
          listingId:listingidForSwap,
          nftType: "swap",
          swapnftnumber: swapnftnumber,

          //remainingSupply: Number(req.body.sellnftnumber || 0) - Number(findMultepleUser.sellnftnumber || 0)
        }
      );

      console.log(multipleUser, "multipleUser...");

      return res.status(200).send({ status: 200, randomSwap, multipleUser });
    }

     //!============================================================= FOR RANDOM SWAP
     else if (nftType === "randomSwap") {
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
          listingid,
          nftType: "randomSwap",
          swapnftnumber: swapnftnumber,

          // remainingSupply: Number(findNFT.totalSupply || 0) - Number(total_sellnftnumber || 0),
          // remainingSupply: findNFT.totalSupply,
          // created_by: id,
          // owner: id,
        }
      );

      const multipleUser = await updateDocument(
        "multipleUser",
        {
          _id: findMultepleUser._id,
          nftType: "mint",
        },
        {
          // ...req.body,
          // username: userwalletaddress,
          // userwalletaddress: userwalletaddress,
          // totalSupply: findMultepleUser.totalSupply,
          // remainingSupply: findMultepleUser.remainingSupply,
          listingId:listingid,
          nftType: "randomSwap",
          swapnftnumber: swapnftnumber,

          //remainingSupply: Number(req.body.sellnftnumber || 0) - Number(findMultepleUser.sellnftnumber || 0)
        }
      );

      console.log(multipleUser, "multipleUser...");

      return res.status(200).send({ status: 200, randomSwap, multipleUser });
    }
    
  

    //!============================================================= NFTTYPE NOT DEFINED
    else {
    }

    //  return res.status(200).send({ status: 200, sell });
  } catch (e) {
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = sellNFT;

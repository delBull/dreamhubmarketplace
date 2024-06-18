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
 // nftType: Joi.string().valid("mint", "sell", "auction", "bid", "swap", "randomSwap"),
  swapnftnumber: Joi.number(),
  swappedUserWalletAddress: Joi.string(),
  newTokenAddress: Joi.string(),
  newTokenId: Joi.string(),
});

const randomSwapApply = async (req, res) => {
  try {
    await schemaQuery.validateAsync(req.query);
    await schema1Body.validateAsync(req.body);
    const {
      id, // SWAPPER USER ID
      swappedUserWalletAddress, // FIRST USER NAME
      newTokenAddress, // SWAPPED TOKEN ADDRESS
      newTokenId, // SWAPPED TOKEN ID

      sellnftnumber,
      swapnftnumber,
      userwalletaddress,
    } = req.body;
    const { nft_tokenId, chain, tokenHash, tokenAddress } = req.query;
    console.log(req.body, "req.body");
    console.log(req.query, "req.body");

    //!===============================================================USER 1 DATA

    const singleNft_1 = await findOne("nft", {
      nft_tokenId: newTokenId,
      tokenAddress: newTokenAddress.toLowerCase(),
    });
    console.log(singleNft_1, "singleNft_1");

    if (!singleNft_1) {
      return res.status(404).send({ status: 404, message: "No NFT 1 found" });
    }

    const findUser_1 = await findOne("user", {
      username: swappedUserWalletAddress.toLowerCase(),
    });
    if (!findUser_1) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }
    console.log(findUser_1, "findUser_1");

    const findMultepleUser_1 = await findOne("multipleUser", {
      nftId: singleNft_1._id,
      ownerId: findUser_1._id,
    });

    if (!findMultepleUser_1) {
      return res
        .status(404)
        .send({ status: 404, message: "No NFT multiple Found" });
    }

    //!===============================================================USER 2 DATA
    var createNft;

    console.log(req.body, "req.body...");
    console.log(tokenAddress, nft_tokenId, "tokenAddress...");

    // SECOND USER NFT SWAPPER

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
      let userCreate;
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
          owner: id,
          royality: "0",
          ...req.body,
        }
      );

      console.log(updateNftInDb, "updateNftInDb...");

      req.body.nftId = updateNftInDb?._id.toString();

      var num = Math.random(10 ** 6).toString();
      var number = num.slice(2, 8);
      const contractCollectionCreate = await insertNewDocument(
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
          chain: chain,
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
        owner: id,
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

        collectionContractId: contractCollectionCreate._id,
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
      createNft=singleNft
      req.body.nftId = singleNft._id;
      // return res.status(200).send({status: 200, message:" Nft id get"});
    }

    console.log(singleNft, "singleNFT...");

    const findUser_2 = await findOne("user", { _id: id });
    if (!findUser_2) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }

    console.log(findUser_2, "findUser_2...");

    const findNFT = await findOne("nft", {
      _id: req.body.nftId.toString(),
      // owner: id,
    });

    if (!findNFT) {
      return res.status(404).send({ status: 404, message: "No NFT Found" });
    }

    console.log(findNFT, "findNFT...");
    console.log({
      nftId: req.body.nftId,
      ownerId: id,
    },'consollllllllllle')
    const findMultepleUser_2 = await findOne("multipleUser", {
      nftId: req.body.nftId,
      ownerId: id,
    });

    if (!findMultepleUser_2) {
      return res
        .status(404)
        .send({ status: 404, message: "No NFT Found user" });
    }

    console.log(findMultepleUser_2, "findMultepleUser_2...");

    const checkNftOnMint = await findOne("nft", {
      _id: req.body.nftId.toString(),
      owner: id,
      mintType: "mint",
    });

    if (!checkNftOnMint) {
      return res
        .status(404)
        .send({ status: 404, message: "This nft typ must be on mint" });
    }

    console.log(checkNftOnMint, "checkNftOnMint...");

    const total_sellnftnumber =
      Number(sellnftnumber || 0) + Number(findNFT.sellnftnumber || 0);
    console.log(total_sellnftnumber, "total_sellnftnumber..");

    const total_swapnftnumber =
      Number(swapnftnumber || 0) + Number(findNFT.swapnftnumber || 0);
    console.log(total_swapnftnumber, "total_swapnftnumber..");

    //!============================================================= FOR RANDOM SWAP APPLY
    //!==================== UPDATE USER 1 ASSETS

    const NFT_1 = await updateDocument(
      "nft",
      { _id: singleNft_1._id },
      {
        nftType: "mint",
        listingid: "",
        owner: findUser_2._id,

        nftType: "mint",
        swapnftnumber: 0,
      }
    );
    console.log(NFT_1, "NFT_1...");

    const multipleUser_1 = await updateDocument(
      "multipleUser",
      {
        _id: findMultepleUser_1._id,
        //nftType: "randomSwap",
      },
      {
        ownerId: findUser_2._id,
        nftType: "mint",
        swapnftnumber: 0,
        username: findUser_2.username,
        userwalletaddress: findUser_2.username,
      }
    );

    console.log(multipleUser_1, "multipleUser_1...");

    //!==================== UPDATE USER 2 ASSETS

    const NFT_2 = await updateDocument(
      "nft",
      { _id: findNFT._id },
      {
        nftType: "mint",
        listingid: "",
        owner: findUser_1._id,

        nftType: "mint",
        swapnftnumber: 0,
      }
    );
    console.log(NFT_2, "NFTNFT_2_1...");

    const multipleUser_2 = await updateDocument(
      "multipleUser",
      {
        _id: findMultepleUser_2._id,
        nftType: "mint",
      },
      {
        ownerId: findUser_1._id,
        nftType: "mint",
        swapnftnumber: 0,
        username: findUser_1.username,
        userwalletaddress: findUser_1.username,
      }
    );

    console.log(multipleUser_2, "multipleUser_2...");

    return res
      .status(200)
      .send({ status: 200, NFT_2, multipleUser_2, NFT_1, multipleUser_1 });

    //  return res.status(200).send({ status: 200, sell });
  } catch (e) {
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = randomSwapApply;

// const Joi = require("joi");
const { insertNewDocument, findOne } = require("../../../helpers");
const saveActivity = require("../../../middleware/activity/save-activity");

// const pinataSDK = require("@pinata/sdk");
// const { PINATA_API_KEY, PINATA_API_SECRET } = require("../../../config");
// const pinata = pinataSDK(PINATA_API_KEY, PINATA_API_SECRET);
// const fs = require("fs");
const cloudinary = require("cloudinary").v2;
// const schema = Joi.object({
// 	blockHash: Joi.string().required()
// });

// Remove all the unnecessary code from the nft object
const createNft = async (req, res) => {
  try {
    // await schema.validateAsync(req.body);
    const _id = req.params.id;
    const findUser = await findOne("user", { _id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }
    // if (!req.file) {
    //   return res
    //     .status(400)
    //     .send({ status: 400, message: "Image File missing" });
    // }
    // const nftImage = await cloudinary.uploader.upload(req.file.path);
    // req.body.nftImg = nftImage.url;
    // fs.unlinkSync(req.file.path);
    // const options = {
    //   pinataMetadata: {
    //     name: req?.file?.originalname,
    //   },
    //   pinataOptions: {
    //     cidVersion: 0,
    //   },
    // };
    // const pinataObj = await pinata.pinFileToIPFS(
    //   fs.createReadStream(req?.file?.path),
    //   options
    // );
    // const body = JSON.parse(req.body.body);

    console.log(req.body, "req....");
    console.log({
      // ...body,
      title: req?.body?.title,
      description: req?.body?.description,
      royality: req?.body?.royality,
      size: req?.body?.size,
      abstraction: req?.body?.abstraction,
      nft_chain_id: req?.body?.nft_chain_id,
      pinataImgUrl: req?.body?.pinataImgUrl,
      pinataMetaDataUrl: req?.body?.pinataMetaDataUrl,
      nft_tokenId: req?.body?.nft_tokenId,
      tokenAddress: req?.body?.tokenAddress,
      contract: req?.body?.contract,
      totalSupply: req?.body?.totalSupply,
      created_by: _id,
      owner: _id,
      ownerSupplies: [{
        user: _id,
        supplies: req?.body?.totalSupply   
      }],
      nftImg: req?.body?.nftImg,
      tokenHash: req?.body?.tokenHash,
      // nftImg: nftImage.url,
      // nftImg: req?.file?.filename,
      // nftImg: pinataObj?.IpfsHash,
    })
    const nft = await insertNewDocument("nft", {
      // ...body,
      title: req?.body?.title,
      description: req?.body?.description,
      royality: req?.body?.royality,
      size: req?.body?.size,
      abstraction: req?.body?.abstraction,
      nft_chain_id: req?.body?.nft_chain_id,
      pinataImgUrl: req?.body?.pinataImgUrl,
      pinataMetaDataUrl: req?.body?.pinataMetaDataUrl,
      nft_tokenId: req?.body?.nft_tokenId,
      tokenAddress: req?.body?.tokenAddress,
      contract: req?.body?.contract,
      totalSupply: req?.body?.totalSupply,
      created_by: _id,
      owner: _id,
      ownerSupplies: [{
        user: _id,
        supplies: req?.body?.totalSupply,
      }],
      nftImg: req?.body?.nftImg,
      tokenHash: req?.body?.tokenHash,
      // nftImg: nftImage.url,
      // nftImg: req?.file?.filename,
      // nftImg: pinataObj?.IpfsHash,
    });

    console.log(nft.nft_tokenId, "nft...");


    const multiperUser = await insertNewDocument("multipleUser", {
      // ...body,
      totalSupply: req?.body?.totalSupply,
      ownerId: _id,
      nftId: nft._id,
    });


    console.log(multiperUser, "multiperUser...");


    const mintHistory = await insertNewDocument("history", {
      nft_id: nft._id,
      action: "mint",
      from: req.userId,
    });


    console.log(mintHistory, "mintHistory...");

    // fs.unlinkSync(req.file.path);
    saveActivity(req, res, `User ${_id} Nft created successfully`);
    return res.status(200).send({ status: 200, nft, multiperUser });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = createNft;

// const Joi = require("joi");
// const { insertNewDocument, findOne } = require("../../../helpers");
// const { NFT_ABI, NFT_ADDRESS } = require("../../../lib");

// const schema = Joi.object({
// 	address: Joi.string().required()
// });

// const createNft = async (req, res) => {
// 	try {
// 		await schema.validateAsync(req.body);
// 		const { address } = req.body;
// 		const check_address = await req.web3.utils.isAddress(address);
// 		if (!check_address) {
// 			return res.status(400).send({
// 				status: 400,
// 				message: "Your provided address is not valid"
// 			});
// 		}
// 		const findUser = await findOne("user", { username: address });
// 		if (!findUser) {
// 			return res
// 				.status(404)
// 				.send({ status: 404, message: "No user found with your given address" });
// 		}
// 		const nft = await new req.web3.eth.Contract(NFT_ABI.abi, NFT_ADDRESS);
// 		console.log(nft);
// 		const data = await nft.methods.safeMint(address).send({ from: address });
// 		console.log(data);
// 		if (data) {
// 			const newNft = await insertNewDocument("nft", {
// 				...data,
// 				created_by: findUser._id
// 			});
// 			return res.status(200).send({ status: 200, newNft });
// 		} else {
// 			return res.status(400).send({ status: 400, message: "Error occurred while creating Nft" });
// 		}
// 	} catch (e) {
// 		console.log(e);
// 		return res.status(400).send({ status: 400, message: e.message });
// 	}
// };
// module.exports = createNft;

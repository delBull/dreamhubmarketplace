const { NFT_ABI, MP_ABI, NFT_ADDRESS, MP_ADDRESS } = require("../../../lib");

// my_script.js
// const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
// const { ChainId, ThirdwebProvider } = require("@thirdweb-dev/react");
const getNFTCollection = async (req, res) => {
  try {
    // // load your private key in a secure way (env variable, never commited to git)
    // const privateKey = process.env.PRIVATE_KEY;
    // // instantiate the SDK based on your private key, with the desired chain to connect to
    // const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "polygon");

    // // deploy contracts
    // const deployedAddress = sdk.deployer.deployNFTCollection({
    // 	name: "My NFT Collection",
    // 	primary_sale_recipient: "0x..."
    // });

    // // access your deployed contracts
    // const nftCollection = sdk.getNFTCollection(deployedAddress);

    // // Execute transactions on your contracts from the connected wallet
    // const walletAddress = "0x...";
    // await nftCollection.mintTo(walletAddress, {
    // 	name: "Cool NFT",
    // 	description: "Minted NFT from code!",
    // 	image: fs.readFileSync("path/to/image.png") // This can be an image url or file
    // });
    // const sdk = new ThirdwebSDK(ChainId.FantomTestnet);
    // const sdk = new ThirdwebSDK("fantom");
    // const sdk = ThirdwebSDK.fromPrivateKey(
    // 	"770c00919ed5b37fc47cf8fcd90da837f302ba8d7aa8ecd9a476133fd2d15788",
    // 	"fantom"
    // );

    // const contract = sdk.getNFTCollection(NFT_ADDRESS);
    // // const contract = sdk.getNFTCollection("0xD931d7bAA004A1DA25bc6E877E6f669cB8559219");
    // const nfts = await contract.getAll();
    // console.log(sdk);
    // console.log(nfts);
    // address: "0x75e3e9c92162e62000425c98769965a76c2e387a",
    // 			// token_address: "0x2953399124F0cBB46d2CbACD8A89cF0599974963"

    return res.status(200).send({ status: 200, nfts: "Abay tu pagal hai" });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getNFTCollection;

// // const Joi = require("joi");
// // const NFT_ABI = require("../../../lib/blockchain/NFT_COLLECTION_ABI.json");
// // const MP_ABI = require("../../../lib/blockchain/marketplace_abi.json");
// const Web3 = require("web3");
// const Joi = require("joi");
// // var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// // const schema = Joi.object({});
// // const getNFTCollection = async () => {
// // 	const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
// // 	console.log("runnnnn");
// // 	// const accounts = await web3.eth.requestAccounts();
// // 	// setAddress(accounts[0]);

// // 	const nft = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
// // 	const MP = new web3.eth.Contract(MP_ABI, MP_ADDRESS);

// // 	// const data = await nft.methods
// // 	//   .safeMint(accounts[0])
// // 	//   .send({ from: accounts[0] });

// // 	for (let i = 1; i <= 11; i++) {
// // 		const ownerOf = await nft.methods.ownerOf(i).call();
// // 		console.log(ownerOf, i);
// // 		// if (ownerOf === accounts[0]) {
// // 		// 	const uri = await nft.methods.tokenURI(i).call();
// // 		// 	console.log(uri);
// // 		// }
// // 	}
// // };
// const schema = Joi.object({
// 	// web3: Joi.object().required()
// 	chain: Joi.string().required(),
// 	address: Joi.string().required(),
// 	token_address: Joi.string().required()
// });

// // Molaris

// /* import moralis */
// const Moralis = require("moralis/node");
// const axios = require("axios");

// /* Moralis init code */
// const serverUrl = "https://isr45akr5zn2.usemoralis.com:2053/server";
// const appId = "QYT5Q6AO5D7L768Pi8uKF03JySvf1GnwrVRSnTtT";
// const masterKey = "ksVeRQeLQK6ClOevuVSrmlt51dvdxPCd6Xqchb8I";
// const getNFTCollection = async (req, res) => {
// 	try {
// 		await schema.validateAsync(req.body);
// 		const { chain, address, token_address } = req.body;
// 		// console.log("Get NFT Collection", req.web3);
// 		// const accounts = await req.web3.eth.requestAccounts();
// 		// var web3 = new Web3(Web3.givenProvider);
// 		// var web3 = new Web3(Web3.givenProvider);
// 		// var web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
// 		// req.web3.eth.handleRevert = true;
// 		// const nft = await new req.web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
// 		// const MP = await new req.web3.eth.Contract(MP_ABI, MP_ADDRESS);
// 		// console.log(nft);
// 		// console.log(MP);
// 		// const data = await nft.methods
// 		//   .safeMint(accounts[0])
// 		//   .send({ from: accounts[0] });
// 		// const ownerOf = await nft.methods.ownerOf(1).call();
// 		// console.log({ ownerOf });
// 		// console.log(nft);
// 		// let arr = [];
// 		// for (let i = 1; i <= 1000; i++) {
// 		// 	// console.log(await nft.methods);
// 		// 	// const ownerOf1 = await nft.methods.ownerOf("52").call();
// 		// 	const ownerOf1 = await nft.methods.ownerOf(i).call();
// 		// 	arr.push(ownerOf1);
// 		// 	console.log(i);
// 		// 	// console.log(ownerOf, i);
// 		// 	// i
// 		// }
// 		// console.log(MP.methods);
// 		// console.log(nft.methods);
// 		// console.log(await nft.methods.owner());
// 		// return res.status(200).send({ status: 200, arr });
// 		// Molaris
// 		await Moralis.start({ serverUrl, appId, masterKey });
// 		// axios
// 		// 	.get(
// 		// 		"https://isr45akr5zn2.usemoralis.com:2053/server/0xe9e7cea3dedca5984780bafc599bd69add087d56/nft"
// 		// 	)
// 		// 	.then((result) => {
// 		// 		console.log(result);
// 		// 	})
// 		// 	.catch((err) => {
// 		// 		console.log(err);
// 		// 	});
// 		// fetch(serverUrl + "/0xe9e7cea3dedca5984780bafc599bd69add087d56/nft")
// 		// 	.then((response) => response.json())
// 		// 	.then((data) => console.log(data));
// 		// const price = await Moralis.Web3API.token.getTokenPrice({
// 		// 	address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
// 		// 	chain: "bsc"
// 		// });
// 		// console.log(price);
// 		// get testnet NFTs for user
// 		// get polygon NFTs for address
// 		const options = {
// 			// chain: "fantom testnet",
// 			// address: "0x08674a2536F6b5A7Bdf8B7527CF6f41F818BaEF9",
// 			// token_address: NFT_ADDRESS
// 			// chain: "polygon",
// 			// address: "0x75e3e9c92162e62000425c98769965a76c2e387a",
// 			// token_address: "0x2953399124F0cBB46d2CbACD8A89cF0599974963"
// 			chain,
// 			address,
// 			token_address
// 		};
// 		// const option1 = {

// 		// 	chain: "polygon",
// 		// 	address: NFT_ADDRESS
// 		// };
// 		const polygonNFTs = await Moralis.Web3API.account.getNFTsForContract(options);
// 		console.log(polygonNFTs);
// 		// const polygonNFTs = await Moralis.Web3API.token.getAllTokenIds(options);

// 		return res.status(200).send({ status: 200, polygonNFTs });
// 	} catch (e) {
// 		console.log(e);
// 		return res.status(400).send({ status: 400, message: e.message });
// 	}
// };

// module.exports = getNFTCollection;

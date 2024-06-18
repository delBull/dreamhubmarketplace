const express = require("express");
const profile = require("./profile");
const follow = require("./follow");
const search = require("./search");
const web3 = require("./web3");
const nft = require("./nft");
const sell = require("./sell");
const blog = require("./blog");
const bid = require("./bid");
const history = require("./history");
const auction = require("./auction");
const subscribe = require("./subscribe");
const activity = require("./activity");
const { tokenVerification } = require("../../middleware/token-verification");
const pandoras = require("./pandoras");
const allowlist = require("./allowlist");
const getNfts = require("./getdata");
const launchpad = require("./launchpad");
const swap = require("./swap");
const userCollection = require("./userCollection");
const allUsers = require("./allUsers");
const swapoffers = require("./swapoffers");
const dhcontractCollection = require("./dhcontractcollection");
const removeListing = require("./removeListing");
const followers = require("./follow");


const router = express.Router();

router.use("/profile", profile);
// router.use("/follow",  follow);
router.use("/search", search);
router.use("/web3", web3);
router.use("/nft", nft);
router.use("/history", history);
router.use("/blog", blog);
router.use("/bid", bid);
router.use("/sell", sell);
router.use("/auction", auction);
router.use("/subscribe", subscribe);
router.use("/pandoras", pandoras);
router.use("/getdata", getNfts);
router.use("/allowlist", allowlist);
router.use("/", activity);
router.use("/apply", launchpad);
router.use("/swap", swap);
router.use("/userCollection", userCollection);
router.use("/allusers", allUsers);
router.use("/swapoffer", swapoffers);
router.use("/contractCollection", dhcontractCollection);
router.use("/removeData", removeListing);
router.use("/followers", followers);


module.exports = router;

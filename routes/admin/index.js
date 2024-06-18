const express = require("express");
const router = express.Router();

const user = require("./user");
const profile = require("./profile");
const nft = require("./nft");
const blog = require("./blog");
const roles = require("./roles");
const allowlist = require("./allowlist");
const  launchpad  = require("./launchpad");

router.use("/user", user);
router.use("/nft", nft);
router.use("/profile", profile);
router.use("/blog", blog);
router.use("/roles", roles);
router.use("/allowlist", allowlist);
router.use("/launchpad", launchpad);

module.exports = router;

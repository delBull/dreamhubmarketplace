const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.vacantswapid = require("./vacantswapid");
db.user = require("./user");
db.userType = require("./user-type");
//db.follow = require("./follow");
db.nft = require("./nft");
db.blog = require("./blog");
db.bid = require("./bid");
db.history = require("./history");
db.auction = require("./auction");
db.attempt = require("./attempts");
db.nftMetaData = require("./nft-metadata");
db.activity = require("./activity");
db.subscribe = require("./subscribe");
db.pandoras = require("./pandoras");
db.UserOTPVerification = require("./otpVerification");
db.allowlist = require("./allowlist");
db.pandorasAllowlist = require("./pandorasAllowlist");
db.launchPad = require("./launchPad");
db.multipleUser = require("./multipleUser");
db.multipleUserSell = require("./multipleUserSell");
db.nftcollection = require("./nftCollection");
db.swapbid = require("./swapbid");
db.importCollection = require("./importCollection");
db.dhcontractcollection = require("./dhcontractCollection");
db.launchpadMetaData = require("./launchpad-metadata");
db.followers = require("./followers");

module.exports = db;

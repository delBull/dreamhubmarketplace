const expres = require("express");
const launch = require("./create-launchpad");

const router = expres.Router();
const multipart = require("connect-multiparty");
const getContractNFTs = require("./getCollectionApp");

const launchApprovedData = require("./getdata");
const searchLaunchPad = require("./launchSearch");
const approvedLaunchpad = require("./update");
const launchApprovedSingleData = require("./getSinlfeData");
const getAllLaunchData = require("./getAllLaunchData");

const getSingleLauchpad = require("./singlelaunchpad");
const selectedTimeData = require("./liveData");
const randomlivedata = require("./randomlivedata");
const filterData = require("./filterData");
const multipartMiddleware = multipart();





router.post("/",  multipartMiddleware, launch);
router.get("/get-collection-nft",   getContractNFTs);

//router.get("/search", searchLaunchPad );
router.get("/approveddata",  launchApprovedData);
router.get("/getlaunch",  launchApprovedSingleData);


router.get("/getalllaunchpad",  getAllLaunchData);
router.get("/getsinglelaunchpad/:id",  getSingleLauchpad);
router.get("/filterdata",  filterData);

router.post("/getlivedata",  selectedTimeData);
router.post("/randomlivedata",  randomlivedata);


router.put("/deploylaunchpad",  approvedLaunchpad);


module.exports = router;

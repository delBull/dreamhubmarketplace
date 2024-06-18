const express = require("express");
const addLaunch = require("./add-launch");
const getLaunch = require('./get-launchPad');
const approvedLaunchpad = require("./update");
const router = express.Router();

router.put("/create/:id",addLaunch);
router.get("/getlaunch",  getLaunch);
// router.put("/approvedstatus",  approvedLaunchpad);
router.put("/approvedstatus",  approvedLaunchpad);
module.exports = router;

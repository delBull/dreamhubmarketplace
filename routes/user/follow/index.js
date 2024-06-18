const express = require("express");
// const acceptRequest = require("./accept-request");
// const cancelRequest = require("./cancel-request");
// const cancelSendRequest = require("./cancel-send-request");
// const follow = require("./follow");
 const follow = require("./followUser");

//const getFollowers = require("./get-followers");
const getFollowers = require("./checkFollow");

// const getFollowing = require("./get-following");
// const getRequests = require("./get-requests");
// const getSendRequest = require("./get-send-request");
const router = express.Router();

// router.post("/user/:id", follow);
 router.post("/user", follow);

// router.get("/get-followers", getFollowers);
 router.get("/get-followers", getFollowers);

// router.get("/get-following", getFollowing);
// router.get("/get-send-request", getSendRequest);
// router.get("/get-requests", getRequests);
// router.put("/accept-request/:id", acceptRequest);
// router.delete("/cancel-send-request", cancelSendRequest);
// router.delete("/cancel-request", cancelRequest);


module.exports = router;

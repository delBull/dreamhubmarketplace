const express = require("express");
const allUsers = require("./allUsers");

const router = express.Router();

router.get("/all-Users", allUsers);

module.exports = router;

const express = require("express");
const searchUser = require("./search-user");

const router = express.Router();

router.get("/users", searchUser);

module.exports = router;

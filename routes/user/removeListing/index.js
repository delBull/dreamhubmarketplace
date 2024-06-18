const express = require("express");
const removeData = require("./remove");

const router = express.Router();


router.put('/removelisting', removeData);

module.exports = router;

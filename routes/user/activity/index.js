const express = require("express");
const  getActivity   = require("./get-activity");
const router = express.Router();

router.get("/:id", getActivity);

module.exports = router;
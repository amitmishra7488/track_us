const express = require("express");
const auth = require("../middlewares/auth");
const bnbSpotPrice = require("../controller/market.controller");

const router = express.Router();


router.get('/', auth , bnbSpotPrice);

module.exports = router;
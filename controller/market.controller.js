const express = require("express");
const routes = express.Router();
const axios = require("axios");

const bnbSpotPrice = async (req, res) => {
  try {
    const { symbol } = req.query;
    const data = await axios.get(
      `https://api.binance.com/api/v1/ticker/price?symbol=${symbol}USDT`
    );
    const response = {
      symbol: data.data.symbol,
      $dollar: data.data.price,
      inr: data.data.price * 84,
    };
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = bnbSpotPrice;

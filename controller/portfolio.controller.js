const PortfolioModel = require("../models/portfolio.models");

const addPortfolioEntry = async (req, res) => {
  try {
    const { name,category, investedAmount, investmentDate, lastUpdatedAmount } =
      req.body;
    const user = req.userId;
    if (!category || !investedAmount) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }
    const newPortfolioEntry = new PortfolioModel({
      user,
      name,
      category,
      investedAmount,
      lastUpdatedAmount: lastUpdatedAmount || investedAmount,
      investmentDate: investmentDate || Date.now(),
      lastUpdatedDate: Date.now(),
    });
    const savedPortfolioEntry = await newPortfolioEntry.save();
    res.status(201).json({portfolio : savedPortfolioEntry});
  } catch (error) {
    console.error("Error adding portfolio entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePortfolioEntry = async (req, res) => {
  try {
    const {
      category,
      investedAmount,
      investmentDate,
      symbol,
      lastUpdatedAmount,
    } = req.body;
    const user = req.userId; // Use req.userId as the user

    // Check if the portfolio entry exists
    const portfolioEntry = await PortfolioModel.findById(req.params.id);

    if (!portfolioEntry) {
      return res.status(404).json({ error: "Portfolio entry not found." });
    }

    // Update the portfolio entry with the provided fields (if provided)
    if (category) {
      portfolioEntry.category = category;
    }

    if (investedAmount) {
      portfolioEntry.investedAmount = investedAmount;
    }
    if (investedAmount || lastUpdatedAmount) {
      portfolioEntry.lastUpdatedAmount = lastUpdatedAmount || investedAmount;
    }

    if (investmentDate) {
      portfolioEntry.investmentDate = investmentDate;
    }

    if (symbol) {
      portfolioEntry.symbol = symbol;
    }

    portfolioEntry.lastUpdatedDate = Date.now();
    const updatedPortfolioEntry = await portfolioEntry.save();
    res.status(200).json(updatedPortfolioEntry);
  } catch (error) {
    console.error("Error updating portfolio entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePortfolioEntry = async (req, res) => {
  try {
    // Check if the portfolio entry exists
    const portfolioId = req.params.id;
    const portfolioEntry = await PortfolioModel.findByIdAndDelete(portfolioId);

    if (!portfolioEntry) {
      return res.status(404).json({ error: "Portfolio entry not found." });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting portfolio entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPortfolioEntry = async (req, res) => {
  try {
    const userId = req.userId;

    const portfolio = await PortfolioModel.find({ user: userId });

    if (!portfolio) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.status(200).json({ portfolio: portfolio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getSinglePortfolioEntry = async (req, res) => {
  try {
    const portfolioId = req.params.portfolioId;
    console.log(portfolioId);
    const portfolio = await PortfolioModel.findById(portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }
    res.status(200).json({ portfolio: portfolio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addPortfolioEntry,
  updatePortfolioEntry,
  deletePortfolioEntry,
  getPortfolioEntry,
  getSinglePortfolioEntry
};

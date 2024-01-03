const express = require("express");
const { register, login, getUser } = require("../controller/user.controller");
const { additionalDetails } = require("../controller/userAdditionalDetails");
const {
  addGoal,
  updateGoal,
  deleteGoal,
  getGoal,
  getAllGoals,
} = require("../controller/goal.controller");
const auth = require("../middlewares/auth");
const {
  addPortfolioEntry,
  updatePortfolioEntry,
  deletePortfolioEntry,
  getPortfolioEntry,
} = require("../controller/portfolio.controller");
const {
  addExpenseEntry,
  deleteExpenseEntry,
  updateExpenseEntry,
  getExpenseEntry,
} = require("../controller/expense.controller");
const router = express.Router();

// User Credential request
router.post("/register", register);
router.post("/login", login);
router.get('/users', getUser);
router.post("/additionalDetails/:userId", additionalDetails);

// User Goals request
router.post("/goals", auth, addGoal);
router.patch("/goals/:goalId", auth, updateGoal);
router.delete("/goals/:goalId", auth, deleteGoal);
router.get('/goals/:goalId' , auth , getGoal);
router.get('/goals', auth , getAllGoals);

//User Portfolio request
router.post("/portfolio", auth, addPortfolioEntry);
router.patch("/portfolio/:id", auth, updatePortfolioEntry);
router.delete("/portfolio/:id", auth, deletePortfolioEntry);
router.get("/portfolio", auth, getPortfolioEntry);

//User Expenditure request
router.post("/expense", auth, addExpenseEntry);
router.patch("/expense/:id", auth, updateExpenseEntry);
router.delete("/expense/:id", auth, deleteExpenseEntry);
router.get("/expense", auth, getExpenseEntry);

module.exports = router;

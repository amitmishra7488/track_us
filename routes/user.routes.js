const express = require("express");
const { register, login, getUser, generateOTP, generateForgotPasswordOTP, updatePassword, verifyOTP } = require("../controller/user.controller");
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
  getSinglePortfolioEntry,
} = require("../controller/portfolio.controller");
const {
  addExpenseEntry,
  deleteExpenseEntry,
  updateExpenseEntry,
  getExpenseEntry,
  getExpenseReport,
} = require("../controller/expense.controller");
const router = express.Router();

// User Credential request
router.post('/generate-otp', generateOTP);
router.post("/register", register);
router.post("/login", login);
router.post("/generate-otp-password", generateForgotPasswordOTP);
router.post("/verify-otp-password", verifyOTP);
router.put("/reset-password", updatePassword);
router.get('/users',auth, getUser);
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
router.get("/portfolio/:portfolioId", auth, getSinglePortfolioEntry);

//User Expenditure request
router.post("/expense", auth, addExpenseEntry);
router.patch("/expense/:id", auth, updateExpenseEntry);
router.delete("/expense/:id", auth, deleteExpenseEntry);
router.get("/expense", auth, getExpenseEntry);
router.get("/expenseReport", auth, getExpenseReport);
module.exports = router;

const expenditureModel = require("../models/expenditure.models");

const addExpenseEntry = async (req, res) => {
  try {
    const user = req.userId;
    const { category, amount, description } = req.body;
    console.log("executing")
    console.log(category, amount, description);
    if (!category || !amount || !description) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }
    
    const newExpenseEntry = new expenditureModel({
      user,
      amount,
      category,
      description,
      date: req.body.date || Date.now(),
    });
    const savedExpense = await newExpenseEntry.save();
    console.log(savedExpense);
    res
      .status(201)
      .json({ message: "Expense saved successfully", expense: savedExpense });
  } catch (error) {
    console.error("Error adding expense entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateExpenseEntry = async (req, res) => {
  try {
    const { category, amount, description,date, status } = req.body;


    // Check if the expenditure entry exists
    const expenditureEntry = await expenditureModel.findById(req.params.id);

    if (!expenditureEntry) {
      return res.status(404).json({ error: "Expenditure entry not found." });
    }

    if (category) {
      expenditureEntry.category = category;
    }

    if (amount) {
      expenditureEntry.amount = amount;
    }
    if(date){
      expenditureEntry.date = date;
    }

    if (description) {
      expenditureEntry.description = description;
    }


    if (status) {
      expenditureEntry.status = status;
    }

    const updatedExpenditureEntry = await expenditureEntry.save();
    console.log(updatedExpenditureEntry);
    res.status(200).json(updatedExpenditureEntry);
  } catch (error) {
    console.error("Error updating expenditure entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const deleteExpenseEntry = async (req, res) => {
  try {
    const expenditureEntry = await expenditureModel.findById(req.params.id);
    if (!expenditureEntry) {
      return res.status(404).json({ error: "Expenditure entry not found." });
    }

    if (expenditureEntry.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized. You do not have permission to delete this expenditure entry." });
    }

    const deletedExpenseEntry = await expenditureModel.findByIdAndDelete(req.params.id)
    res.status(200).send(deletedExpenseEntry); 
  } catch (error) {
    console.error("Error deleting expenditure entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getExpenseEntry = async (req, res) => {
  try {
    const userId = req.userId;

    const expenses = await expenditureModel.find({ user: userId });

    if (!expenses) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.status(200).json({ expense: expenses});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getExpenseReport = async (req, res) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;
    const allExpenses = await expenditureModel.find({
      user: userId
    });

    let basedOnMonthExpenses = [];
    let lastSevenDaysExpenses = [];
    let todayExpenses = [];if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);basedOnMonthExpenses = allExpenses.filter(
        (expense) =>
          expense.date >= startDate && expense.date <= endDate
      );
    }
    const endOfToday = new Date(); 
    const startOfToday = new Date(endOfToday);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfLastSevenDays = new Date(startOfToday);
    startOfLastSevenDays.setDate(startOfLastSevenDays.getDate() - 7);
    lastSevenDaysExpenses = allExpenses.filter(
      (expense) => expense.date >= startOfLastSevenDays && expense.date <= endOfToday
    );

    todayExpenses = allExpenses.filter(
      (expense) => expense.date.toDateString() === endOfToday.toDateString()
    );

    const calculateTotal = (expenses) => expenses.reduce((total, expense) => total + expense.amount, 0);

    const expenseData = {
      basedOnMonth: {
        expenses: basedOnMonthExpenses,
        total: calculateTotal(basedOnMonthExpenses),
      },
      lastSevenDays: {
        expenses: lastSevenDaysExpenses,
        total: calculateTotal(lastSevenDaysExpenses),
      },
      today: {
        expenses: todayExpenses,
        total: calculateTotal(todayExpenses),
      },
    };

    console.log(expenseData);

    res.status(200).json(expenseData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  addExpenseEntry,
  updateExpenseEntry,
  deleteExpenseEntry,
  getExpenseEntry,
  getExpenseReport
};


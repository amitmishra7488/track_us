const { expenseReport, searchExpenditure } = require("../lib/calculateExpenses");
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
      return res.status(404).json({ error: 'Expenses not found' });
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
    let basedOnMonthExpenses = [];
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      const result =  await expenseReport(startDate,endDate,userId);
      basedOnMonthExpenses = result;
    }

    const expenseData = {
      basedOnMonth: {
        expenses: basedOnMonthExpenses.groupedDocuments[0].documents,
        total: basedOnMonthExpenses?.requiredMonth[0]?.totalValue || 0,
      },
      lastSevenDays: {
        total: basedOnMonthExpenses.lastSevenDays[0]?.totalValueSevenDays || 0,
      },
      today: {
        total: basedOnMonthExpenses.today[0]?.totalValueToday || 0,
      },
    };

    console.log(expenseData);

    res.status(200).json(expenseData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Backend controller for handling search requests
const searchExpenditureReports = async (req, res) => {
  try {
      const { month, year, searchQuery } = req.query;
      const userId = req.userId;
      let searchData 
      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        searchData =  await searchExpenditure(startDate,endDate,userId,searchQuery);
      }

      // Send search results back to the client
      res.status(200).json(searchData);

  } catch (error) {
      console.error("Error occurred during search:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  addExpenseEntry,
  updateExpenseEntry,
  deleteExpenseEntry,
  getExpenseEntry,
  getExpenseReport,
  searchExpenditureReports
};

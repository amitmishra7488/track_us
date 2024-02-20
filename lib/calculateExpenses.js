const expenditureModel = require("../models/expenditure.models");
const UserModel = require("../models/user.models");

const expenseReport = async (startDate, endDate, userId) => {
  const user = await UserModel.findById(userId);
  const endOfToday = new Date();
  const startOfToday = new Date(endOfToday);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfLastSevenDays = new Date(startOfToday);
  startOfLastSevenDays.setDate(startOfLastSevenDays.getDate() - 7);
  try {
    const report = await expenditureModel.aggregate([
      {
        $facet: {
          // First $facet pipeline to group the documents
          groupedDocuments: [
            {
              $match: {
                $and: [
                  { date: { $gte: startDate, $lte: endDate } },
                  { user: user._id },
                ],
              },
            },
            {
              $group: {
                _id: null,
                documents: { $push: "$$ROOT" },
              },
            },
          ],
          // Second $facet pipeline to perform calculations on the grouped documents
          requiredMonth: [
            {
              $match: {
                $and: [
                  { date: { $gte: startDate, $lte: endDate } },
                  { user: user._id },
                ],
              },
            },
            {
              $group: {
                _id: user._id,
                totalValue: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
          ],

          lastSevenDays: [
            {
              $match: {
                $and: [
                  { date: { $gte: startOfLastSevenDays, $lte: startOfToday } },
                  { user: user._id },
                ],
              },
            },
            {
              $group: {
                _id: user._id,
                totalValueSevenDays: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
          ],

          today: [
            {
              $match: {
                $and: [
                  { date: { $gte: startOfToday, $lte: endOfToday } },
                  { user: user._id },
                ],
              },
            },
            {
              $group: {
                _id: user._id,
                totalValueToday: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    if (report[0]) {
      return ({ groupedDocuments, requiredMonth, lastSevenDays, today } =
        report[0]);
    }
    return [];
  } catch (error) {
    console.log(error);
  }
};

const searchExpenditure = async (startDate, endDate, userId, searchQuery) => {
  try {

    const user = await UserModel.findById(userId);
    const searchResults = await expenditureModel.find({
      user: user._id,
      date: { $gte: startDate, $lte: endDate },
      $or:[
        {description: { $regex: searchQuery, $options: "i" }},
        {category: { $regex: searchQuery, $options: "i" }}
      ]
    });
    console.log(searchResults);
    return searchResults;
    
  } catch (error) {
    console.error("Error occurred during search:", error);
    throw new Error("Internal server error");
  }
};

module.exports = {
  expenseReport,
  searchExpenditure,
};

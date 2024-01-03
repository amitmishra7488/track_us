const goalModel = require("../models/goal.models");

const addGoal = async(req, res) => {
    try {
        const userId = req.userId;
        const newGoal = await goalModel.create({ ...req.body, user: userId });
        res.status(201).json({ goal: newGoal});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
};

const updateGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId; 
    const updatedData = req.body;

    // Find the goal by ID and update it with the new data
    const updatedGoal = await goalModel.findByIdAndUpdate(goalId, { $set: updatedData }, { new: true });
    if (!updatedGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    console.log(updatedGoal);
    res.status(200).json({goal: updatedGoal});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId;
    // Find the goal by ID and delete it
    const deletedGoal = await goalModel.findByIdAndDelete(goalId);

    if (!deletedGoal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.status(204).end(); // 204 No Content response for a successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getGoal = async (req, res) => {
  try {
    const goalId = req.params.goalId;
    const goals = await goalModel.findById(goalId);
    if (!goals) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.status(200).json({ goal: goals});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllGoals = async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await goalModel.find({ user : userId });
    if (!goals) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.status(200).json({ goal: goals});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    addGoal,
    updateGoal,
    deleteGoal,
    getGoal,
    getAllGoals
}
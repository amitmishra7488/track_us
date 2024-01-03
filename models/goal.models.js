const mongoose = require("mongoose");

const validCategories = ["fitness", "study", "productive", "finance", "family", "others"];
const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: validCategories,
    },
    deadline: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    reminders: [
      {
        date: Date,
        method: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const goalModel = mongoose.model("Goals", goalSchema);

module.exports = goalModel;

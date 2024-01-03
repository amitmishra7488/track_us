const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["stock", "crypto", "bank", "other"],
      required: true,
    },
    name:{
      type:String,
    },
    investedAmount: {
      type: Number,
      required: true,
    },
    symbol:{
        type: String,
        default: "inr",
        required: true,
    },
    lastUpdatedAmount: {
      type: Number,
      default: function () {
        return this.investedAmount;
      }
    },
    investmentDate: {
      type: Date,
      default: Date.now,
    },
    lastUpdatedDate:{
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

const PortfolioModel = mongoose.model("Portfolio", portfolioSchema);

module.exports = PortfolioModel;

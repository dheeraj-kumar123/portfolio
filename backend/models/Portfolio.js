const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    title: String,
    skills: [String],
    projects: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);

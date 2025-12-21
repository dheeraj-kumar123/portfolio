const Portfolio = require("../models/Portfolio");

// CREATE PORTFOLIO
exports.createPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.create({
      user: req.user,
      title: req.body.title,
      skills: req.body.skills.split(","),
      projects: req.body.projects
    });

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Portfolio creation failed" });
  }
};

// GET USER PORTFOLIO
exports.getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch portfolio" });
  }
};

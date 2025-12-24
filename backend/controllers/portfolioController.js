const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

// CREATE OR UPDATE PORTFOLIO (Save)
exports.createPortfolio = async (req, res) => {
  try {
    const {
      username,
      personalInfo,
      skills,
      projects,
      education,
      experience,
      contact,
      theme,
      published
    } = req.body;

    // Use upsert: find by user ID, update if exists, create if not
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user },
      {
        user: req.user,
        username,
        personalInfo,
        skills,
        projects,
        education,
        experience,
        contact,
        theme,
        published
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(portfolio);
  } catch (error) {
    console.error("Save Portfolio Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Username already taken" });
    }
    res.status(500).json({ error: "Portfolio save failed", details: error.message });
  }
};

// GET USER PORTFOLIO
exports.getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
};

// DELETE PORTFOLIO
exports.deletePortfolio = async (req, res) => {
  try {
    await Portfolio.findOneAndDelete({ user: req.user });
    res.json({ message: "Portfolio deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete portfolio" });
  }
};

// UPLOAD IMAGE (Placeholder)
exports.uploadImage = async (req, res) => {
  try {
    // In a real app, handle file upload here (e.g., multer + Cloudinary)
    res.json({ imageUrl: "https://via.placeholder.com/150" });
  } catch (error) {
    res.status(500).json({ error: "Image upload failed" });
  }
};

// GET PUBLIC PORTFOLIO
exports.getPublicPortfolio = async (req, res) => {
  try {
    const { username } = req.params;
    const portfolio = await Portfolio.findOne({ username, published: true });

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found or not published" });
    }

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch public portfolio" });
  }
};

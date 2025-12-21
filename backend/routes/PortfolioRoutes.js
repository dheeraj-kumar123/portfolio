const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createPortfolio,
  getMyPortfolio
} = require("../controllers/portfolioController");

router.post("/", auth, createPortfolio);
router.get("/", auth, getMyPortfolio);

module.exports = router;

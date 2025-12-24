const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createPortfolio,
  getMyPortfolio,
  deletePortfolio,
  uploadImage,
  getPublicPortfolio
} = require("../controllers/portfolioController");

router.post("/", auth, createPortfolio);
router.get("/", auth, getMyPortfolio);
router.delete("/", auth, deletePortfolio);
router.post("/upload", auth, uploadImage);
router.get("/public/:username", getPublicPortfolio);

module.exports = router;

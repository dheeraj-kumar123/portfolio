const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();

const logFile = path.join(__dirname, "server_debug.log");
const logToFile = (msg) => {
  try {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (e) {
    console.error("Log file error:", e);
  }
};

logToFile("Initializing server script...");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  const msg = `${req.method} ${req.url}`;
  console.log(msg);
  logToFile(msg);
  next();
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/portfolio", require("./routes/portfolioRoutes"));

// Global Error Handler
app.use((err, req, res, next) => {
  const msg = `🔥 Global Error Handler: ${err.message}\n${err.stack}`;
  console.error(msg);
  logToFile(msg);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

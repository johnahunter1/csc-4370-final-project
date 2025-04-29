// Backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/journal";

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// use route
const entryRouter = require("./routes/entries");
app.use("/api/entries", entryRouter);

// example route
app.get("/", (req, res) => {
  res.send("API running...");
});

// run server
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});

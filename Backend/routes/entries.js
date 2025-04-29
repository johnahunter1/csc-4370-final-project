const express = require("express");
const router = express.Router();
const Entry = require("../models/entry");

// get all entries
router.get("/", async (req, res) => {
  const entries = await Entry.find().sort({ created: -1 });
  res.json(entries);
});

// create a new entry
router.post("/", async (req, res) => {
  const { title, category, mood, entry } = req.body;
  try {
    const newEntry = new Entry({
      title,
      category,
      mood,
      entry,
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ error: "Invalid entry data" });
  }
});

module.exports = router;

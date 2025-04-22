const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  mood: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  edited: {
    type: Date,
  },
  entry: {
    type: String,
    required: true,
    trim: true,
  },
});

// pre-save hook for create/save
EntrySchema.pre("save", function (next) {
  this.edited = new Date();
  next();
});

// pre-update hooks for update ops
EntrySchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  function (next) {
    this.set({ edited: new Date() });
    next();
  }
);

const Entry = mongoose.model("Entry", EntrySchema);
module.exports = Entry;

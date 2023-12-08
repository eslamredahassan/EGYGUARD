const mongoose = require("mongoose");

// Reminder Schema
const warningSchema = new mongoose.Schema({
  userId: String,
  moderatorId: String,
  reason: String,
  timestamp: { type: Date, default: Date.now },
});

const Warning = mongoose.model("Warning", warningSchema);
module.exports = Warning;

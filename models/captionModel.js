const mongoose = require("mongoose");

const CaptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  keyword: { type: String, required: true },
});

CaptionSchema.index({ text: 1, keyword: 1 }, { unique: true }); // Ensure unique combination

module.exports = mongoose.model("Caption", CaptionSchema);
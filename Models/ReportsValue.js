const mongoose = require("mongoose");

const reportsValuesSchema = mongoose.Schema({
  0: { type: Number, required: true },
  1: { type: Number, required: true },
  2: { type: Number, required: true },
  3: { type: Number, required: true },
  4: { type: Number, required: true },
  5: { type: Number, required: true },
  6: { type: Number, required: true },
});

const reportsValue = mongoose.model("reportsValues", reportsValuesSchema);
module.exports = reportsValue;

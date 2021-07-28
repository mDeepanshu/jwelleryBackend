const mongoose = require("mongoose");

const reportsValuesSchema = mongoose.Schema({
  _id: { type: Number },
  values: { type: Array, required: true },
});

const reportsValue = mongoose.model("reportsValues", reportsValuesSchema);
module.exports = reportsValue;

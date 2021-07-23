const mongoose = require("mongoose");

const commonTransactionsSchema = mongoose.Schema({
  refId: "ObjectId",
  date: { type: Date },
  amount: { type: Number, required: false },
  description: { type: String },
  type: { type: String, required: true },
});

const commonTransaction = mongoose.model(
  "commonTransactions",
  commonTransactionsSchema
);
module.exports = commonTransaction;

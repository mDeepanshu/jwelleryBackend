const mongoose = require("mongoose");

const transactionsSchema = mongoose.Schema({
  itemName: { type: String, required: true },
  weight: { type: Number, required: true },
  principle: { type: Number, required: true },
  roi: { type: Number, required: true },
  issueDate: { type: String, required: true },
  cusId: "ObjectId",
  returnDate: { type: String },
  profit: { type: Number },
  rid: { type: Number },
  returned: { type: Boolean },
  amount: { type: Number, required: false },
  description: { type: String },
});

const Transaction = mongoose.model("Transactions", transactionsSchema);
module.exports = Transaction;

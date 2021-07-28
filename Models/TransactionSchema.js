const mongoose = require("mongoose");

const transactionsSchema = mongoose.Schema({
  itemName: { type: String },
  weight: { type: Number },
  principle: { type: Number },
  roi: { type: Number },
  issueDate: { type: Number },
  cusId: "ObjectId",
  returnDate: { type: Number },
  profit: { type: Number },
  // rid: { type: Number },
  returned: { type: Boolean },
  // amount: { type: Number, required: false },
  description: { type: String },
});

const Transaction = mongoose.model("Transactions", transactionsSchema);
module.exports = Transaction;

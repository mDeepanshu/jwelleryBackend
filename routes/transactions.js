const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router();

const Transaction = require("../Models/TransactionSchema");
const Customer = require("../Models/CustomerSchema");

router.post("/new_issue", async (req, res) => {
  console.log("transaction", req.body);
  //   const { id } = req.query;
  //   console.log(id);
  const transaction = new Transaction(req.body);
  transaction
    .save()
    .then((transaction) => {
      console.log(transaction);
      cusTran(transaction.cusId, transaction._id);
      res.status(200).json({
        title: "Success!",
        message: "Transaction Saved",
      });
    })
    .catch(() => {
      console.log("error");
    });

  // res.status(201).json({
  //   message: "Post added successfully",
  // });
  // postOrders("T");
  // cusTran(req.body.cusId);
});

app.post("/getTransaction", (req, res) => {
  console.log(req.body);
  Arr = req.body;
  if (Arr[0] == "rep") {
    Transactions.find(
      {
        $and: [
          { returnDate: { $gte: Arr[1] } },
          { returnDate: { $lte: Arr[2] } },
        ],
      },
      {
        profit: 1,
        returnDate: 1,
        cusId: 1,
      }
    )
      .sort({ returnDate: 1 })
      .then((documents) => {
        res.status(200).json({
          transactions: documents,
        });
      });
  } //
  else {
    let lesser = Arr[0];
    let greater = Arr[1];
    console.log(Arr[0], Arr[1]);
    Transactions.find({
      $and: [{ issueDate: { $gte: Arr[0] } }, { issueDate: { $lte: Arr[1] } }],
    }).then((documents) => {
      console.log(documents);
      res.status(200).json({
        transactions: documents,
      });
    });
  }
});

router.post("/indiTrans", (req, res) => {
  const { id } = req.query;
  console.log(req.body);

  Transaction.find({ _id: req.body }).then((transactions) => {
    console.log(transactions);
    res.status(200).json({
      title: "Posts fetched successfully!",
      message: transactions,
    });
  });
});

function cusTran(uid, idToUse) {
  Customer.findOne({ _id: uid }).then((customer) => {
    customer.transactions.push(idToUse);
    customer.save();
  });
}

module.exports = router;

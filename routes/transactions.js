const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router();

const Transaction = require("../Models/TransactionSchema");
const Customer = require("../Models/CustomerSchema");
const CommonTransaction = require("../Models/CommonTransactionSchema");
const ReportsValue = require("../Models/ReportsValue");

router.post("/new_issue", async (req, res) => {
  console.log("transaction", req.body);
  //   const { id } = req.query;
  //   console.log(id);
  console.log(req.body.principle);
  alterReports(req.body.principle, "DC");
  const transaction = new Transaction(req.body);
  transaction
    .save()
    .then((transaction) => {
      let commonTr = {
        refId: transaction._id,
        amount: transaction.principle,
        date: transaction.issueDate,
        type: "ISSUE",
      };
      cusTran(transaction.cusId, transaction._id);
      addToCommonTransaction(commonTr);
      res.status(200).json({
        title: "Success!",
        message: "Transaction Saved",
      });
    })
    .catch((ERR) => {
      console.log(ERR);
    });
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
  // const { id } = req.query;
  console.log("indiTrans", req.body);

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

router.post("/new_debitCredit", async (req, res) => {
  alterReports(req.body.amount, "DC");
  addToCommonTransaction(req.body).then(() => {
    res.status(200).json({
      title: "Success!",
      message: "Transaction Saved",
    });
  });
});

// get Debit Credit Transaction
router.get("/getDC", async (req, res) => {
  let { limit, page } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);
  CommonTransaction.find({ description: { $exists: true } })
    .limit(limit)
    .skip((page - 1) * limit)
    .then((transactions) => {
      console.log("DC", transactions);
      res.status(200).json({
        title: "DC fetched successfully!",
        message: transactions,
      });
    });
});
router.get("/get_RandI_Transaction", async (req, res) => {
  const { from, till } = req.query;
  let { limit, page } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);
  Transaction.find({
    $or: [
      {
        $and: [
          { returnDate: { $gte: new Date(Number(from)) } },
          { returnDate: { $lte: new Date(Number(till)) } },
        ],
      },
      {
        $and: [
          { issueDate: { $gte: new Date(Number(from)) } },
          { issueDate: { $lte: new Date(Number(till)) } },
        ],
      },
    ],
  })
    .limit(limit)
    .skip((page - 1) * limit)
    .then((transactions) => {
      // console.log(transactions[0].issueDate.getTime());
      let toGetCustomer = [];
      transactions.forEach((element) => {
        toGetCustomer.push(element.cusId);
      });
      Customer.find({ _id: toGetCustomer }).then((customers) => {
        res.status(200).json({
          title: "IR fetched successfully!",
          message: [transactions, customers],
        });
      });
    });
});

//GET RETURNED TRANSACTION
// todo add
router.get("/getRT", async (req, res) => {
  const { from, till } = req.query;
  let { limit, page } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);
  Transaction.find({
    $and: [
      { returnDate: { $gte: Number(from) } },
      { returnDate: { $lte: Number(till) + 86400000 } },
    ],
  })
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ returnDate: -1 })
    .then((transactions) => {
      console.log("RETURNED", transactions);
      let toGetCustomer = [];
      transactions.forEach((element) => {
        toGetCustomer.push(element.cusId);
      });
      Customer.find({ _id: toGetCustomer }).then((customers) => {
        res.status(200).json({
          title: "Return transaction fetched successfully!",
          message: [transactions, customers],
        });
      });
    });
});

//GET ALL TRANSACTION
// todo add
router.get("/allT", async (req, res) => {
  const { from, till } = req.query;
  let { limit, page } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);
  console.log(typeof from, till);
  CommonTransaction.find({
    $and: [
      { date: { $gte: Number(from) } },
      { date: { $lte: Number(till) + 86400000 } },
    ],
  })
    .limit(limit)
    .skip((page - 1) * limit)
    .then((transactions) => {
      console.log("All Transactions", transactions);
      res.status(200).json({
        title: "All Transactions fetched successfully!",
        message: transactions,
      });
    });
});

function addToCommonTransaction(transaction) {
  let p = new Promise((res, rej) => {
    const commontransaction = new CommonTransaction(transaction);
    commontransaction
      .save()
      .then(() => {
        res("success");
      })
      .catch((err) => {
        rej(err);
      });
  });
  return p;
}

function alterReports(amount, type) {
  console.log(amount);
  if (type == "RETURN") {
    amount *= 1;
  }
  ReportsValue.findOne({ _id: 0 }).then((array) => {
    if (type == "RETURN") {
      array.values[0] += amount;
      array.values[4] += amount;
      array.values[5] += amount;
      array.values[6] += amount;
    } else {
      array.values[0] -= amount;
      array.values[1] += amount;
      array.values[2] += amount;
      array.values[3] += amount;
    }
    console.log(array.values);
    ReportsValue.findOneAndReplace({ _id: 0 }, { values: array.values }).then(
      (data) => {
        console.log(data);
      }
    );
  });
}

router.post("/return", async (req, res) => {
  Transaction.findOne({ _id: req.body.issueRef }).then((document) => {
    (document.returnDate = req.body.returnDate),
      (document.profit = req.body.profit);
    document.save().then(() => {
      let commonTr = {
        refId: req.body.issueRef,
        amount: req.body.profit,
        date: req.body.returnDate,
        type: "RETURN",
      };
      alterReports(req.body.profit, "RETURN");
      addToCommonTransaction(commonTr).then(() => {
        res.status(200).json({
          title: "Success!",
          message: "Transaction Saved",
        });
      });
    });
  });
});

(() => {
  let d = new Date();
  console.log(d.getTime());
})();

module.exports = router;

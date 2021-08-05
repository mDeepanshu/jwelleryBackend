const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router();

const Transaction = require("../Models/TransactionSchema");
const Customer = require("../Models/CustomerSchema");
const CommonTransaction = require("../Models/CommonTransactionSchema");
const ReportsValue = require("../Models/ReportsValue");

router.post("/new_issue", async (req, res) => {
  //   const { id } = req.query;
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
    Transactions.find({
      $and: [{ issueDate: { $gte: Arr[0] } }, { issueDate: { $lte: Arr[1] } }],
    }).then((documents) => {
      res.status(200).json({
        transactions: documents,
      });
    });
  }
});

router.post("/indiTrans", (req, res) => {
  // const { id } = req.query;
  Transaction.find({ _id: req.body }).then((transactions) => {
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
  alterReports(req.body.amount, req.body.type);
  addToCommonTransaction(req.body).then(() => {
    res.status(200).json({
      title: "Success!",
      message: "Transaction Saved",
    });
  });
});

// get Debit Credit Transaction
router.get("/getDC", async (req, res) => {
  let { limit, page, from, till } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);
  CommonTransaction.find({
    $and: [
      { date: { $gte: Number(from) } },
      { date: { $lte: Number(till) + 86400000 } },
      { description: { $exists: true } },
    ],
  })
    .limit(limit)
    .skip((page - 1) * limit)
    .then((transactions) => {
      res.status(200).json({
        title: "DC fetched successfully!",
        message: transactions,
      });
    });
});
router.get("/get_RandI_Transaction", async (req, res) => {
  const { from, till } = req.query;
  console.log("from, till", from, till);
  let { limit, page } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);
  Transaction.find({
    $or: [
      {
        $and: [
          { returnDate: { $gte: new Date(Number(from)) } },
          { returnDate: { $lte: new Date(Number(till) + 86400000) } },
        ],
      },
      {
        $and: [
          { issueDate: { $gte: new Date(Number(from)) } },
          { issueDate: { $lte: new Date(Number(till) + 86400000) } },
        ],
      },
    ],
  })
    .limit(limit)
    .skip((page - 1) * limit)
    .then((transactions) => {
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
  CommonTransaction.find({
    $and: [
      { date: { $gte: Number(from) } },
      { date: { $lte: Number(till) + 86400000 } },
    ],
  })
    .limit(limit)
    .skip((page - 1) * limit)
    .then((transactions) => {
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
  if (type == "RETURN") {
    amount *= 1;
  }
  ReportsValue.findOne({ _id: 0 }).then((array) => {
    if (type == "CREDIT") {
      array.values[0] -= amount;
    } else if (type == "DEBIT") {
      array.values[0] += amount;
    } else if (type == "RETURN") {
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
    ReportsValue.findOneAndReplace({ _id: 0 }, { values: array.values }).then(
      (data) => {}
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

(async () => {
  let d = new Date();
  let mainBal;
  await ReportsValue.find().then((reportsValue) => {
    mainBal = reportsValue[0].values[0];
  });
  CommonTransaction.find()
    .sort({ date: -1 })
    .limit(1)
    .then((transactions) => {
      let s = new Date(transactions[0].date);
      if (d.getDate() != s.getDate()) {
        let transaction = {
          date: d.getTime(),
          mainBal: mainBal,
        };
        const commontransaction = new CommonTransaction(transaction);
        commontransaction.save().then((result) => {});
      }
    });
})();

module.exports = router;

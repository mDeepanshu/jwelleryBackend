const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router();

const Account = require("../Models/Accounts");
const ReportsValue = require("../Models/ReportsValue");

router.get("/checkCredential", async (req, res) => {
  const { userName, password } = req.query;
  console.log(userName, password);
  Account.find({ userName: userName, password: password }).then((accounts) => {
    console.log(accounts);
    let isOk;
    if (accounts.length == 0) {
      isOk = false;
    } else {
      isOk = true;
    }
    res.status(200).json({
      title: accounts[0].type,
      message: isOk,
    });
  });
});

router.get("/getReportsValue", async (req, res) => {
  ReportsValue.find().then((reportsValue) => {
    console.log("DC", reportsValue);
    res.status(200).json({
      title: "Reports Value fetched successfully!",
      message: reportsValue[0],
    });
  });
});

module.exports = router;

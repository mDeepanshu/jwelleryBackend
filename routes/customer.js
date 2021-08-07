const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router();

// var admin = require("firebase-admin");
// const Transactions = require("./models/transactions");
const Customer = require("../Models/CustomerSchema");

// mongodb+srv://damon:qwert123@cluster0.qyevd.mongodb.net/anilDeriyaJwellers?retryWrites=true
// mongodb://localhost:27017/
//

router.get("/", async (req, res) => {
  console.log("hey found new request");
  res.send("Formatter.format here is response for you 200");
});
// 1
router.post("/add_new", async (req, res) => {
  console.log(req.body);
  let customer = new Customer(req.body);
  customer.save().then(
    res.status(200).json({
      title: "Success!",
      message: "Customer Saved",
    })
  );
});

router.get("/getCustomer", (req, res) => {
  let { limit, page } = req.query;
  console.log("limit, page", limit, page);
  limit = 1;
  page = parseInt(page);
  Customer.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .then((documents) => {
      res.status(200).json({
        title: "Posts fetched successfully!",
        message: documents,
      });
    });
});
/** Autocomplete */
const autocomplete = "autocomplete";
router.get(`/${autocomplete}`, async (req, res) => {
  const { keyword, limit, field } = req.query;
  console.log(keyword, limit, field);
  let regEx = new RegExp(keyword, "g");
  const queryResult = await Customer.find({ [field]: regEx })
    .limit(parseInt(limit))
    .exec();
  res.status(200).json({
    title: "Success!",
    message: queryResult,
  });
});
module.exports = router;

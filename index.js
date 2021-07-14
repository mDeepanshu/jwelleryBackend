const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const customer = require("./routes/customer");
const transaction = require("./routes/transactions");

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/customer", customer);
app.use("/transaction", transaction);

DB_LINK = "mongodb://localhost:27017/adj";
mongoose
  .connect(DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database!");
    const server = app.listen(3000);
    const io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });

module.exports = app;

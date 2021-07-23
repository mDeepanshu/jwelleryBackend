const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  _id: "ObjectId",
  userName: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
});

const AccountModel = mongoose.model("Account", accountSchema);
module.exports = AccountModel;

const mongoose = require("mongoose");

// const childSchema = new mongoose.Schema({
//   _id:{type:Number, required:true},
// });

const customerSchema = mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phone: { type: String, required: false },
  village: { type: String, required: true },
  caste: { type: String, required: true },
  transactions: [],
});

const CustomerModel = mongoose.model("Customer", customerSchema);
module.exports = CustomerModel;

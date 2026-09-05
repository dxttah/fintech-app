const mongoose = require("mongoose");

const AccountSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  nin: {
    type: String,
  },
  bvn: {
    type: String,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  bankCode: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

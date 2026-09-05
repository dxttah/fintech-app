const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
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
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    kycType: {
      type: String,
      required: true,
    },
    kycID: {
      type: String,
      unique: true,
      sparse: true,
    },
    accountNumber: {
      type: String,
    },
    bankCode: {
      type: String,
    },
    bankName: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = { User: mongoose.model("User", userSchema) };

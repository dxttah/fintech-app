const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    from: {
      type: {
        accountNumber: String,
        accountName: String,
        bankCode: String,
        bankName: String,
        _id: false,
      },
      required: true,
    },
    to: {
      type: {
        accountNumber: String,
        accountName: String,
        bankCode: String,
        bankName: String,
        _id: false,
      },
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["INTER_BANK", "INTRA_BANK"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = {
  Transaction: mongoose.model("Transaction", transactionSchema),
};

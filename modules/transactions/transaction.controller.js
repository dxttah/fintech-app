const {
  nibssAcctNameEnquiry,
  nibssBankTransfer,
} = require("../../services/nibss.service");
const { validateRequiredFields } = require("../../utils/helper");
const { User } = require("../users/user.model");
const { Transaction } = require("./transction.model");

const transfer = async (req, res) => {
  const { accountNumber, bankCode, accountName, amount } = req.body;
  const requiredFields = { accountNumber, bankCode, accountName, amount };
  const missingFields = validateRequiredFields(requiredFields);
  const transferAmount = Number(amount);

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const sender = await User.findOne({ _id: req.user.id });
    const balance = Number(sender.balance);
    const internalRecipient = await User.findOne({ accountNumber });
    const nibssRecipient = await nibssAcctNameEnquiry(accountNumber);

    if (sender.accountNumber === accountNumber) {
      return res.status(400).json({
        message: "User can not initate a transfer to themselves.",
      });
    }
    if (
      !nibssRecipient ||
      nibssRecipient.accountNumber !== accountNumber ||
      nibssRecipient.accountName !== accountName ||
      nibssRecipient.bankCode !== bankCode
    ) {
      return res.status(400).json({
        message: "Check account info and try again",
      });
    }
    if (transferAmount > balance) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }
    console.log(internalRecipient);

    const bankTransfer = await nibssBankTransfer({
      from: sender.accountNumber,
      to: accountNumber,
      amount,
    });

    const transaction = await Transaction.create({
      transactionId: bankTransfer.reference,
      senderId: sender._id,
      ...(internalRecipient ? { recipientId: internalRecipient._id } : {}),
      amount: bankTransfer.amount,
      from: {
        accountNumber: sender.accountNumber,
        accountName: sender.accountName,
        bankCode: sender.bankCode,
        bankName: sender.bankName,
      },
      to: {
        accountNumber: nibssRecipient.accountNumber,
        accountName: nibssRecipient.accountName,
        bankCode: nibssRecipient.bankCode,
        bankName: nibssRecipient.bankName,
      },
      status: bankTransfer.status,
      transactionType:
        sender.bankCode === bankCode ? "INTRA_BANK" : "INTER_BANK",
    });

    return res.status(200).json({
      message: `TRANSFER ${bankTransfer.status}`,
      transactionId: transaction.transactionId,
      amount: transferAmount,
      from: transaction.from,
      to: transaction.to,
      status: transaction.status,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message:
        error.error ||
        error.message ||
        "Failed to validate account number. Try again",
    });
  }
};

const getUserTransactions = async (req, res) => {
  const { id } = req.user;
  try {
    const transactions = await Transaction.find({
      $or: [{ senderId: id }, { recipientId: id }],
    });
    return res.status(200).json({ message: "Successful", data: transactions });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message:
        error.error ||
        error.message ||
        "Failed to fetch transactions. Try again",
    });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    return res.status(200).json({ message: "Successful", data: transactions });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message:
        error.error ||
        error.message ||
        "Failed to fetch transactions. Try again",
    });
  }
};

const getTransactionbyId = async (req, res) => {
  const { transactionId } = req.params;
  console.log("transactionId", transactionId);
  try {
    const transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    return res.status(200).json({ message: "Successful", data: transaction });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message:
        error.error ||
        error.message ||
        "Failed to fetch transaction. Try again",
    });
  }
};

module.exports = {
  transfer,
  getUserTransactions,
  getTransactionbyId,
  getAllTransactions,
};

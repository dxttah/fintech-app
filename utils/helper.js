const { Transaction } = require("../modules/transactions/transction.model");

function omit(obj, keys = []) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key)),
  );
}

const normalizeDob = (value) => {
  if (!value) return "";

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value).split("T")[0];
  }

  return date.toISOString().split("T")[0];
};

const generateTransactionId = async () => {
  let transactionId;
  let exists = true;
  while (exists) {
    const randomNum = Math.floor(Math.random() * 10000000000);
    transactionId = `TX${randomNum}`;
    const existingTx = await Transaction.findOne({ transactionId });
    exists = !!existingTx;
  }
  return transactionId;
};

const handleServerError = (res, error, message = "Internal server error") => {
  console.log(error);
  return res.status(500).json({
    message,
    error: error.message,
  });
};

const validateRequiredFields = (fields) => {
  return Object.entries(fields)
    .filter(([, value]) => !value)
    .map(([key]) => key);
};

module.exports = {
  omit,
  normalizeDob,
  handleServerError,
  generateTransactionId,
  validateRequiredFields,
};

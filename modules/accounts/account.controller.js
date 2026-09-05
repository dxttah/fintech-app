const {
  nibssAcctNameEnquiry,
  nibssGetAcctBalance,
} = require("../../services/nibss.service");

const validateAccount = async (req, res) => {
  const { accountNumber } = req.params;
  if (!accountNumber) {
    res.status(400).json({ message: "Account number is required" });
  }
  try {
    const validate = await nibssAcctNameEnquiry(accountNumber);
    return res
      .status(200)
      .json({ message: "Validation successful", data: validate });
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

const getAccountBalance = async (req, res) => {
  const { accountNumber } = req.params;
  if (!accountNumber) {
    res.status(400).json({ message: "Account number is required" });
  }
  try {
    const balance = await nibssGetAcctBalance(accountNumber);
    return res.status(200).json({
      message: "Account balance retrieved successfully",
      data: balance,
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

module.exports = { validateAccount, getAccountBalance };

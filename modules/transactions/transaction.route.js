const express = require("express");
const { authenticate } = require("../../middleware/authenticate");
const {
  transfer,
  getTransactionbyId,
  getUserTransactions,
  getAllTransactions,
} = require("./transaction.controller");
const router = express.Router();

router.post("/create-transfer", authenticate, transfer);
router.get("/getbyid/:transactionId", authenticate, getTransactionbyId);
router.get("/get-user-tansactions", authenticate, getUserTransactions);
router.get("/get-all", authenticate, getAllTransactions);

module.exports = router;

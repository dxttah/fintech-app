const express = require("express");
const { authenticate } = require("../../middleware/authenticate");
const { validateAccount, getAccountBalance } = require("./account.controller");
const router = express.Router();

router.get("/validate-account/:accountNumber", authenticate, validateAccount);
router.get("/get-balance/:accountNumber", authenticate, getAccountBalance);

module.exports = router;

const express = require("express");
const {
  adminCreateBvn,
  adminCreateNin,
  adminGetAllAccounts,
} = require("./admin.controller");
const { authenticate, authorize } = require("../middleware/authenticate");
const { createUser } = require("../modules/users/user.controller");
const router = express.Router();

router.post(
  "/create-bank-account",
  authenticate,
  authorize("admin"),
  createUser,
);
router.post("/create-bvn", authenticate, authorize("admin"), adminCreateBvn);
router.post("/create-nin", authenticate, authorize("admin"), adminCreateNin);
router.get(
  "/get-all-accounts",
  authenticate,
  authorize("admin"),
  adminGetAllAccounts,
);

module.exports = router;

const express = require("express");
const { authenticate } = require("../../middleware/authenticate");
const { createUser, loginUser } = require("./user.controller");
const router = express.Router();

router.post("/create-user", createUser);
router.post("/login", loginUser);

module.exports = router;

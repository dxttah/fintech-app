const express = require("express");
const app = express();

app.use(express.json());

const adminRoute = require("./admin/admin.route");
const userRoute = require("./modules/users/user.route");
const transactionRoute = require("./modules/transactions/transaction.route");
const accountRoute = require("./modules/accounts/account.route");

app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/account", accountRoute);

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: err.toString(),
  });
});

module.exports = app;

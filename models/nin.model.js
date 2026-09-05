const mongoose = require("mongoose");

const ninSchema = new mongoose.Schema(
  {
    nin: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = { Nin: mongoose.model("Nin", ninSchema) };

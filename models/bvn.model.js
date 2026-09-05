const mongoose = require("mongoose");

const bvnSchema = new mongoose.Schema(
  {
    bvn: {
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
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = { Bvn: mongoose.model("Bvn", bvnSchema) };

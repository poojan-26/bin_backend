const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  chargeId: String,
  // stripeEventId: String,
  paymentIntent: String,
  stripeReponseJSON: String,
  customerId: String,
  amount: Number,
  applicationFee: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const transaction = mongoose.model("transaction", transactionSchema);

module.exports = transaction;

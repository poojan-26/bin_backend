const mongoose = require("mongoose");

const franchiseeSchema = mongoose.Schema({
  email: String,
  zipcode: Number,
  active: { type: Number, enum: [0, 1], default: 1 },
});

const notifyEmail = mongoose.model("notifyEmail", franchiseeSchema);

module.exports = notifyEmail;

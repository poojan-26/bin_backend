const mongoose = require("mongoose");

const promoCodeSchema = mongoose.Schema({
  code: String,
  discountType: { type: String, enum: ["fixed", "percentage"] },
  discountNumber: Number,
  active: { type: Number, enum: [0, 1], default: 1 },
});

const promoCode = mongoose.model("promoCode", promoCodeSchema);

module.exports = promoCode;

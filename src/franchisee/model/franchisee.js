const mongoose = require("mongoose");


const franchiseeSchema = mongoose.Schema({
  businessName: String,
  phoneNumber:String,
  email: String,
  address:String,
  zipCode: [Number],
  city:String,
  state:String,
  active: { type: Number, enum: [0, 1], default: 1 },
});

const franchisee = mongoose.model("franchisee", franchiseeSchema);

module.exports = franchisee;

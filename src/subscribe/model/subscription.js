const mongoose = require("mongoose");

const subscribeSchema = mongoose.Schema({
    title : String,
    subscriptionType : {type: String, enum: ['monthly', 'quarterly', 'one time'] }, 
	binNumber: { type: Number, enum: [1,2,3,4] },
	Price : Number,
    active: { type: Number, enum: [0, 1], default: 1 },
  });
  
  const subscription = mongoose.model("subscription", subscribeSchema);
  
  module.exports = subscription;
  
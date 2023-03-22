const mongoose = require("mongoose");

const State = mongoose.Schema({
  name: String,
  abbreviation: String,
});

const state = mongoose.model("state", State);

module.exports = state;

const Transaction = require("./model");

const createTransaction = async (data) => {
  // console.log("createTransaction ==>", data);
  const newTransaction = new Transaction(data);
  try {
    const result = await newTransaction.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  createTransaction: createTransaction,
};

const subscribe = require("../model/subscription");
const usaState = require("../model/state");

const getSubscribe = async (req, res) => {
  try {
    const getsubscribe = await subscribe.find({ active: 1 });
    res.status(200).json(getsubscribe);
  } catch (error) {
    console.log(error);
  }
};

const createSubscription = async (req, res) => {
  let create = req.body;
  const newSubscription = new subscribe(create);
  try {
    const result = await newSubscription.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const editSubscribe = async (req, res) => {
  const id = req.params;
  try {
    let updateObj = {};
    if (req.body.title) {
      updateObj["title"] = req.body.title;
    }
    if (req.body.subscriptionType) {
      updateObj["subscriptionType"] = req.body.subscriptionType;
    }
    if (req.body.Price) {
      updateObj["Price"] = req.body.Price;
    }
    if (req.body.active) {
      updateObj["active"] = req.body.active;
    }
    const result = await subscribe.updateOne({ id }, { $set: updateObj });
    res.send(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const getUsaStates = async (req, res) => {
  try {
    const getState = await usaState.find();
    getState.sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json(getState);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getSubscribe: getSubscribe,
  createSubscription: createSubscription,
  editSubscribe: editSubscribe,
  getUsaStates: getUsaStates,
};

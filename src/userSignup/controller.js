const User = require("./model");
const axios = require("axios");

const saveUserDetails = async (req, res) => {
  try {
    // console.log("saveUserDetails ==>", req.body);
    const newUser = new User(req.body);
    const result = await newUser.save();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const updateUserDetails = async (req, res) => {
  try {
    let { customer, id, nickname } = req.body;

    console.log(req.body);

    let updateUser = await User.findOneAndUpdate(
      { "stripe.customerId": customer },
      { "stripe.planId": id, "stripe.planName": nickname }
    );
    res.status(200).send(updateUser);
  } catch (error) {
    console.log(error);
    return false;
  }
};

const zapierUpdate = async (req, res) => {
  try {
    // console.log("zapierUpdate", req.body);

    axios({
      method: "post",
      url: "https://hooks.zapier.com/hooks/catch/8417946/bwy9qkr/",
      data: req.body,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("ZAIPER SIGNUP HOOK", response.data);
      })
      .catch((err) => {
        console.log("ZAIPER SIGNUP ERROR", err);
      });

    res.status(200).send("success!");
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  saveUserDetails: saveUserDetails,
  updateUserDetails: updateUserDetails,
  zapierUpdate: zapierUpdate,
};

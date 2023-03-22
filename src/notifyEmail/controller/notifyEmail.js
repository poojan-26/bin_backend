const notifyEmail = require("../model/notifyEmail");
let axios = require("axios");

const getnotifyEmail = async (req, res) => {
  try {
    const getfranchise = await notifyEmail.find({ active: 1 });
    res.status(200).json(getfranchise);
  } catch (error) {
    console.log(error);
  }
};

const createnotifyEmail = async (req, res) => {
  axios({
    method: "post",
    url: "https://hooks.zapier.com/hooks/catch/8417946/bwy9eha/",
    data: req.body,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log("ZAIPER EMAIL HOOk", response.data);
    })
    .catch((err) => {
      console.log("ZAIPER EMAIL ERROR", err);
    });
  const newEmail = new notifyEmail(req.body);
  try {
    const result = await newEmail.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getnotifyEmail: getnotifyEmail,
  createnotifyEmail: createnotifyEmail,
};

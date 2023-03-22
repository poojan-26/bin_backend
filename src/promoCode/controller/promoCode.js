const promoCode = require("../model/promoCode");

const getpromoCode = async (req, res) => {
  try {
    const getpromoCode = await promoCode.find({ active: 1 });
    res.status(200).json(getpromoCode);
  } catch (error) {
    console.log(error);
  }
};

const createpromoCode = async (req, res) => {
  let create = req.body;
  const newPromoCode = new promoCode(create);
  try {
    const result = await newPromoCode.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};


const editpromoCode = async (req, res) => {
    const id = req.params;
    try {
      let updateObj = {};
      if (req.body.code) {
        updateObj["code"] = req.body.code;
      }
      if (req.body.dicountType) {
        updateObj["dicountType"] = req.body.dicountType;
      }
      if (req.body.discountNumber) {
        updateObj["discountNumber"] = req.body.discountNumber;
      }
      if (req.body.active) {
        updateObj["active"] = req.body.active;
      }
      const result = await promoCode.updateOne({ id }, { $set: updateObj });
      res.send(200).json(result);
    } catch (error) {
      console.log(error);
    }
  };

module.exports = {
    getpromoCode: getpromoCode,
    createpromoCode:createpromoCode,
    editpromoCode:editpromoCode
};

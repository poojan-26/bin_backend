const express = require("express");
// const {getFranchisee, CreateFranchisee} = require("../controller/franchisee")
let promoCodeController = require("../controller/promoCode");

const router = express.Router();

//ALL SUBSCRIBE ROUTES
//get subscribe
router.get("/get", promoCodeController.getpromoCode);

//create franchisee
router.post("/create", promoCodeController.createpromoCode);

//update franchisee
router.put("/edit/:id", promoCodeController.editpromoCode);

// //stripe
// router.get("/stripe", franchiseeController.initialiseFunction)

module.exports = router;


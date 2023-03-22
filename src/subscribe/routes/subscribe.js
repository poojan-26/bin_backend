const express = require("express");
// const {getFranchisee, CreateFranchisee} = require("../controller/franchisee")
let subscribeController = require("../controller/subscribe");

const router = express.Router();

//ALL SUBSCRIBE ROUTES
//get subscribe
router.get("/get", subscribeController.getSubscribe);

//create franchisee
router.post("/create", subscribeController.createSubscription);

//update franchisee
router.put("/edit/:id", subscribeController.editSubscribe);

// //stripe
// router.get("/stripe", franchiseeController.initialiseFunction)

router.get("/getStateList", subscribeController.getUsaStates);

module.exports = router;

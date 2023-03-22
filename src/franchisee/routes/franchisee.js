const express = require("express");
// const {getFranchisee, CreateFranchisee} = require("../controller/franchisee")
let franchiseeController = require("../controller/franchisee");

const router = express.Router();

//ALL FRANCHISEE ROUTES
//get franchisee
router.get("/get", franchiseeController.getFranchisee);

router.get("/info", franchiseeController.getFranchiseeById);

router.get("/zipcodeLookup", franchiseeController.zipcodeLookup);

router.get("/verifyEmail", franchiseeController.verifyEmail);

//create franchisee
router.post("/create", franchiseeController.CreateFranchisee);

//update franchisee
router.put("/edit/:id", franchiseeController.editFranchisee);

module.exports = router;

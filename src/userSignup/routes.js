const express = require("express");
let userController = require("./controller");

const router = express.Router();

//ALL SUBSCRIBE ROUTES

//create franchisee
router.post("/saveUserDetails", userController.saveUserDetails);
router.post("/updateUser", userController.updateUserDetails);
router.post("/zapierUpdate", userController.zapierUpdate);

module.exports = router;

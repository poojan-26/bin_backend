const express = require("express");
let notifyEmail = require("../controller/notifyEmail");

const router = express.Router();

//ALL FRANCHISEE ROUTES
//get franchisee
router.get("/get", notifyEmail.getnotifyEmail);

router.post("/create", notifyEmail.createnotifyEmail);


module.exports = router;

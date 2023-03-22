const express = require("express");
const router = express.Router();
const controller = require("./stripeSetup");

router.post("/createPaymentIntent", controller.createPaymentIntent);
router.post("/createRecurringPayment", controller.createRecurringPayment);
router.post("/createPromoCode", controller.createPromoCode);
router.get("/verifyPromoCode", controller.verifyPromoCode);
router.get("/planListing", controller.planListing);
router.post("/customer", controller.createRetrieveCustomer);

// router.post("/", controller.webhookService);

module.exports = router;

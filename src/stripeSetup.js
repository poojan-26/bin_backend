const Stripe = require("stripe");
let transactionController = require("../src/transaction/controller");
let User = require("./userSignup/model");
let stripeEvents = require("./stripe.events");

let stripeClient = new Stripe(process.env.STRIPE_KEY);

const createPromoCode = async (req, res) => {
  try {
    const coupon = await stripeClient.coupons.create({
      percent_off: 10,
      duration: "once",
    });
    res.status(200).send({ result: coupon });
  } catch (error) {
    console.log(error);
  }
};

const verifyPromoCode = async (req, res) => {
  try {
    if (!req.query.couponCode) {
      res.status(200).send("Please send coupon code in request!");
    }

    const coupon = await stripeClient.coupons.retrieve(req.query.couponCode);
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const stripeWebhook = async (req, res) => {
  try {
    console.log("stripeWebhook", req.body);
    if (req.body.type && stripeEvents[req.body.type]) {
      stripeEvents[req.body.type](req, res);
    } else {
      return res.status(200).end();
    }

    // }
  } catch (error) {
    return res.status(500).send(error);
  }
};

const planListing = async (req, res) => {
  try {
    const prices = await stripeClient.prices.list({ active: true, limit: 20 });
    res.status(200).json(prices);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createRetrieveCustomer = async (req, res) => {
  try {
    let {
      email = "",
      firstName = "",
      lastName = "",
      cardToken = "",
      trashDay = "",
      trashTime = "",
      address = "",
    } = req.body;
    if (!email) {
      return res
        .status(400)
        .send({ error: { message: "Invalid request to process!" } });
    }

    // console.log(req.body);

    //create fresh user and stripe customer
    let user = await User.findOne({ email }).lean();
    if (!user) {
      let customer = await stripeClient.customers.create({
        name: `${firstName || ""} ${lastName || ""}`,
        email,
        source: cardToken,
      });

      await User.create({
        email,
        firstName,
        lastName,
        stripe: {
          customerId: customer.id,
        },
        trashDay,
        trashTime,
        address,
      });

      return res.status(200).json(customer);
    }

    //check if user exist in stripe with exsiting customer id
    if (user.stripe && user.stripe.customerId) {
      let customer = await stripeClient.customers.retrieve(
        user.stripe.customerId
      );

      if (customer) {
        return res.status(200).json(customer);
      }
    }

    //create stripe customer and tie it to user's record
    let customer = await stripeClient.customers.create({
      name: `${user.firstName || ""} ${user.lastName || ""}`,
      email: user.email,
      source: cardToken,
    });

    if (customer) {
      user.stripe.customerId = customer.id;
    }

    //saving changes - customer id
    await user.save();
    return res.status(200).json(customer);
  } catch (error) {
    console.log("error", error);
    res.status(500).send(error);
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    let intentDetails = req.body;

    const paymentIntent = await stripeClient.paymentIntents.create({
      ...intentDetails,
    });

    res.status(200).json(paymentIntent);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createRecurringPayment = async (req, res) => {
  try {
    // console.log(req.body);

    let {
      customer = "",
      price = "",
      application_fee_percent = "",
      destination = "",
      coupon = "",
    } = req.body;

    let requestObj = {
      customer,
      items: [{ price }],
      application_fee_percent: Number(application_fee_percent),
      transfer_data: {
        destination,
      },
    };

    if (coupon != "") {
      requestObj["coupon"] = coupon;
    }

    const subscription = await stripeClient.subscriptions.create(requestObj);

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).send(error);
  }
};

// {
//   customer: 2500,
//   price: 'price_1L7zXsKM6vYnX02SLS97aRcD',
//   application_fee_percent: 400,
//   destination: 'acct_1L0BLRQTJNv6vlZn'
// }

module.exports = {
  createPromoCode,
  verifyPromoCode,
  createPaymentIntent,
  stripeWebhook,
  planListing,
  createRetrieveCustomer,
  createRecurringPayment,
};

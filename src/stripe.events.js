let stripeController = require("./stripeSetup");
let userController = require("./userSignup/controller");
let User = require("./userSignup/model");
let Franchisee = require("./franchisee/model/franchisee");
let Transaction = require("./transaction/model");
let moment = require("moment");
let axios = require("axios");

let transactionController = require("../src/transaction/controller");

let stripeEvents = {
  "charge.succeeded": async function (request, response) {
    // console.log("charge.succeeded", request.body);
    const { customer, id, application_fee_amount, amount, payment_intent } =
      request.body.data.object;

    let userData = await User.findOne({ "stripe.customerId": customer }, {});

    let saveObj = {
      chargeId: id,
      paymentIntent: payment_intent,
      stripeReponseJSON: JSON.stringify(request.body),
      customerId: customer,
      amount: amount / 100,
      applicationFee: application_fee_amount / 100,
    };

    let saveTransaction = new Transaction(saveObj);
    saveTransaction.save();

    let updateUser = await User.findOneAndUpdate(
      { "stripe.customerId": customer },
      // {
      //   $push: {
      //     "stripe.paymentIntents": {
      //       id: payment_intent,
      //       created: new Date(),
      //     },
      //   },
      // }
      {
        $addToSet: {
          "stripe.paymentIntents": {
            id: payment_intent,
            created: new Date(),
          },
        },
      }
    );
    response.status(200).end();
  },

  "account.updated": async function (request, response) {
    try {
      const { id, business_profile } = request.body.data.object;

      console.log(request.body);

      let findFranchisee = await Franchisee.findOne({
        "stripeInfo.stripeAccountId": id,
      });

      if (findFranchisee) {
        let updateFranchisee = await Franchisee.findOneAndUpdate(
          { "stripeInfo.stripeAccountId": id },
          {
            businessName: business_profile.name,
          }
        );
        response.status(200).end();
        return true;
      } else {
        let saveObj = {
          businessName: business_profile.name,
          zipCode: [],
          stripeReponseJSON: JSON.stringify(request.body),
          stripeInfo: {
            stripeAccountId: id,
            applicationPercent: Number(process.env.PERCENT_FEE),
          },
        };

        let createFranchisee = new Franchisee(saveObj);
        createFranchisee.save();
      }
      response.status(200).end();
    } catch (error) {
      console.log(error);
    }
  },

  "charge.failed": function (request, response) {},
  "customer.subscription.created": async function (request, response) {
    try {
      const { customer, id, items, current_period_end, current_period_start } =
        request.body.data.object;
      const plan = items.data && items.data[0].plan && items.data[0].plan.id;

      let today = new Date(current_period_start * 1000);
      let end = new Date(current_period_end * 1000);
      var days = moment(end).diff(moment(today), "days");

      // let saveObj = {
      //   stripe: {
      //     planName: items.data[0].plan.nickname,
      //     planId: plan,
      //     subscription: {
      //       id,
      //       lastPaidAt: today,
      //       nextPaidAt: end,
      //       expired: false,
      //       expiredIn: days,
      //     },
      //   },
      // };
      let saveObj = {
        "stripe.planName": items.data[0].plan.nickname,
        "stripe.planId": plan,
        "stripe.subscription": {
          id,
          lastPaidAt: today,
          nextPaidAt: end,
          expired: false,
          expiredIn: days,
        },
      };

      let updateUser = await User.findOneAndUpdate(
        { "stripe.customerId": customer },
        saveObj
      );
      response.status(200).end();
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = stripeEvents;

// if (data.type == "charge.succeeded") {
//   let saveObj = {
//     franchiseeId: data.data.object.destination,
//     stripeEventId: data.id,
//     stripeEventType: data.type,
//     stripeReponseJSON: JSON.stringify(data),
//     userInfo: data.data.object.shipping,
//     amount: data.data.object.amount_captured,
//     applicationFee: data.data.object.application_fee_amount,
//     paymentIntent: data.data.object.payment_intent,
//   };
//   // let createTransaction = transactionController.createTransaction(saveObj);

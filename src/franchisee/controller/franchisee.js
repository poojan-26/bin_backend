const { update } = require("../model/franchisee");
const franchisee = require("../model/franchisee");
const Stripe = require("stripe");
let stripeClient = new Stripe(process.env.STRIPE_KEY);

const getFranchisee = async (req, res) => {
  try {
    const getfranchise = await franchisee.find({ active: 1 });
    res.status(200).json(getfranchise);
  } catch (error) {
    console.log(error);
  }
};

const getFranchiseeById = async (req, res) => {
  try {
    const getfranchise = await franchisee.findOne({ _id: req.query.id });
    res.status(200).json(getfranchise);
  } catch (error) {
    console.log(error);
  }
};

const CreateFranchisee = async (req, res) => {
  try {
    let create = req.body;
    create = JSON.parse(JSON.stringify(create));
    const account = await stripeClient.accounts.create({ type: "express" });
    console.log("account", account.id);
    console.log("account", account);

    const accountLink = await stripeClient.accountLinks.create({
      account: account.id,
      refresh_url: "https://example.com/reauth",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    });

    if (account.id > 0) {
      console.log("account id is HERE YOOOOOOOOOOOOOOOOOOOOOOOOOOOOOo");
    }

    if (create.businessName == null) {
      res.status(400).json("Please pass franchisee buisness name!");
      return false;
    }

    if (create.zipcode == null) {
      res.status(400).json("Please pass the zipcode!");
      return false;
    }

    if (create.email == null) {
      res.status(400).json("Please pass the email!");
      return false;
    }
    if (create.address == null) {
      res.status(400).json("Please pass the address!");
      return false;
    }
    if (create.city == null) {
      res.status(400).json("Please pass the city!");
      return false;
    }
    if (create.phoneNumber == null) {
      res.status(400).json("Please pass the phoneNumber!");
      return false;
    }
    if (create.state == null) {
      res.status(400).json("Please pass the state!");
      return false;
    }

    let duplicateZip = await franchisee.find({ zipCode: create.zipcode }, {});
    let duplicateEmail = await franchisee.find({ email: create.email }, {});
    if (duplicateZip.length > 0) {
      res.status(411).json("Zipcode already serviced by another franchisee!");
      return false;
    }
    if (duplicateEmail.length > 0) {
      res
        .status(412)
        .json("Email already in use! Please use another email to sign up.");
      return false;
    }

    create.zipCode = create.zipcode;

    const newfranchisee = new franchisee(create);
    const result = await newfranchisee.save();
    res.status(200).json(accountLink.url);
  } catch (error) {
    console.log("SIGNUP FRANCHISEE ERROR ==>", error);
  }
};

const editFranchisee = async (req, res) => {
  const id = req.params;
  try {
    let updateObj = {};
    if (req.body.firstName) {
      updateObj["firstName"] = req.body.firstName;
    }
    if (req.body.lastName) {
      updateObj["lastName"] = req.body.lastName;
    }
    if (req.body.businessName) {
      updateObj["businessName"] = req.body.businessName;
    }
    if (req.body.zipCode) {
      updateObj["zipCode"] = req.body.zipCode;
    }
    if (req.body.stripeInfo) {
      updateObj["stripeInfo"] = req.body.stripeInfo;
    }
    if (req.body.active) {
      updateObj["active"] = req.body.active;
    }

    const result = await franchisee.updateOne({ id }, { $set: updateObj });
    res.send(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const zipcodeLookup = async (req, res) => {
  try {
    console.log(req.query);
    const getfranchise = await franchisee.find({ zipCode: req.query.zipcode });
    res.status(200).json(getfranchise);
  } catch (error) {
    console.log(error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const getfranchise = await franchisee.find({ email: req.query.email });
    if (getfranchise) {
      res.status(400).json("DUPLICATE_EMAIL");
      return false;
    } else {
      res.status(200).json("NO_EMAIL");
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getFranchisee: getFranchisee,
  CreateFranchisee: CreateFranchisee,
  editFranchisee: editFranchisee,
  zipcodeLookup: zipcodeLookup,
  getFranchiseeById: getFranchiseeById,
  verifyEmail: verifyEmail,
};

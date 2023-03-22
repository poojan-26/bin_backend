const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const filePath = require("path");
require("dotenv").config();
const franchisee = require("../binblasters-backend/src/franchisee/routes/franchisee");
const subscribe = require("../binblasters-backend/src/subscribe/routes/subscribe");
const promoCode = require("../binblasters-backend/src/promoCode/routes/promoCode");
const notifyEmail = require("../binblasters-backend/src/notifyEmail/routes/notifyEmail");
// const { createProxyMiddleware } = require("http-proxy-middleware");

let stripeRouter = require("./src/stripeRoutes");
let userRouter = require("./src/userSignup/routes");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" })); // define in ENV eventually.

app.use(express.static(filePath.join(__dirname + "./public/")));

app.get("/", (req, res) => {
  res.send({
    result: {
      Status: "Ok!",
    },
  });
});

//franchisee route
app.use("/api/franchise", franchisee);

//subscription route
app.use("/api/subscription", subscribe);

//promocode route
app.use("/api/promoCode", promoCode);
app.use("/api/stripe", stripeRouter);
app.use("/api/user", userRouter);
app.use("/api/notifyEmail", notifyEmail);

app.get("/testRoute", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  require("./src/stripeSetup").stripeWebhook
);
// app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
//   stripeController.webhookService(req.body);
//   res.status(200).send({ data: true });
// });

// mongoose connect
// const CONNECTION_URL = process.env.MONGO_CONNECTION_URL;
const CONNECTION_URL = "mongodb://localhost:27017/binblast";

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((error) => console.log("something went wrong", error));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

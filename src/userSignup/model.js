const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    trashDay: String,
    trashTime: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipcode: String,
    },

    stripe: {
      customerId: {
        type: String,
      },
      paymentMethod: {
        type: String,
        default: "card",
      },
      planName: {
        type: String,
      },
      planId: {
        type: String,
      },
      subscription: {
        id: {
          type: String,
        },
        lastPaidAt: Date,
        nextPaidAt: Date,
        expired: {
          type: Boolean,
          default: false,
        },
        expiredIn: {
          type: Number,
        },
      },
      paymentIntents: [
        new mongoose.Schema(
          {
            id: {
              type: String,
            },
            created: {
              type: Date,
            },
          },
          {
            _id: false,
          }
        ),
      ],
      couponId: String,
    },
    trashDay: String,
    trashTime: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("customers", userSchema);

module.exports = User;

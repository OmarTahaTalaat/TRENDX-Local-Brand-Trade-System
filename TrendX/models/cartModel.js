const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],

    totalCartPrice: Number,

    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "cartItems.product",
    select: "title imageCover category quantity",
  }).populate({ path: "seller", select: "shopName shopImage active" });

  next();
});

const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;

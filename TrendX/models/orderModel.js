const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "products must be produced by seller"],
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must be belong to customer"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
      },
    ],

    shippingAddress: {
      phone: String,
      address: {
        street: String,
        city: String,
      },
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },

    totalOrderPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      default: "cash",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "delivered", "canceled"],
      required: true,
    },
    changeStatusTime: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customer",
    select: "name email phone",
  })
    .populate({
      path: "cartItems.product",
      select: "title imageCover sellerId quantity",
    })
    .populate({
      path: "seller",
      select: "name shopName shopImage email phone",
    });

  next();
});
const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;

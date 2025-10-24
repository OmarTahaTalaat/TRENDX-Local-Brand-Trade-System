const mongoose = require("mongoose");
// const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    rating: {
      type: Number,
      min: [1, "Min rating value is 1.0"],
      max: [5, "Max rating value is 5.0"],
      required: [true, "review rating required"],
    },

    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to customer"],
    },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "customer", select: "email name" });
  next();
});

const reviewModel = mongoose.model("Review", reviewSchema);
module.exports = reviewModel;

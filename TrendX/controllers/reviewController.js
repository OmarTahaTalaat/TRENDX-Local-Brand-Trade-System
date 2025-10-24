const asyncHandler = require("express-async-handler");

const {
  getReviewByIdDB,
  getReviewDB,
  getProductReviewsDB,
  createReviewDB,
  updateReviewDB,
  deleteReviewDB,
} = require("../database/reviewDB");
const { getProductByIdDB, updateProductDB } = require("../database/productDB");
const { getOrdersDB } = require("../database/orderDB");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");

const getReview_S = asyncHandler(async (req, res, next) => {
  const reviewExcludedFields = "-__v";

  // get specific review

  if (req.query.reviewId) {
    const review = await getReviewByIdDB(
      req.query.reviewId,
      reviewExcludedFields
    );

    if (!review) {
      return next(new ApiError("review not found", 404));
    }

    const product = await getProductByIdDB(review.product);

    if (!product || product.seller.active === false) {
      return next(new ApiError("Product not found"), 404);
    }

    return sendSuccessResponse(res, { review }, 200);
  }

  // get product reviews

  if (!req.query.productId) {
    return next(new ApiError("productId is required", 404));
  }

  const product = await getProductByIdDB(req.query.productId);

  if (!product || product.seller.active === false) {
    return next(new ApiError("Product not found"));
  }

  req.query.fields = req.query.fields || reviewExcludedFields;

  const reviews = await getProductReviewsDB(req);

  const response = { ...reviews };

  sendSuccessResponse(res, response, 200);
});

const createReview = asyncHandler(async (req, res, next) => {
  const customerId = req.user._id;
  const productId = req.params.productId;
  const { title, rating } = req.body;

  const product = await getProductByIdDB(productId);

  if (!product || product.seller.active === false) {
    return next(new ApiError("Product not found", 404));
  }

  const pastOrders = await checkOrders(productId, customerId);

  if (!pastOrders) {
    return next(new ApiError("You aren't allowed to make review", 400));
  }

  const oldReview = await getReviewDB({
    customer: customerId,
    product: productId,
  });

  if (oldReview) {
    return next(new ApiError("The review has already been created"));
  }

  await createReviewDB({
    title,
    rating,
    customer: customerId,
    product: productId,
  });

  // calcutate newRating after new rate added
  let newRating =
    ((product.ratingsAverage || 0) * product.ratingsQuantity + rating) /
    (product.ratingsQuantity + 1);

  newRating = parseFloat(newRating.toFixed(1));

  product.ratingsAverage = newRating;
  product.ratingsQuantity++;

  await updateProductDB(
    { _id: product._id },
    {
      ratingsAverage: product.ratingsAverage,
      ratingsQuantity: product.ratingsQuantity,
    }
  );

  const response = { message: "Review created successfully" };

  sendSuccessResponse(res, response, 201);
});

const updateReview = asyncHandler(async (req, res, next) => {
  const customerId = req.user._id;

  const reviewId = req.params.reviewId;

  const { title, rating } = req.body;

  const review = await getReviewByIdDB(reviewId);

  if (!review) {
    return next(new ApiError("Review not found"));
  }

  const product = await getProductByIdDB(review.product);

  if (!product || product.seller.active === false) {
    return next(new ApiError("Product not found"));
  }

  if (review.customer._id.toString() !== customerId.toString()) {
    return next(new ApiError("You cannot update this review"));
  }

  await updateReviewDB({ _id: review._id }, { title, rating });

  if (rating) {
    // calcutate newRating after old rate updated
    let newRating =
      ((product.ratingsAverage || 0) * product.ratingsQuantity -
        review.rating +
        rating) /
      product.ratingsQuantity;

    newRating = parseFloat(newRating.toFixed(1));

    product.ratingsAverage = newRating;

    await updateProductDB(
      { _id: product._id },
      {
        ratingsAverage: product.ratingsAverage,
      }
    );
  }

  const response = { message: "Review updated successfully" };

  sendSuccessResponse(res, response, 200);
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const reviewId = req.params.reviewId;

  const review = await getReviewByIdDB(reviewId);

  if (!review) {
    return next(new ApiError("Review not found"));
  }

  let product = await getProductByIdDB(review.product);

  if (!product || product.seller.active === false) {
    return next(new ApiError("Product not found"));
  }

  if (
    review.customer._id.toString() !== user._id.toString() &&
    user.role !== "admin"
  ) {
    return next(new ApiError("You cannot delete this review"));
  }

  await deleteReviewDB({ _id: review._id });

  // calcutate newRating after old rate deleted
  let newRating =
    ((product.ratingsAverage || 0) * product.ratingsQuantity - review.rating) /
    (product.ratingsQuantity - 1 || 1);

  newRating = parseFloat(newRating.toFixed(1));

  product.ratingsQuantity--;

  if (product.ratingsQuantity <= 0) {
    product.ratingsAverage = undefined;
    product.ratingsQuantity = 0;
  } else {
    product.ratingsAverage = newRating;
  }

  await updateProductDB(
    { _id: product._id },
    {
      ratingsAverage: product.ratingsAverage,
      ratingsQuantity: product.ratingsQuantity,
    }
  );

  const response = { message: "Review deleted successfully" };

  sendSuccessResponse(res, response, 200);
});

const checkOrders = async (productId, customerId) => {
  const pastOrders = await getOrdersDB({
    customer: customerId,
    cartItems: {
      $elemMatch: {
        product: productId,
      },
    },
    status: "delivered",
  });

  return pastOrders.length ? true : false;
};

module.exports = {
  getReview_S,
  createReview,
  updateReview,
  deleteReview,
};

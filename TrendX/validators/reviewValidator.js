const { param, query, body } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const getReviewValidator = [
  query("reviewId")
    .optional()
    .isMongoId()
    .withMessage("Invalid review id format"),

  query("productId")
    .optional()
    .isMongoId()
    .withMessage("Invalid product id format"),

  validatorMiddleware,
];

const createReviewValidator = [
  body("title").isString(),

  body("rating", "rating value required and must be a number between 1 to 5")
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .custom((value) => typeof value === "number"),

  param("productId").isMongoId().withMessage("Invalid product id format"),

  validatorMiddleware,
];

const updateReviewValidator = [
  param("reviewId").isMongoId().withMessage("Invalid review id format"),

  body("title").optional().isString(),

  body("rating", "rating value required and must be a number between 1 to 5")
    .optional()
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .custom((value) => typeof value === "number"),

  validatorMiddleware,
];

const deleteReviewValidator = [
  param("reviewId").isMongoId().withMessage("Invalid review id format"),

  validatorMiddleware,
];

module.exports = {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
};

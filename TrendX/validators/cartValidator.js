const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const addToCartValidator = [
  check("productId").isMongoId().withMessage("Invalid ID formate"),

  validatorMiddleware,
];

const updateCartValidator = [
  check("cartId").isMongoId().withMessage("Invalid ID formate"),
  check("itemId").isMongoId().withMessage("Invalid ID formate"),
  check("type")
    .notEmpty()
    .withMessage("type is required")
    .isIn(["+", "-"])
    .withMessage("type must be '+' or '-'"),

  validatorMiddleware,
];

const deleteFromCartValidator = [
  check("cartId").isMongoId().withMessage("Invalid ID formate"),
  check("itemId").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

module.exports = {
  addToCartValidator,
  deleteFromCartValidator,
  updateCartValidator,
};

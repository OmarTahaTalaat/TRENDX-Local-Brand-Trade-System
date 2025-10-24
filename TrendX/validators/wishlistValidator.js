const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const addToWishlistValidator = [
  check("productId").notEmpty().withMessage("product id is required").isMongoId().withMessage("Invalid ID formate"),

  validatorMiddleware,
];


const deleteFromWishListValidator = [
  check("productId").isMongoId().withMessage("Invalid ID formate"),

  validatorMiddleware,
];

module.exports = {
  addToWishlistValidator,
  deleteFromWishListValidator,
};

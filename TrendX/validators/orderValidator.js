const { body, param } = require("express-validator");

const validatorMiddleware = require("../middlewares/validatorMiddleware");

const updateOrderStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Please enter status")
    .isIn(["accepted", "delivered", "canceled"])
    .withMessage("Status must be one of: accepted, delivered, canceled"),

  validatorMiddleware,
];

const validateCartId = [
  param("cartId").isMongoId().withMessage("Invalid cart id format"),

  validatorMiddleware,
];

const actualSalesValidator = [
  body("period")
    .notEmpty()
    .withMessage("Please enter period")
    .isIn(["lastYear", "lastMonth", "lastWeek", "lastDay"])
    .withMessage(
      "period must be one of: lastYear, lastMonth, lastWeek, lastDay"
    ),

  validatorMiddleware,
];

module.exports = {
  updateOrderStatusValidator,
  validateCartId,
  actualSalesValidator,
};

const { body } = require("express-validator");

const validatorMiddleware = require("../middlewares/validatorMiddleware");

const registerAsCustomerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Please enter your name")
    .isString()
    .withMessage("name must be a string"),

  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Please enter your phoneNumber")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter valid egyptian phoneNumber"),

  body("address")
    .notEmpty()
    .withMessage("Please enter your address")
    .isObject()
    .withMessage(
      "Please enter a valid address object containing street and city"
    ),

  body("address.street")
    .notEmpty()
    .withMessage("street in address is required")
    .isString()
    .withMessage("street must be a string"),

  body("address.city")
    .notEmpty()
    .withMessage("city in address is required")
    .isString()
    .withMessage("city must be a string"),

  validatorMiddleware,
];

const registerAsSellerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Please enter your name")
    .isString()
    .withMessage("name must be a string"),

  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Please enter your phoneNumber")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter valid egyptian phoneNumber"),

  body("shopName")
    .notEmpty()
    .withMessage("Please enter your shopName")
    .isString()
    .withMessage("shopName must be a string"),

  body("shopAddress")
    .notEmpty()
    .withMessage("Please enter your shopAddress")
    .isString()
    .withMessage("shopAddress must be a string"),

  validatorMiddleware,
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isString()
    .withMessage("password must be a string"),

  validatorMiddleware,
];

const forgotPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  validatorMiddleware,
];

const verifyResetCodeValidator = [
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("resetCode")
    .notEmpty()
    .withMessage("Please resetCode")
    .isLength({ min: 6, max: 6 })
    .withMessage("resetCode must be at 6 digits"),

  validatorMiddleware,
];

const resetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("newPassword")
    .notEmpty()
    .withMessage("Please enter password")
    .isString()
    .withMessage("password must be a string")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters"),

  validatorMiddleware,
];

module.exports = {
  registerAsCustomerValidator,
  registerAsSellerValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
};

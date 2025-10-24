const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const getProductValidator = [
  check("productId").optional().isMongoId().withMessage("Invalid ID formate"),

  validatorMiddleware,
];

const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required"),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Too short description"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0, max: 200000 })
    .withMessage("Product price must be a number between 0->200000"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a number"),

  check("imageCover").notEmpty().withMessage("Product imageCover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),

  check("category")
    .notEmpty()
    .isString()
    .withMessage("Product must be belong to a category"),

  validatorMiddleware,
];

const updateProductValidator = [
  check("productId").isMongoId().withMessage("Invalid ID formate"),

  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required"),

  check("description")
    .optional()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Too short description"),

  check("price")
    .optional()
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0, max: 200000 })
    .withMessage("Product price must be a number between 0->200000"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 0 })
    .withMessage("Product quantity must be a number"),

  check("imageCover")
    .optional()
    .notEmpty()
    .withMessage("Product imageCover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),

  check("category")
    .optional()
    .isString()
    .withMessage("Product must be belong to a category"),

  validatorMiddleware,
];

const deleteProductValidator = [
  check("productId").isMongoId().withMessage("Invalid ID formate"),

  validatorMiddleware,
];

module.exports = {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
};

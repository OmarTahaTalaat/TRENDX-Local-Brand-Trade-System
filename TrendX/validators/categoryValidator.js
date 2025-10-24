const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const getCategoryValidator = [
  check("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id format"),

  validatorMiddleware,
];

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category  name required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),

  check("image").notEmpty().withMessage("Category image is required"),

  validatorMiddleware,
];

const deleteCategoryValidator = [
  check("categoryId").isMongoId().withMessage("Invalid category id format"),

  validatorMiddleware,
];

module.exports = {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
};

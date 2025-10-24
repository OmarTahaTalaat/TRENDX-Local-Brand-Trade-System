const uuid = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");
const {
  getCategoryByIdDB,
  createCategoryDB,
  getAllCategoriesDB,
  getCategoryDB,
  deleteCategoryDB,
} = require("../database/categoryDB");

// Upload Category image
const uploadCategoryImage = uploadSingleImage("image");

// Image storage
const imageStorage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuid.v4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${fileName}`);

    // Save image into our db
    req.body.image = fileName;
  }

  next();
});

const getCategory_S = asyncHandler(async (req, res, next) => {
  const categoryExcludedFields = "-__v";

  // get specific Product

  if (req.query.categoryId) {
    const category = await getCategoryByIdDB(
      req.query.categoryId,
      categoryExcludedFields
    );

    if (!category) {
      return next(new ApiError("category not found", 404));
    }

    return sendSuccessResponse(res, { category }, 200);
  }

  // get all  categories

  req.query.fields = req.query.fields || categoryExcludedFields;

  const categories = await getAllCategoriesDB(req);

  const response = { ...categories };

  sendSuccessResponse(res, response, 200);
});

const createCategory = asyncHandler(async (req, res, next) => {
  const { name, image } = req.body;

  const category = await getCategoryDB({ name });

  if (category) {
    return next(new ApiError("category is already exist", 400));
  }

  await createCategoryDB({
    name,
    image,
  });

  const response = { message: "category created successfully" };

  sendSuccessResponse(res, response, 200);
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.categoryId;

  const category = await getCategoryByIdDB(categoryId);

  if (!category) {
    return next(new ApiError("category not found", 404));
  }

  await deleteCategoryDB({ _id: category._id });

  const response = { message: "category deleted successfully" };

  sendSuccessResponse(res, response, 200);
});

module.exports = {
  getCategory_S,
  createCategory,
  uploadCategoryImage,
  imageStorage,
  deleteCategory,
};

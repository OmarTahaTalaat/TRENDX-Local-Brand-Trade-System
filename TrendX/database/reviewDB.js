const reviewModel = require("../models/reviewModel");
const ApiFeatures = require("../utils/apiFeatures");

const getReviewByIdDB = async (id, excludedFields = "") => {
  return await reviewModel.findById(id).select(excludedFields);
};

const getReviewDB = async (field, excludedFields = "") => {
  return await reviewModel.findOne(field).select(excludedFields);
};

const getCountOfDocument = async (field) => {
  return await reviewModel.find(field).countDocuments();
};

const getProductReviewsDB = async (req) => {
  // get count of reviews to use it in pagination results
  const documentsCounts = await getCountOfDocument({
    product: req.query.productId,
  });

  // apply api features
  const apiFeatures = new ApiFeatures(
    reviewModel.find({ product: req.query.productId }),
    req.query
  )
    .paginate(documentsCounts)
    .limitFields()
    .sort();

  // result from api features
  const { mongooseQuery, paginationResult } = apiFeatures;

  const reviews = await mongooseQuery;

  return { paginationResult, reviews };
};

const createReviewDB = async (data) => {
  return await reviewModel.create(data);
};

const updateReviewDB = async (field, data) => {
  return await reviewModel.updateOne(field, data);
};

const deleteReviewDB = async (field) => {
  return await reviewModel.deleteOne(field);
};

module.exports = {
  getReviewByIdDB,
  getReviewDB,
  getProductReviewsDB,
  createReviewDB,
  updateReviewDB,
  deleteReviewDB,
};

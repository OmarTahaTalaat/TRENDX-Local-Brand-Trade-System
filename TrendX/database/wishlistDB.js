const wishlistModel = require("../models/wishlistModel");
const ApiFeatures = require("../utils/apiFeatures");

// const getProductByIdDB = async (id, excludedFields = "") => {
//   return await wishlistModel.findById(id).select(excludedFields);
// };

const getWishlistDB = async (field, excludedFields = "") => {
  return await wishlistModel.findOne(field).select(excludedFields);
};

const getCountOfDocument = async (field) => {
  return await wishlistModel.find(field).countDocuments();
};

const getAllWishlistDB = async (req) => {
  // get count of products to use it in pagination results
  const documentsCounts = await getCountOfDocument();

  // apply api features
  const apiFeatures = new ApiFeatures(wishlistModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("wishlist")
    .limitFields()
    .sort();

  let { mongooseQuery, paginationResult } = apiFeatures;

  // result from api features
  // const { mongooseQuery, paginationResult } = apiFeatures;

  const wishlist = await mongooseQuery;

  return { paginationResult, wishlist };
};

const addToWhishlistDB = async (data) => {
  return await wishlistModel.create(data);
};

const deleteFromWishlistDB = async (field) => {
  return await wishlistModel.findOneAndDelete(field);
};

module.exports = {
  deleteFromWishlistDB,
  addToWhishlistDB,
  getAllWishlistDB,
  getWishlistDB,
};

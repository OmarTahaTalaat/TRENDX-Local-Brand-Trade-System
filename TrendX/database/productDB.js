const productModel = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");

const getProductByIdDB = async (id, excludedFields = "") => {
  return await productModel.findById(id).select(excludedFields);
};

const getProductDB = async (field, excludedFields = "") => {
  return await productModel.findOne(field).select(excludedFields);
};

const getCountOfDocument = async (field) => {
  return await productModel.find(field).countDocuments();
};

const getAllProductsDB = async (req) => {
  // get count of products to use it in pagination results
  const documentsCounts = await getCountOfDocument();

  // apply api features
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("products")
    .limitFields()
    .sort();

  let { mongooseQuery, paginationResult } = apiFeatures;

  const products = await mongooseQuery;

  return { paginationResult, products };
};

const getProductsByImagesDB = async (imageName) => {
  const query = {
    imageCover: { $regex: imageName, $options: "i" },
  };

  return await productModel.findOne(query);
};

const getSpecificProductsDB = async (req) => {
  // apply api features
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .filter()
    .search("products")
    .limitFields()
    .sort();

  let { mongooseQuery } = apiFeatures;

  const products = await mongooseQuery;

  return products;
};

const createProductDB = async (data) => {
  return await productModel.create(data);
};

const updateProductDB = async (field, data) => {
  return await productModel.findOneAndUpdate(field, data);
};

const deleteProductDB = async (field) => {
  return await productModel.findOneAndDelete(field);
};

const productBulkWriteDB = async (operations, options = {}) => {
  return await productModel.bulkWrite(operations, options);
};

module.exports = {
  getProductByIdDB,
  productBulkWriteDB,
  deleteProductDB,
  updateProductDB,
  createProductDB,
  getAllProductsDB,
  getSpecificProductsDB,
  getProductsByImagesDB,
  getProductDB,
};

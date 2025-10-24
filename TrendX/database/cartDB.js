const cartModel = require("../models/cartModel");
const ApiFeatures = require("../utils/apiFeatures");

const getCartDB = async (field, excludedFields = "") => {
  return await cartModel.findOne(field).select(excludedFields);
};

const getCartByIdDB = async (id, excludedFields = "") => {
  return await cartModel.findById(id).select(excludedFields);
};

const getCustomerCartsDB = async (customerId) => {
  return await cartModel.find({ customer: customerId });
};

const getAllCartDB = async (req) => {
  // apply api features
  const apiFeatures = new ApiFeatures(
    cartModel.find({ customer: req.query.customerId }),
    req.query
  ).sort();

  let { mongooseQuery } = apiFeatures;
  const carts = await mongooseQuery;

  return { carts };
};

const addToCartDB = async (data) => {
  return await cartModel.create(data);
};

const deleteCartDB = async (field) => {
  return await cartModel.findOneAndDelete(field);
};

module.exports = {
  getCartDB,
  getCartByIdDB,
  getAllCartDB,
  getCustomerCartsDB,
  addToCartDB,
  deleteCartDB,
};

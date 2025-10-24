const orderModel = require("../models/orderModel");
const ApiFeatures = require("../utils/apiFeatures");

const getOrderByIdDB = async (id, excludedFields = "") => {
  return await orderModel.findById(id).select(excludedFields);
};

const getCountOfDocument = async () => {
  return await orderModel.find().countDocuments();
};

const getAllOrdersDB = async (req) => {
  const documentsCounts = await getCountOfDocument();

  const apiFeatures = new ApiFeatures(orderModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .limitFields()
    .sort();

  const { mongooseQuery, paginationResult } = apiFeatures;

  const orders = await mongooseQuery;

  return { paginationResult, orders };
};



const getOrdersDB = async (query) => {

  return await orderModel.find(query);
};

const createOrderDB = async (data) => {
  return await orderModel.create(data);
};

module.exports = {
  getOrderByIdDB,
  getAllOrdersDB,
  createOrderDB,
  getOrdersDB
};

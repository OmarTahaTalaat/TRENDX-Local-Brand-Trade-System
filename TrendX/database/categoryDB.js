const categoryModel = require("../models/categoryModel");
const ApiFeatures = require("../utils/apiFeatures")

const getCategoryByIdDB = async (id, excludedFields = "") => {
  return await categoryModel.findById(id).select(excludedFields);
};

const getCategoryDB = async (field, excludedFields = "") => {
  return await categoryModel.findOne(field).select(excludedFields);
};

const getCountOfDocument = async (field) => {
  return await categoryModel.find(field).countDocuments();
};

const getAllCategoriesDB = async ( req) => {
  // get count of products to use it in pagination results
  const documentsCounts = await getCountOfDocument();

  // apply api features
  const apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("categories")
    .limitFields()
    .sort();

    let { mongooseQuery, paginationResult } = apiFeatures;


  // result from api features
  // const { mongooseQuery, paginationResult } = apiFeatures;

  const categories = await mongooseQuery;

  return { paginationResult, categories };
};



const createCategoryDB = async (data) => {
  return await categoryModel.create(data);
};

// const updateCategoryDB = async (field, data) => {
//   return await productModel.findOneAndUpdate(field, data);
// };

const deleteCategoryDB = async (field) => {
  return await categoryModel.findOneAndDelete(field);
};


module.exports = {
  getCategoryByIdDB,
  // updateCategoryDB,
  createCategoryDB,
  getAllCategoriesDB,
  getCategoryDB,
  deleteCategoryDB



};

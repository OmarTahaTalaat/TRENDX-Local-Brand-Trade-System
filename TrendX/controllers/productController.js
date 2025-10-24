const asyncHandler = require("express-async-handler");
const uuid = require("uuid");
const sharp = require("sharp");
const axios = require("axios");
const FormData = require("form-data");

const { getCategoryDB } = require("../database/categoryDB");
const {
  getProductByIdDB,
  deleteProductDB,
  updateProductDB,
  createProductDB,
  getAllProductsDB,
  getSpecificProductsDB,
  getProductsByImagesDB,
  getProductDB,
} = require("../database/productDB");
const {
  uploadSingleImage,
  uploadMixOfImages,
} = require("../middlewares/uploadImageMiddleware");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");

const uploadImageSearch = uploadSingleImage("image");

const uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 10,
  },
]);

const imageStorage = asyncHandler(async (req, res, next) => {
  if (req.files) {
    if (req.files.imageCover) {
      const imageCoverFileName = `product-${uuid.v4()}-${Date.now()}.jpeg`;

      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);

      req.body.imageCover = imageCoverFileName;

      // Save image into image search model
      saveImageInDataSet(imageCoverFileName);
    }

    if (req.files.images) {
      req.body.images = [];

      await Promise.all(
        req.files.images.map(async (img, index) => {
          let imageName = `product-${uuid.v4()}-${Date.now()}-${
            index + 1
          }.jpeg`;

          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);

          // Save image into our db
          req.body.images.push(imageName);
        })
      );
    }
  }
  next();
});

const getSellerProduct_S = asyncHandler(async (req, res, next) => {
  const productExcludedFields = "-__v";

  // get specific Product
  if (req.query.productId) {
    const product = await getProductDB(
      { _id: req.query.productId, seller: req.user._id },
      productExcludedFields
    );

    if (!product) {
      return next(new ApiError("Product not found", 404));
    }

    return sendSuccessResponse(res, { product }, 200);
  }

  // get all  Products

  req.query.fields = req.query.fields || productExcludedFields;

  req.query.seller = req.user._id;

  const products = await getAllProductsDB(req);

  const response = { ...products };

  sendSuccessResponse(res, response, 200);
});

const getActiveProduct_S = asyncHandler(async (req, res, next) => {
  const productExcludedFields = "-__v";

  // get specific Product
  if (req.query.productId) {
    const product = await getProductByIdDB(
      req.query.productId,
      productExcludedFields
    );

    if (!product || product.seller.active === false) {
      return next(new ApiError("Product not found", 404));
    }

    return sendSuccessResponse(res, { product }, 200);
  }

  req.query.fields = req.query.fields || productExcludedFields;

  // get all Products
  let products = await getSpecificProductsDB(req);

  // get only Active Products
  products = products.filter((product) => product.seller.active === true);

  // apply pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const start = (page - 1) * limit;
  const end = start + limit;
  products = products.slice(start, end);

  const response = { products: [...products] };

  sendSuccessResponse(res, response, 200);
});

const getProduct_S = asyncHandler(async (req, res, next) => {
  const productExcludedFields = "-__v";

  // get specific Product
  if (req.query.productId) {
    const product = await getProductByIdDB(
      req.query.productId,
      productExcludedFields
    );

    if (!product) {
      return next(new ApiError("Product not found", 404));
    }

    return sendSuccessResponse(res, { product }, 200);
  }

  // get all  Products

  req.query.fields = req.query.fields || productExcludedFields;

  const products = await getAllProductsDB(req);

  const response = { ...products };

  sendSuccessResponse(res, response, 200);
});

const imageSearch = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No image uploaded", 400));
  }

  const images = (await getModelResults(req.file)).data.images;

  let products = await Promise.all(
    images.map(async (image) => {
      const product = await getProductsByImagesDB(image);
      if (product != null && product.seller.active === true) {
        return product;
      }
    })
  );

  products = products.filter((product) => product);

  const response = { products };

  sendSuccessResponse(res, response, 200);
});

const getModelResults = async (file) => {
  try {
    const form = new FormData();
    form.append("image", file.buffer, file.originalname);

    const response = await axios.post(
      "http://127.0.0.1:3500/ImageSearch",
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

const saveImageInDataSet = async (imageName) => {
  try {
    const form = new FormData();
    form.append("imageName", imageName);

    const response = await axios.post("http://127.0.0.1:3500/SaveImage", form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const createProduct = asyncHandler(async (req, res, next) => {
  const sellerId = req.user._id;

  const { title, price, quantity, description, images, imageCover, category } =
    req.body;

  const product = await getProductDB({ seller: sellerId, title });

  if (product) {
    return next(new ApiError("product title is already exist", 400));
  }

  const categoryName = await getCategoryDB({ name: category });

  if (!categoryName) {
    return next(new ApiError(`No category found : ${category}`, 400));
  }

  await createProductDB({
    seller: sellerId,
    title,
    price,
    quantity: +quantity,
    description,
    images,
    imageCover,
    category: categoryName._id,
  });

  const response = { message: "product created successfully" };

  sendSuccessResponse(res, response, 201);
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const sellerId = req.user._id;

  const productId = req.params.productId;

  const oldProduct = await getProductDB({ _id: productId, seller: sellerId });

  if (!oldProduct) {
    return next(new ApiError("Product not exists"));
  }

  let { title, price, quantity, description, images, imageCover, category } =
    req.body;

  if (title) {
    const product = await getProductDB({ seller: sellerId, title });

    if (product && product.title !== oldProduct.title) {
      return next(new ApiError("product title is already exist", 400));
    }
  }

  if (category) {
    const categoryName = await getCategoryDB({ name: category });

    if (!categoryName) {
      return next(new ApiError(`No category found : ${category}`, 400));
    }

    category = categoryName._id;
  }

  // Assuming updateProductDB expects productId and an object containing updated fields
  await updateProductDB(
    { _id: productId },
    {
      title,
      price,
      quantity: +quantity,
      description,
      images,
      imageCover,
      category,
    }
  );

  const response = { message: "Product updated successfully" };

  sendSuccessResponse(res, response, 200);
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.productId;

  const product = await getProductByIdDB(productId);

  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  if (
    product.seller._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ApiError("You cannot delete this product"));
  }

  await deleteProductDB({ _id: product._id });

  const response = { message: "product deleted successfully" };

  sendSuccessResponse(res, response, 200);
});

module.exports = {
  getProduct_S,
  getSellerProduct_S,
  getActiveProduct_S,
  createProduct,
  uploadProductImages,
  imageStorage,
  updateProduct,
  deleteProduct,
  imageSearch,
  uploadImageSearch,
};

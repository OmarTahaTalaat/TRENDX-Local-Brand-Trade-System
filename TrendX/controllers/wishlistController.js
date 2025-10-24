const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const { sendSuccessResponse } = require("../utils/responseHandler");
const { getWishlistDB, addToWhishlistDB } = require("../database/wishlistDB");
const { getProductByIdDB } = require("../database/productDB");

const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const customer = req.user._id;

  const wishlist = await getWishlistDB({ customer });

  const response = { wishlist: wishlist ? wishlist.wishlist : [] };

  sendSuccessResponse(res, response, 200);
});

const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const customer = req.user._id;

  const product = await getProductByIdDB(req.body.productId);

  if (!product || product.seller.active === false) {
    return next(
      new ApiError(`There is no product for this id ${req.body.productId}`, 404)
    );
  }

  const wishlist = await getWishlistDB({ customer });

  if (!wishlist) {
    // create cart fot logged user with product
    await addToWhishlistDB({
      customer,
      wishlist: [{ product }],
    });
  } else {
    const productIndex = wishlist.wishlist.findIndex((item) => {
      if (item.product) {
        return item.product._id.toString() === product._id.toString();
      }
    });

    if (productIndex > -1) {
      return next(new ApiError("product is already exist", 400));
    } else {
      // product not exist in cart,  push product to cartItems array
      wishlist.wishlist.push({ product });
    }

    await wishlist.save();
  }

  const response = { message: "Product added successfully to your wishlist." };

  sendSuccessResponse(res, response, 200);
});

const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const product = req.params.productId;

  const customer = req.user._id;

  const wishlist = await getWishlistDB({ customer });

  if (!wishlist) {
    // create cart fot logged user with product
    return next(new ApiError("Product not found in wishlist", 404));
  } else {
    const productIndex = wishlist.wishlist.findIndex((item) => {
      if (item.product) {
        return item.product._id.toString() === product;
      }
    });

    if (productIndex > -1) {
      wishlist.wishlist.splice(productIndex, 1);
    } else {
      // product not exist in cart,  push product to cartItems array
      return next(new ApiError("product doesn't exist", 404));
    }

    await wishlist.save();
  }

  const response = { message: "product deleted successfully from wishlist" };
  sendSuccessResponse(res, response, 200);
});

module.exports = {
  getLoggedUserWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
};

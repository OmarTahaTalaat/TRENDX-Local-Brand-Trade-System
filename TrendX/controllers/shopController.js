const asyncHandler = require("express-async-handler");

const { getUsersByRoleDB, getUserDB } = require("../database/userDB");
const { sendSuccessResponse } = require("../utils/responseHandler");
const ApiError = require("../utils/apiError");

const getShop_S = asyncHandler(async (req, res, next) => {
  const sellerIncludedFields = "_id shopName shopAddress shopImage";
  // get specific seller

  if (req.query.shopId) {
    const shop = await getUserDB(
      { _id: req.query.shopId, role: "seller", active: true },
      sellerIncludedFields
    );

    if (!shop) {
      return next(new ApiError("shop not found", 404));
    }

    return sendSuccessResponse(res, { shop }, 200);
  }

  // get all sellers
  req.query.fields = sellerIncludedFields;

  req.query.active = true;

  const shops = await getUsersByRoleDB("seller", req);

  const response = { ...shops };

  sendSuccessResponse(res, response, 200);
});

module.exports = { getShop_S };

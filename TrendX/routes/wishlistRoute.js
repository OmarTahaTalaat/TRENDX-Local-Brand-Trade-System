const router = require("express").Router({ mergeParams: true });
const {
  addToWishlistValidator,
  deleteFromWishListValidator,
} = require("../validators/wishlistValidator");

const { protect, allowedTo } = require("../middlewares/authMiddleware");

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../controllers/wishlistController");

// Use the middleware function in a route

router.use(protect, allowedTo("customer"));

router
  .route("/")
  .get(getLoggedUserWishlist)
  .post(addToWishlistValidator, addProductToWishlist);

router.delete(
  "/:productId",
  deleteFromWishListValidator,
  removeProductFromWishlist
);

module.exports = router;

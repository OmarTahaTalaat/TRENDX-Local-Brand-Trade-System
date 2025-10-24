const router = require("express").Router({ mergeParams: true });

const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
  addToCartValidator,
  deleteFromCartValidator,
  updateCartValidator,
} = require("../validators/cartValidator");
const {
  addProductToCart,
  getCustomerCart_S,
  clearCart,
  removeSpecificCartItem,
  updateCartItemQuantity,
} = require("../controllers/cartController");

router.use(protect, allowedTo("customer"));

router
  .route("/")
  .get(getCustomerCart_S)
  .post(addToCartValidator, addProductToCart)
  .patch(updateCartValidator, updateCartItemQuantity)
  .delete(deleteFromCartValidator, removeSpecificCartItem);

router.delete("/:cartId", clearCart);

module.exports = router;

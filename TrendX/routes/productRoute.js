const router = require("express").Router({ mergeParams: true });

const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../validators/productValidator");
const {
  getProduct_S,
  getSellerProduct_S,
  getActiveProduct_S,
  createProduct,
  imageStorage,
  uploadProductImages,
  updateProduct,
  deleteProduct,
  imageSearch,
  uploadImageSearch,
} = require("../controllers/productController");

router.get("/active", getProductValidator, getActiveProduct_S);

router.post("/active/imageSearch", uploadImageSearch, imageSearch);

router.use(protect);

router.get(
  "/seller",
  allowedTo("seller"),
  getProductValidator,
  getSellerProduct_S
);

router
  .route("/")
  .get(allowedTo("admin"), getProductValidator, getProduct_S)
  .post(
    allowedTo("seller"),
    uploadProductImages,
    imageStorage,
    createProductValidator,
    createProduct
  );

router
  .route("/:productId")
  .patch(
    allowedTo("seller"),
    uploadProductImages,
    imageStorage,
    updateProductValidator,
    updateProduct
  )
  .delete(allowedTo("seller", "admin"), deleteProductValidator, deleteProduct);

module.exports = router;

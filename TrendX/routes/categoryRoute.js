const router = require("express").Router();

const { protect, allowedTo } = require("../middlewares/authMiddleware");
const {
  getCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
} = require("../validators/categoryValidator");
const {
  getCategory_S,
  createCategory,
  deleteCategory,
  uploadCategoryImage,
  imageStorage,
} = require("../controllers/categoryController");

router.get("/", getCategoryValidator, getCategory_S);

router.use(protect, allowedTo("admin"));

router.post(
  "/",
  uploadCategoryImage,
  imageStorage,
  createCategoryValidator,
  createCategory
);

router.delete("/:categoryId", deleteCategoryValidator, deleteCategory);

module.exports = router;

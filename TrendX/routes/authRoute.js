const router = require("express").Router();

const {
  registerAsCustomerValidator,
  registerAsSellerValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetCodeValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");
const {
  registerAsCustomer,
  registerAsSeller,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/authController");
const {
  uploadShopImage,
  imageStorage,
} = require("../controllers/userController");

router.post(
  "/registerAsCustomer",
  registerAsCustomerValidator,
  registerAsCustomer
);

router.post(
  "/registerAsSeller",
  uploadShopImage,
  imageStorage,
  registerAsSellerValidator,
  registerAsSeller
);

router.post("/login", loginValidator, login);

router.post("/forgotPassword", forgotPasswordValidator, forgotPassword);

router.post("/verifyResetCode", verifyResetCodeValidator, verifyResetCode);

router.patch("/resetPassword", resetPasswordValidator, resetPassword);

module.exports = router;

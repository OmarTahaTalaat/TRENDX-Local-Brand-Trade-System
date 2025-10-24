const express = require("express");

const {
  getOrder_S,
  createCashOrder,
  updateOrderStatus,
  predictRevenue,
  GetActualTotalSales,
} = require("../controllers/orderController");
const {
  updateOrderStatusValidator,
  validateCartId,
  actualSalesValidator,
} = require("../validators/orderValidator");
const { protect, allowedTo } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route("/:cartId")
  .post(allowedTo("customer"), validateCartId, createCashOrder);

router.get("/", allowedTo("customer", "seller", "admin"), getOrder_S);
router.get("/predictRevenue", allowedTo("seller"), predictRevenue);
router.post(
  "/sales/actual",
  allowedTo("seller"),
  actualSalesValidator,
  GetActualTotalSales
);

router.patch(
  "/status/:orderId",
  allowedTo("seller"),
  updateOrderStatusValidator,
  updateOrderStatus
);

module.exports = router;

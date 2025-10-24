const express = require("express");
const {
  getAllSupportChats,
  getSupportMessages,
  sendSupportMessage,
  getMyShopChats,
  getShopMessages,
  sendShopMessage,
  getShopsNames,
  getMyCustomerChats,
} = require("../controllers/chatController");
const { protect, allowedTo } = require("../middlewares/authMiddleware");
const { sendMessageValidator } = require("../validators/chatValidator");
const router = express.Router({ mergeParams: true });

router.use(protect);

// Support Chat
router.get("/support", allowedTo("admin"), getAllSupportChats);

router.get("/support/message", getSupportMessages);

router.post("/support/message", sendMessageValidator, sendSupportMessage);

// Shop Chat
router.get("/shop/message", getShopMessages);

router.get("/shop/customerChat", allowedTo("customer"), getMyCustomerChats);

router.get("/shop/shopNames", allowedTo("admin"), getShopsNames);

router.get("/shop", allowedTo("seller", "admin"), getMyShopChats);

router.post(
  "/shop/message",
  allowedTo("seller", "customer"),
  sendMessageValidator,
  sendShopMessage
);

module.exports = router;

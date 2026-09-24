const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const isAuth = require("../middleware/isAuth");

// Tạo đơn hàng mới
router.post("/create", isAuth, orderController.createOrder);

// Xem chi tiết đơn hàng (cho user)
router.get("/:id", isAuth, orderController.getOrderDetail);

// Admin: Xem danh sách đơn hàng
router.get("/admin/list", isAuth, orderController.getAdminOrderList);

// Admin: Cập nhật trạng thái đơn hàng
router.post(
  "/admin/update-status/:id",
  isAuth,
  orderController.updateOrderStatus,
);

module.exports = router;
